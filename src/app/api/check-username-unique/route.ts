import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/validation/signUpSchema";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zood
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log("Result username ", result);
    if (!result.success) {
      // extrect error
      const usernameErroes = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErroes.length > 0
              ? usernameErroes.join(", ")
              : "Invalid query params",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const existingVerifingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifingUser) {
      return Response.json({
        success: false,
        message: "Username is alredy taken",
      });
    }
    return Response.json({
      success: true,
      message: "Username is unique",
    });
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
