"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/utils/userToken";
import { toast } from "@/hooks/use-toast";
import ChatArea from "@/components/ChatArea";
import { useGetChatsQuery, useMarkAsUnreadCountQuery } from "@/store/apis/chat";
import type { AllChatTypes } from "@/types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoaderSpan from "@/components/LoaderSpan";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function MessagesPage() {
  const router = useRouter();
  const user = getUserData();
  const { language } = useAppSelector((state: RootState) => state.Language);
  const { data, isLoading } = useGetChatsQuery("", {
    pollingInterval: 5000,
  });
  const { data: UnReadCount } = useMarkAsUnreadCountQuery("", {
    pollingInterval: 5000,
  });
  const unreadCountAllChats: number = UnReadCount?.data?.unread_chats_count;

  const AllChats: AllChatTypes[] = data?.chats || [];

  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on search query
  const filteredChats = AllChats.filter(
    (chat) =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.peer_user?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (chatId: number) => {
    if (selectedConversation !== chatId) {
      setSelectedConversation(chatId);
    }
  };

  useEffect(() => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يرجى تسجيل الدخول للوصول لهذه الصفحة",
        variant: "destructive",
      });

      router.replace("/");
    }
  }, [user, router]);

  if (!user) return null;

  if (isLoading) return <LoaderSpan />;

  return (
    <div className="container py-10 px-4 mx-auto mt-44" dir="rtl">
      <Breadcrumbs />

      {AllChats.length === 0 ? (
        <div className="h-[65vh] flex flex-col gap-2 items-center justify-center mx-auto">
          <MessageSquare className="w-14 h-14 text-primary" />
          <h1 className="text-3xl font-semibold">
            {language === "ar" ? "لا يوجد رسائل" : "No Messages"}
          </h1>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Conversations List */}
          <div
            className={`border-border md:w-80 md:border md:rounded-2xl ${
              selectedConversation !== null ? "hidden md:block" : "w-full"
            }`}
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">
                  {language === "ar" ? "الرسائل" : "Messages"}
                </h1>
                {unreadCountAllChats > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                    {unreadCountAllChats}
                  </span>
                )}
              </div>
              <div className="relative">
                <Search className="absolute w-4 h-4 right-3 top-3 text-primary" />
                <Input
                  className="pr-9"
                  placeholder={language === "ar" ? "بحث" : "Search"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-4 space-y-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent"
                    onClick={() => handleConversationClick(chat.id)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          `${process.env.NEXT_PUBLIC_BASE_URL}${chat.peer_user?.setting?.logo}` ||
                          "/Logo/Logo.png"
                        }
                        alt={chat.name || chat.peer_user?.name || ""}
                      />
                      <AvatarFallback>
                        {(chat.name || chat.peer_user?.name || "?")[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {chat.name || chat.peer_user?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {chat.last_message?.message}
                      </p>
                    </div>
                    {chat.unread_count > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          {selectedConversation !== null ? (
            <ChatArea
              chatId={selectedConversation}
              userId={
                AllChats.find((chat) => chat.id === selectedConversation)
                  ?.peer_user?.id
              }
              chatLogo={
                AllChats.find((chat) => chat.id === selectedConversation)
                  ?.peer_user?.setting?.logo
              }
              chatUserName={
                AllChats.find((chat) => chat.id === selectedConversation)
                  ?.name ||
                AllChats.find((chat) => chat.id === selectedConversation)
                  ?.peer_user?.name
              }
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="hidden md:flex md:flex-1 items-center justify-center bg-accent/10 rounded-2xl">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-xl font-medium">
                  {language === "ar"
                    ? "اختر محادثة للبدء في الدردشة"
                    : "Select a conversation to start a chat"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {language === "ar"
                    ? "حدد محادثة من القائمة للبدء في الدردشة"
                    : "Click on a conversation to start a chat"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
