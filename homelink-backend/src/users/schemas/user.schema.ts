import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ sparse: true, unique: true, trim: true })
  phoneNumber?: string;

  @Prop({ select: false })
  passwordHash?: string;

  @Prop({ sparse: true, unique: true })
  googleId?: string;

  @Prop({ sparse: true, unique: true })
  facebookId?: string;

  @Prop({ trim: true })
  displayName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
