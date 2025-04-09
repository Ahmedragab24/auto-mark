"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { useLogoutMutation } from "@/store/apis/Auth/Auth";
import { clearUserData } from "@/store/features/userData";
import { toast } from "@/hooks/use-toast";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logout } from "@/hooks/use-firebase";

const UserAvatar = () => {
  const { UserData, Language } = useAppSelector((state: RootState) => state);
  const Lang = Language.language;
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutMutation();
  const [isClient, setIsClient] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      if (UserData.user && UserData.user?.login_type === "google") {
        await logout();
      } else {
        await logoutUser(UserData.token).unwrap();
      }
      dispatch(clearUserData());
      setTimeout(() => {
        window.location.pathname = "/";
      }, 2000);
      toast({
        title: Lang === "ar" ? "تم تسجيل الخروج بنجاح" : "Log out successfully",
      });
      setShowLogoutDialog(false);
    } catch (error: unknown) {
      console.log(error);
      toast({
        title: Lang === "ar" ? "خطأ" : "Error",
        description: Lang === "ar" ? "حدث خطاء حاول مرة اخرى" : "Try again",
        variant: "destructive",
      });
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  if (!isClient) return null;

  return (
    <>
      <DropdownMenu dir={Lang === "ar" ? "rtl" : "ltr"}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="rounded-full !p-0 cursor-pointer duration-500 group transition-all"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/Logo/user.png"
                alt="User Avatar"
                className="bg-background"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="flex text-sm text-white dark:group-hover:text-white font-medium gap-2 group-hover:text-black px-2">
              <h3>{Lang === "ar" ? "مرحبا" : "Hello"}</h3>
              <h3>{UserData.user.name}</h3>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 py-4">
          {UserData?.token && UserData?.user?.type === "showroom" && (
            <Link href={"/showroomPage"}>
              <DropdownMenuItem>
                {Lang === "ar" ? "صفحة المعرض" : "Showroom Page"}
              </DropdownMenuItem>
            </Link>
          )}

          <Link href={"/user"}>
            <DropdownMenuItem>
              {Lang === "ar" ? "الملف الشخصي" : "Profile"}
            </DropdownMenuItem>
          </Link>

          <Link href={"/favorites"}>
            <DropdownMenuItem>
              {Lang === "ar" ? "المفضلة" : "Favorites"}
            </DropdownMenuItem>
          </Link>

          <Link href={"/SupportCenter"}>
            <DropdownMenuItem>
              {Lang === "ar" ? "مركز الدعم" : "Support Center"}
            </DropdownMenuItem>
          </Link>

          <Link href={"/download-app"}>
            <DropdownMenuItem>
              {Lang === "ar" ? "تحميل التطبيق" : "Download App"}
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem onClick={handleLogoutClick}>
            {Lang === "ar" ? "تسجيل الخروج" : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center gap-2">
            <DialogTitle>
              {Lang === "ar" ? "تأكيد تسجيل الخروج" : "Confirm Logout"}
            </DialogTitle>
            <DialogDescription dir={Lang === "ar" ? "rtl" : "ltr"}>
              {Lang === "ar"
                ? "هل أنت متأكد أنك تريد تسجيل الخروج؟"
                : "Are you sure you want to logout?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center justify-center gap-2">
            <Button variant="outline" onClick={handleLogoutCancel}>
              {Lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={handleLogoutConfirm}>
              {Lang === "ar" ? "تسجيل الخروج" : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatar;
