import bcrypt from 'bcrypt';
import {
  trimmedString,
  trimmedLowercaseString,
  SchemaFactory
} from '@app/data/base';
import { IUserModel } from './user.model';
import env from '@app/common/config/env';

const UserSchema = SchemaFactory({
  password: { ...trimmedString, required: true, select: false },
  email: {
    ...trimmedLowercaseString,
    unique: true,
    index: true,
    required: true
  },
  first_name: { ...trimmedLowercaseString, required: true },
  last_name: { ...trimmedLowercaseString },
  middle_name: { ...trimmedLowercaseString },
  profile_picture: { ...trimmedString },
  gender: { ...trimmedString, enum: ['male', 'female'] }
});

/**
 * Mongoose Pre-save hook used to hash passwords for new users
 */
UserSchema.pre('save', async function() {
  const user = <IUserModel>this;
  if (!user.isNew) return;

  const hash = await bcrypt.hash(user.password, env.salt_rounds);
  user.password = hash;
});

/**
 * Document method used to check if a plain text password is the same as a hashed password
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('isPasswordValid', async function(plainText: string) {
  const user = <IUserModel>this;
  const result = await bcrypt.compare(plainText, user.password);
  return result;
});

/**
 * Document method used to change a user's password.
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('updatePassword', async function(plainText: string) {
  const user = <IUserModel>this;
  const hash = await bcrypt.hash(plainText, env.salt_rounds);
  user.password = hash;
  return await user.save();
});

export default UserSchema;
