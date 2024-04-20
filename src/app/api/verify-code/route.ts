import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { NextRequest } from "next/server";
import { verifySchema } from "@/validation/verifySchema";
import { usernameValidation } from "@/validation/signUpSchema";

const verifyQuerySchema = z.object({
  username: usernameValidation,
  code: verifySchema,
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { userName, verifyCode } = await request.json();
    // decodeURIComponent  for url %20 for spec
    const decodedUsername = decodeURIComponent(userName);
    //console.log(userName, verifyCode);

    const result = verifyQuerySchema.safeParse({
      username: decodedUsername,
      code: verifyCode,
    });

    console.log("Result username ", result);
    if (!result.success) {
      // extrect error
      const usernameErroes = result.error.format().username?._errors || [];
      const codeErroes = result.error.format().code?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            codeErroes.length > 0
              ? codeErroes.join(", ")
              : "Invalid query code" || usernameErroes.length > 0
              ? usernameErroes.join(", ")
              : "Invalid query params",
        },
        {
          status: 400,
        }
      );
    }

    const { username, code } = result.data;
    const user = await UserModel.findOne({
      username: username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          messae: "User not found",
        },
        {
          status: 500,
        }
      );
    }
    const isCodeValid = (user.varifyCode = code);
    const isCodeNotExpired = new Date(user.varifyCodeExpiry) > new Date();
    if (isCodeValid || isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired pliease signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error varifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error  varifying user ",
      },
      {
        status: 500,
      }
    );
  }
}
