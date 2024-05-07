import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: { messageId: string };
  }
) {
  const messageId = params.messageId;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const updatedResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    if (updatedResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already  deleted ",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message Deleted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("An unexpcted error occured: ", error);
    return Response.json(
      {
        success: false,
        message: "An unexpcted error occured: ",
      },
      { status: 500 }
    );
  }
}
