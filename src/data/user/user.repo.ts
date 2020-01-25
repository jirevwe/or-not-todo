import { Request } from 'express';
import logger, { reqSerializer } from '@app/common/services/logger';
import { IUserModel, SignupDTO } from './user.model';
import UserSchema from './user.schema';
import { UserNotFoundError } from '@app/server/controllers/base';
import { BaseRepository } from '../base';

export class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super('User', UserSchema);
  }

  /**
   * Gets the `device_id`'s of the user's whose phone number's have been supplied.
   * @param numbers The phone numbers of the user's whom the notification is meant to be sent to.
   * @returns A list of the `device_id`'s
   */
  async getDeviceIds(numbers: string[]): Promise<string[]> {
    const users = await this.model
      .aggregate()
      .match({ phone_number: { $in: numbers } })
      .group({ _id: '$device_id' });

    return users.map(it => it._id);
  }

  /**
   * Gets a user using their id or phone numbe rand throws a `UserNotFoundError` if the user is not found
   * @param id User id
   * @param errorMessage Error message to be used if the user is not found.
   */
  async getUser(id: string, errorMessage?: string) {
    const user = await this.model.findOne({
      $or: [{ _id: id }, { phone_number: id }],
      deleted_at: undefined
    });

    if (!user) throw new UserNotFoundError(errorMessage || id);

    return user;
  }

  /**
   * Returns a boolean indicating whether a user exists
   * @param conditions Conditions for validating the existence of the user.
   */
  async exists(conditions: object): Promise<boolean> {
    const user = await this.model.findOne(conditions);
    return !!user;
  }

  /**
   * If the call to create a new wallet fails, rollback account creation and
   * delete the created user
   * @param req Express request object
   * @param body Body for a signup request
   */
  async rollBackAccountCreation(req: Request, body: SignupDTO) {
    try {
      await this.destroy({ phone_number: body.email });

      logger.message({
        info: 'Successfully rolled back account creation',
        req
      });
    } catch (err) {
      logger.error(err, {
        info: 'An error occured while rolling back account creation',
        data: body,
        req: reqSerializer(req)
      });
    }
  }
}

/**
 * Wallet Repository class instance shared across the app.
 */
export const UserRepo = new UserRepository();
