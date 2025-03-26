import { useMarkAsUnreadCountQuery } from "@/store/apis/chat";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import React, { useEffect, useState } from "react";
import LoginModel from "./auth/LoginModel";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

interface IProps {
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const MessagesBtn = ({ className, onOpenChange }: IProps) => {
  const { UserData } = useAppSelector((state: RootState) => state);
  const { data } = useMarkAsUnreadCountQuery("", {
    pollingInterval: 5000,
  });

  const unreadCountAllChats: number = data?.data?.unread_chats_count || 0;
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const user = UserData.token;
    setToken(user || null);
  }, [UserData.token]);

  if (!isClient) return null;

  return (
    <>
      {!token ? (
        <LoginModel className={className}>
          <Button variant="secondary" size="icon" className="relative">
            <MessagesSquare className="w-6 h-6 text-gray-700 dark:text-white" />
          </Button>
        </LoginModel>
      ) : (
        <Link
          href="/messages"
          onClick={() => onOpenChange?.(false)}
          aria-label="Messages"
          className={`relative inline-block ${className}`}
        >
          <Button variant="secondary" size="icon" className="relative">
            <MessagesSquare className="w-6 h-6 text-gray-700 dark:text-white" />
          </Button>

          {unreadCountAllChats > 0 && (
            <div className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full shadow-md bg-secondary text-primary -top-1 -left-2">
              {unreadCountAllChats}
            </div>
          )}
        </Link>
      )}
    </>
  );
};

export default MessagesBtn;
