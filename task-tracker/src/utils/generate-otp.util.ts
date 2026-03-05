import crypto from 'node:crypto';

export const generateOtp = function () {
  return crypto.randomInt(100000, 1000000);
};
