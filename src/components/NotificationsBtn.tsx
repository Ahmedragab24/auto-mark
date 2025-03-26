import { useEffect, useState } from "react";
import { useGetNotificationsQuery } from "@/store/apis/notifications";
import type React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellRing } from "lucide-react";
import LoginModel from "./auth/LoginModel";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface NotificationProps {
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const NotificationsBtn: React.FC<NotificationProps> = ({
  onOpenChange,
  className,
}) => {
  const { UserData } = useAppSelector((state: RootState) => state);
  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: 5000,
  });

  const notificationsCount = data?.countUnreadNotifications || 0;
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const user = UserData.token;
    setToken(user || null);
  }, [UserData.token]);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <>
      {!token ? (
        <LoginModel className={className}>
          <Button variant="secondary" size="icon" className="relative">
            <BellRing className="w-6 h-6 text-gray-700 dark:text-white" />
          </Button>
        </LoginModel>
      ) : (
        <Link
          href="/notifications"
          onClick={() => onOpenChange?.(false)}
          aria-label="الإشعارات"
          className={`relative inline-block ${className}`}
        >
          <Button variant="secondary" size="icon" className="relative">
            <BellRing className="w-6 h-6 text-gray-700 dark:text-white" />
          </Button>

          {notificationsCount > 0 && (
            <div className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full shadow-md bg-secondary text-primary -top-1 -left-2">
              {notificationsCount}
            </div>
          )}
        </Link>
      )}
    </>
  );
};

export default NotificationsBtn;
