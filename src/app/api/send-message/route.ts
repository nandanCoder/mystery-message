import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";
export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 404 }
      );
    }
    // is accepting the message
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accpting the message",
        },
        { status: 400 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message); // asart  kar rha hhu ma in ciore this type
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
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
      { status: 401 }
    );
  }
}
