import { ApiResponse } from "./../types/ApiResponse";
import { Resend } from "resend";
import VerificationEmail from "../../emails/verificationEmail";
import { resend } from "@/lib/resendEmail";

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: {
  email: string;
  username: string;
  verifyCode: string;
}): Promise<ApiResponse> {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystey message | verification code ",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "Verification email sent",
      data: data,
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      message: "Error sending verification email",
      error: emailError,
    };
  }
}
