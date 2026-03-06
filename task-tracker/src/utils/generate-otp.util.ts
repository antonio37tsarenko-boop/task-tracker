import { randomInt } from 'node:crypto';

export const generateOtp = function () {
  return randomInt(100000, 1000000).toString();
};
