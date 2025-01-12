// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';
// @Schema({ timestamps: true })
// export class AdminSignUp extends Document {

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop()
//   surname?: string;

//   @Prop()
//   givenName?: string;

//   @Prop()
//   mobileNoCountryCode?: string;

//   @Prop()
//   mobileNo?: number;

//   @Prop()
//   access_token?: string;

//   @Prop()
//   prefredLanguage?: string;

//   @Prop()
//   verificationCode?: string;

//   @Prop({ type: Date })
//   otpCreatedTime: Date
// }

// export const AdminSignUpSchema = SchemaFactory.createForClass(AdminSignUp);
