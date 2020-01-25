import { Model } from '../base';

export interface IUserModel extends Model {
  deleted_at: Date;

  // personal details
  email: string;
  gender: Gender;
  password: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  profile_picture: string;

  isPasswordValid: (plainText: string) => Promise<Boolean>;
  updatePassword: (plainText: string) => Promise<IUserModel>;
}

export type Gender = 'male' | 'female';

/**
 * Payload sent for a signup request
 */
export interface SignupDTO {
  email: string;
  gender?: Gender;
  password: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  profile_picture?: string;
}
