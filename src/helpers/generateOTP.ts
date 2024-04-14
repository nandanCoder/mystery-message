/**
 * Generates a random 6-digit One Time Password (OTP).
 * @returns A string representing the 6-digit OTP.
 */
export function generateOTP(): string {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const otp = Math.floor(min + Math.random() * (max - min + 1)).toString(); // Generate random number and convert to string
  return otp;
}

// Example usage
