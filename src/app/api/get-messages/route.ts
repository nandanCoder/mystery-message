import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function GET(request: Request) {
  //console.log(request);
  await dbConnect();
  //console.log("i am hare");
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  // console.log(userId);
  try {
    const user = await UserModel.aggregate([
      // pipline agrigation
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: { "messages.createdAt": -1 },
      },
      {
        $group: { _id: "$_id", messages: { $push: "$messages" } },
      },
    ]).exec();
    //console.log("this is user::", !user.length);
    if (!user || user.length === 0) {
      return Response.json(
        {
          succes: false,
          message: "Messages not found",
        },
        {
          status: 400,
        }
      );
    }
    //console.log("thisuser", user);
    return Response.json(
      {
        success: false,
        messages: user[0].messages,
      },
      { status: 201 }
    );
  } catch (error) {
    //console.log(error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch messages from server",
      },
      { status: 401 }
    );
  }
}
