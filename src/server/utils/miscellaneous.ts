import crypto from 'crypto';
import { promisify } from 'util';

/**
 * Checks if a given account number, which is a phone number in this case has a missing leading 0 which is usually caused by the phone number being trimmed to 10 characters to meet the standard for most banking applications.
 * If it is it adds the leading 0, else it returns it as is.
 * @param account_number The account number to be sanitized
 */
export const normalizeAccountNumber = (account_number: string) => {
  return /^[7-9][0-1][0-9]{8}/i.test(account_number)
    ? `0${account_number}`
    : account_number;
};

/**
 * Generates random bytes
 */
export const genRandomBytes = promisify(crypto.randomBytes);

/**
 * Generates random digits of a specified length
 * @param length The amount of random digits to generate and return
 */
export const randomDigits = (length: number) => {
  const digits = Array.from({ length }).reduce((prev, curr) => {
    return prev + String(Math.floor(Math.random() * 9));
  }, '') as string;

  return digits;
};

export const getResponseData = async <T = any>(promise: Promise<any>) => {
  const res = await promise;
  return res.data.data as T;
};