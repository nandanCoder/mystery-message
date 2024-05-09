import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { generateOTP } from "@/helpers/generateOTP";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    if ([username, email, password].some((field) => field == "")) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }
    const userAlreadyExistsWithThisUssername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    // console.log("data::", userAlreadyExistsWithThisUssername);

    if (userAlreadyExistsWithThisUssername) {
      return Response.json(
        {
          success: false,
          message: "User name already taken.",
        },
        {
          status: 400,
        }
      );
    }

    // cheack user already ragisteted
    const userAlreadyExistsByEmail = await UserModel.findOne({ email });
    const otp = generateOTP();

    if (userAlreadyExistsByEmail) {
      //
      if (userAlreadyExistsByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists in this email address. Please login.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userAlreadyExistsByEmail.password = hashedPassword;
        userAlreadyExistsByEmail.varifyCode = otp;
        userAlreadyExistsByEmail.varifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await userAlreadyExistsByEmail.save();
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        varifyCode: otp,
        varifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const sendEmail = await sendVerificationEmail({
      email,
      username,
      verifyCode: otp,
    });
    console.log("send email", sendEmail);
    if (!sendEmail.success) {
      return Response.json(
        {
          success: false,
          message: sendEmail.messages,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Sign up successful. Please verify your email.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error signing up:", error);
    return Response.json(
      {
        success: false,
        message: "Error signing up. Please try again later.",
      },
      {
        status: 500,
      }
    );
  }
}
