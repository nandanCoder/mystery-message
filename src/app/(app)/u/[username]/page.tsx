"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/validation/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCompletion } from "ai/react";

function SendMessage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const { toast } = useToast();

  const param = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const messageContent = form.watch("content");
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const responce = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username: param.username,
      });
      if (!responce.data.success) {
        setIsError(responce.data.message);
        toast({
          title: "Error",
          description: responce.data.message,
          variant: "destructive",
        });
      }
      if (responce.data.success) {
        toast({
          title: "Success",
          description: responce.data.message,
        });
      }
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      console.log("Error in sending message :: ", error);

      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        description:
          axiosError.response?.data.message ?? "Error sending message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ai api key not abalabel
  // const suggestion = async () => {
  //   try {
  //     const response = await axios.post<ApiResponse>(
  //       "/api/suggest-messages",
  //       {}
  //     );
  //     console.log("response data ai ", response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // suggestion();

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous Message to @{param?.username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      {/* // ai */}
    </div>
  );
}

export default SendMessage;
