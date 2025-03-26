"use client";

import { useEffect, useState } from "react";
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useMarkAllReadMutation,
} from "@/store/apis/notifications";
import type { ErrorType, NotificationType } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellOff, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { Breadcrumbs } from "@/components/Breadcrumbs ";
import LoaderSpan from "@/components/LoaderSpan";
import { getUserData } from "@/utils/userToken";
import { useRouter } from "next/navigation";
import { UserDataState } from "@/store/features/userData";

const NotificationsPage = () => {
  const { data, isLoading } = useGetNotificationsQuery(undefined);
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  const [markAllRead] = useMarkAllReadMutation();
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const [notificationsList, setNotificationsList] = useState<
    NotificationType[]
  >([]);
  const router = useRouter();
  const [user, setUser] = useState<UserDataState | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
    // Get user data only once on mount
    const userData = getUserData();
    setUser(userData);
  }, []);

  // Mark all notifications as read only once when user is available
  useEffect(() => {
    if (user && user.token) {
      // Using a ref to ensure this only runs once
      const markReadOnce = async () => {
        try {
          await markAllRead(user.token).unwrap();
        } catch (error) {
          console.error("Failed to mark notifications as read:", error);
        }
      };

      markReadOnce();
    }
  }, [user, markAllRead]); // Only depend on user, not markAllRead

  // Redirect if not logged in
  useEffect(() => {
    if (isClient && !user) {
      toast({
        title: language === "en" ? "Please log in" : "يرجى تسجيل الدخول",
        description:
          language === "en"
            ? "Please log in to access this page"
            : "يرجى تسجيل الدخول للوصول لهذه الصفحة",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [isClient, user, router, language]);

  // Update notifications list when data changes
  useEffect(() => {
    if (data?.notifications) {
      setNotificationsList(data.notifications);
    }
  }, [data]);

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      setNotificationsList((prev) => prev.filter((notif) => notif.id !== id));
      toast({
        title: language === "en" ? "Notification deleted" : "تم حذف الإشعار",
        description:
          language === "en"
            ? "The notification has been successfully deleted."
            : "تم حذف الإشعار بنجاح.",
      });
    } catch (err: unknown) {
      const error = err as ErrorType;
      toast({
        title: "Error",
        description: error?.data?.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications("").unwrap();
      setNotificationsList([]);
      toast({
        title:
          language === "en"
            ? "All notifications deleted"
            : "تم حذف كل الإشعارات",
        description:
          language === "en"
            ? "All notifications have been successfully deleted."
            : "تم حذف جميع الإشعارات بنجاح.",
      });
    } catch (err) {
      const error = err as ErrorType;
      toast({
        title: "Error",
        description: error?.data?.message,
        variant: "destructive",
      });
    }
  };

  if (!isClient) return null;
  if (!user) return null;

  return (
    <div className="container px-4 py-10 mx-auto mt-36">
      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <Breadcrumbs />
        {notificationsList.length > 0 && (
          <Button variant="destructive" onClick={handleDeleteAllNotifications}>
            {language === "en"
              ? "Delete All Notifications"
              : "حذف كل الإشعارات"}
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoaderSpan className="!h-[60vh]" />
      ) : notificationsList.length === 0 ? (
        <Card className="h-[60vh] flex items-center justify-center ">
          <CardContent className="flex flex-col items-center gap-2">
            <BellOff className="w-16 h-16 text-primary" />
            <h1 className="text-3xl font-bold ">
              {language === "en" ? "No Notifications" : "لا يوجد إشعارات"}
            </h1>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notificationsList.map((notification) => (
            <Card
              key={notification.id}
              className="overflow-hidden bg-secondary"
            >
              <CardContent className="p-6">
                <h2 className="mb-2 text-lg font-semibold">
                  {language === "en"
                    ? notification.data.title_en
                    : notification.data.title_ar}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                  {language === "en"
                    ? notification.data.message_en
                    : notification.data.message_ar}
                </p>
                <p className="text-xs text-gray-400">
                  {notification?.data?.user_name}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    handleDeleteNotification(String(notification.id))
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === "en" ? "Delete" : "حذف"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
