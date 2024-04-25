import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { isAcceptingMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: isAcceptingMessages,
      },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Message accepting status not  updated successfully",
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message accepting status   updated successfully",
          data: updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("faild to update user status to acceptMessagesS");
    return Response.json(
      {
        success: false,
        message: "faild to update user status to acceptMessagess",
      },
      { status: 401 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "USer not found",
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "userFound successfully",
          isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error in fetching user data massage accptance status",
      },
      { status: 401 }
    );
  }
}
