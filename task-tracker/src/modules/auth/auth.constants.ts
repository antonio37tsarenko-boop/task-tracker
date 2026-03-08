export const getOtpText = (otp: number | string) => `OTP: ${otp}`;
export const OTP_SENT_ERROR = 'OTP already sent. Check your email.';
export const WRONG_OTP_ERROR = 'Wrong otp.';
export const OTP_NOT_REQUESTED_ERROR = 'Otp is not requested for this user.';
export const CACHE_DATA_DAMAGED_ERROR = 'Data in cache is damaged.';
export const WRONG_PASSWORD_ERROR = 'Wrong password';
export const SAME_PASSWORD_ERROR = 'Same password';
export const WRONG_RESET_TOKEN_ERROR = 'Wrong reset token.';
export const RESET_TOKEN_NOT_REQUESTED_ERROR = 'Wrong reset token.';
