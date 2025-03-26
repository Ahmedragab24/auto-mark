"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  ArrowRight,
  Image,
  Paperclip,
  MapPin,
  Loader,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetChatByIdQuery,
  useGetChatsQuery,
  useSendMessageMutation,
} from "@/store/apis/chat";
import { getUserData } from "@/utils/userToken";
import type {
  DataInShowChatType,
  UploadFiletype,
  ChatSendType,
  ErrorType,
  ShowChatType,
  AllChatTypes,
} from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface ChatAreaProps {
  userId?: number | undefined;
  chatId?: number | undefined;
  productId?: number | undefined;
  chatLogo?: string;
  chatUserName?: string;
  onBack?: () => void;
}

export default function ChatArea({
  chatId,
  productId,
  userId,
  chatLogo,
  chatUserName,
  onBack,
}: ChatAreaProps) {
  const user = getUserData();
  const { data: Chats } = useGetChatsQuery("", {
    pollingInterval: 5000,
  });
  const [ChatID, setChatID] = useState<number | undefined>(chatId);
  const { data, refetch, isLoading } = useGetChatByIdQuery(ChatID, {
    pollingInterval: 1000,
  });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const AllChats: AllChatTypes[] = Chats?.chats || [];

  // Initialize chat data with default empty values
  const ShowChat: ShowChatType = data || {
    messages: { data: [] },
    product: {},
  };

  // State management
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<UploadFiletype>("text");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [ShowChat?.messages?.data, scrollToBottom]);

  // If the ChatId includes in the AllChat
  const chatFound = AllChats.find(
    (chat) => chat.id === ShowChat?.messages?.data[0]?.chat_id
  )?.id;

  useEffect(() => {
    if (chatId) {
      setChatID(chatId);
    } else if (chatFound && !ChatID) {
      setChatID(chatFound);
    }
  }, [chatFound, chatId, ChatID]);

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is readable
    const reader = new FileReader();
    reader.onload = () => {
      // If we can read the file, it's likely valid
      // Check file type
      if (file.type.startsWith("image/")) {
        setAttachmentType("image");
      } else {
        setAttachmentType("file");
      }

      setAttachment(file);
    };
    reader.onerror = () => {
      toast({
        title: "خطأ",
        description: "الملف غير قابل للقراءة. يرجى اختيار ملف آخر.",
        variant: "destructive",
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // Check if string is a valid URL
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // Render message based on type
  const renderMessage = (msg: DataInShowChatType) => {
    switch (msg.type) {
      case "image":
        return (
          <div className="max-w-xs">
            <img
              src={
                `${process.env.NEXT_PUBLIC_BASE_URL || "/placeholder.svg"}${
                  msg.message
                }` || "/placeholder.svg"
              }
              alt="Image"
              className="rounded-md max-w-full h-auto"
              loading="lazy"
            />
          </div>
        );
      case "file":
        return (
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <a
              href={msg.message}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-700"
            >
              Download File
            </a>
          </div>
        );
      case "location":
        try {
          const location = JSON.parse(msg.message);
          return (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Location Shared</span>
              </div>
              <a
                href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-500 hover:text-blue-700"
              >
                View on Map
              </a>
            </div>
          );
        } catch (e) {
          console.error("Error parsing location data:", e);
          return <span>Invalid location data</span>;
        }
      case "text":
        return <span>{msg.message}</span>;
      default:
        // Check if message is a URL
        if (isValidUrl(msg.message)) {
          return (
            <a
              href={msg.message}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-700"
            >
              {msg.message}
            </a>
          );
        }
        return <span>{msg.message}</span>;
    }
  };

  // Handle sending location
  const handleSendLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "خطأ",
        description: "متصفحك لا يدعم مشاركة الموقع",
        variant: "destructive",
      });
      return;
    }

    if (!ChatID && !userId) {
      toast({
        title: "خطأ",
        description: "معلومات المحادثة غير مكتملة",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const newMessage: ChatSendType = {
          user_id: userId,
          message: JSON.stringify(locationData),
          type: "location",
          ...(ChatID ? { chat_id: Number(ChatID) } : {}),
          ...(productId ? { product_id: Number(productId) } : null),
        };

        sendMessageToServer(newMessage);
        setAttachmentType("text"); // Reset attachment type after sending
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "خطأ",
          description: "فشل في الحصول على الموقع",
          variant: "destructive",
        });
      }
    );
  };

  // Send message to server
  const sendMessageToServer = async (messageData: ChatSendType) => {
    try {
      await sendMessage(messageData).unwrap();
      // Clear input after successful send
      setMessage("");
      setAttachment(null);
      setAttachmentType("text");
      // Refetch chat data
      refetch();
    } catch (error) {
      const errorMessage =
        (error as ErrorType)?.data?.message || "حدث خطاء غير متوقع";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle file upload - fixed to properly handle file uploads
  const handleFileUpload = async (file: File): Promise<void> => {
    if (!file) return;

    if (!ChatID && !userId) {
      toast({
        title: "خطأ",
        description: "معلومات المحادثة غير مكتملة",
        variant: "destructive",
      });
      return;
    }

    // Validate file type and size
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (attachmentType === "image" && !validImageTypes.includes(file.type)) {
      toast({
        title: "خطأ",
        description:
          "نوع الملف غير مدعوم. يرجى استخدام صور JPEG أو PNG أو GIF.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "خطأ",
        description: "حجم الملف كبير جدًا. الحد الأقصى هو 5 ميجابايت.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Changed "message" to "file" to match expected API parameter
    formData.append("user_id", String(userId));
    formData.append("type", attachmentType);
    if (ChatID) {
      formData.append("chat_id", String(ChatID)); // Ensure chat_id is a string
    }
    if (productId) {
      formData.append("product_id", String(productId)); // Add product_id if available
    }

    try {
      await sendMessage(formData).unwrap();
      setAttachment(null);
      setAttachmentType("text");
      setMessage("");
    } catch (error) {
      console.error("File upload error:", error);
      const errorMessage =
        (error as ErrorType)?.data?.message || "فشل في رفع الملف";
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle form submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ChatID && !userId) {
      toast({
        title: "خطأ",
        description: "معلومات المحادثة غير مكتملة",
        variant: "destructive",
      });
      return;
    }

    // If there's an attachment, handle it separately
    if (attachment) {
      await handleFileUpload(attachment);
      return;
    }

    // If it's a location message
    if (attachmentType === "location") {
      handleSendLocation();
      return;
    }

    // If it's a text message
    if (message.trim() !== "") {
      const newMessage: ChatSendType = {
        user_id: userId,
        message: message,
        type: "text",
        ...(ChatID && { chat_id: Number(ChatID) }),
        product_id: productId ? Number(productId) : null,
      };

      sendMessageToServer(newMessage);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [ShowChat?.messages?.data, scrollToBottom]);

  return (
    <div className="flex flex-col flex-1 border rounded-2xl overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onBack}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_BASE_URL}${chatLogo}`}
              alt={ShowChat?.product?.name || ""}
            />
            <AvatarFallback>
              {(ShowChat?.product?.name || "?")[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{ShowChat?.product?.name || "Chat"}</h3>
            {chatUserName && (
              <p className="text-xs text-muted-foreground">{chatUserName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4 h-[calc(100vh-16rem)] flex flex-col-reverse">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div ref={messagesEndRef} />
            {ShowChat?.messages?.data.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                لا توجد رسائل. ابدأ المحادثة الآن!
              </div>
            ) : (
              [...ShowChat?.messages?.data]
                .reverse()
                .map((msg: DataInShowChatType) => {
                  const isOwnMessage = msg?.user_id === user?.user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex gap-2 max-w-[80%] ${
                          isOwnMessage ? "flex-row-reverse" : ""
                        }`}
                      >
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}/avatars/${msg.user_id}.png`}
                              alt="User"
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`p-3 rounded-lg ${
                              isOwnMessage
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {renderMessage(msg)}
                          </div>
                          {msg.created_at && (
                            <div
                              className={`text-xs text-muted-foreground mt-1 ${
                                isOwnMessage ? "text-right" : "text-left"
                              }`}
                            >
                              {formatDistanceToNow(new Date(msg.created_at), {
                                addSuffix: true,
                                locale: ar,
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}
      </ScrollArea>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setAttachmentType("image");
                    fileInputRef.current?.click();
                  }}
                >
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إرفاق صورة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setAttachmentType("file");
                    fileInputRef.current?.click();
                  }}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إرفاق ملف</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleSendLocation}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إرسال الموقع</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              attachment ? `${attachment.name} مرفق` : "اكتب رسالتك هنا..."
            }
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={
              isSending ||
              (!message.trim() && !attachment && attachmentType !== "location")
            }
          >
            {isSending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        style={{ display: "none" }}
      />
    </div>
  );
}
