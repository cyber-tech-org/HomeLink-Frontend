import { IsString, Length, Matches } from 'class-validator';
import { NigeriaPhoneDto } from './nigeria-phone.dto';

export class VerifyOtpDto extends NigeriaPhoneDto {
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;
}
