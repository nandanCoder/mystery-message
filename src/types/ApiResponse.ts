import { Message } from "@/model/user.model";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Message[];
  data?: any;
  error?: any;
}
