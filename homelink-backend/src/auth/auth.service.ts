import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';
import {
  JWT_TYP_ACCESS,
  JWT_TYP_PASSWORD_RESET,
  JWT_TYP_SIGNUP_SETUP,
} from './auth.constants';
import { CompleteResetPasswordDto } from './dto/complete-reset.dto';
import { CompleteSignupDto } from './dto/complete-signup.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordRequestDto } from './dto/reset-request.dto';
import { SignupRequestOtpDto } from './dto/signup-request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UsersService } from '../users/users.service';
import type { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  private get otpTtlMs(): number {
    const minutes = Number(
      this.config.get<string>('OTP_EXPIRES_MINUTES', '10'),
    );
    return (Number.isFinite(minutes) ? minutes : 10) * 60 * 1000;
  }

  private generateOtp(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  private signAccessToken(user: UserDocument): string {
    return this.jwtService.sign({
      sub: user._id.toString(),
      typ: JWT_TYP_ACCESS,
      phoneNumber: user.phoneNumber ?? undefined,
    });
  }

  private authResponse(user: UserDocument) {
    return {
      access_token: this.signAccessToken(user),
      user: {
        id: user._id.toString(),
        phoneNumber: user.phoneNumber ?? null,
        displayName: user.displayName ?? null,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhoneWithPassword(
      dto.phoneNumber,
    );
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Incorrect phone/password!');
    }
    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Incorrect phone/password!');
    }
    return this.authResponse(user);
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByPhone(dto.phoneNumber);
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }
    const user = await this.usersService.createWithPhoneAndPassword(
      dto.phoneNumber,
      dto.password,
    );
    return this.authResponse(user);
  }

  async signupRequestOtp(dto: SignupRequestOtpDto) {
    const existing = await this.usersService.findByPhone(dto.phoneNumber);
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }
    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.otpTtlMs);
    await this.usersService.upsertOtp(
      dto.phoneNumber,
      'signup',
      code,
      expiresAt,
    );
    if (this.config.get<string>('NODE_ENV') !== 'production') {
      this.logger.log(`[DEV] Signup OTP for ${dto.phoneNumber}: ${code}`);
    }
    return { message: 'OTP sent' };
  }

  async signupVerifyOtp(dto: VerifyOtpDto) {
    const existing = await this.usersService.findByPhone(dto.phoneNumber);
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }
    const ok = await this.usersService.verifyOtpAndDelete(
      dto.phoneNumber,
      'signup',
      dto.code,
    );
    if (!ok) {
      throw new BadRequestException('Invalid OTP');
    }
    const setupToken = this.jwtService.sign(
      { typ: JWT_TYP_SIGNUP_SETUP, phone: dto.phoneNumber },
      { expiresIn: '15m' },
    );
    return { setupToken };
  }

  async signupComplete(dto: CompleteSignupDto) {
    let payload: { typ?: string; phone?: string };
    try {
      payload = this.jwtService.verify<{ typ?: string; phone?: string }>(
        dto.setupToken,
      );
    } catch {
      throw new BadRequestException('Invalid or expired setup token');
    }
    if (payload.typ !== JWT_TYP_SIGNUP_SETUP || !payload.phone) {
      throw new BadRequestException('Invalid or expired setup token');
    }
    const existing = await this.usersService.findByPhone(payload.phone);
    if (existing) {
      throw new ConflictException('Phone number already registered');
    }
    const user = await this.usersService.createWithPhoneAndPassword(
      payload.phone,
      dto.password,
    );
    return this.authResponse(user);
  }

  async requestPasswordReset(dto: ResetPasswordRequestDto) {
    const user = await this.usersService.findByPhone(dto.phoneNumber);
    if (!user) {
      throw new NotFoundException('Phone not registered');
    }
    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.otpTtlMs);
    await this.usersService.upsertOtp(
      dto.phoneNumber,
      'reset_password',
      code,
      expiresAt,
    );
    if (this.config.get<string>('NODE_ENV') !== 'production') {
      this.logger.log(
        `[DEV] Password reset OTP for ${dto.phoneNumber}: ${code}`,
      );
    }
    return { message: 'OTP sent' };
  }

  async resetVerifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByPhone(dto.phoneNumber);
    if (!user) {
      throw new NotFoundException('Phone not registered');
    }
    const ok = await this.usersService.verifyOtpAndDelete(
      dto.phoneNumber,
      'reset_password',
      dto.code,
    );
    if (!ok) {
      throw new BadRequestException('Invalid OTP');
    }
    const resetToken = this.jwtService.sign(
      { typ: JWT_TYP_PASSWORD_RESET, sub: user._id.toString() },
      { expiresIn: '15m' },
    );
    return { resetToken };
  }

  async resetComplete(dto: CompleteResetPasswordDto) {
    let payload: { typ?: string; sub?: string };
    try {
      payload = this.jwtService.verify<{ typ?: string; sub?: string }>(
        dto.resetToken,
      );
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
    if (payload.typ !== JWT_TYP_PASSWORD_RESET || !payload.sub) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    await this.usersService.updatePassword(payload.sub, dto.password);
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new BadRequestException('User no longer exists');
    }
    return this.authResponse(user);
  }

  async oauthLogin(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authResponse(user);
  }
}
