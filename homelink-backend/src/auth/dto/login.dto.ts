import { IsString, MinLength } from 'class-validator';
import { NigeriaPhoneDto } from './nigeria-phone.dto';

export class LoginDto extends NigeriaPhoneDto {
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
