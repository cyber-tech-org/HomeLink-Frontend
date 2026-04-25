import { MinLength } from 'class-validator';
import { Match } from '../../common/validators/match.decorator';
import { NigeriaPhoneDto } from './nigeria-phone.dto';

/** Direct sign-up without OTP (useful for testing; production may prefer the signup OTP flow). */
export class RegisterDto extends NigeriaPhoneDto {
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @MinLength(8)
  @Match('password', { message: 'Password not match! Check again' })
  confirmPassword: string;
}
