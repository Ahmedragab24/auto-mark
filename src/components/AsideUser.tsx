"use client";

import { UserLink } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { useDeleteAccountMutation } from "@/store/apis/Auth/Auth";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { ErrorType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AsideUser = () => {
  const pathname = usePathname();
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );
  const Token = useAppSelector((state: RootState) => state.UserData?.token);
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpenDeleteDialog = () => {
    setOpen(true);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(Token).unwrap();

      toast({
        title:
          language === "ar"
            ? "تم حذف الحساب بنجاح"
            : "Account deleted successfully",
      });
      window.location.href = "/";
    } catch (error: unknown) {
      const errorData = error as ErrorType;
      const message =
        errorData?.data?.message ||
        (language === "ar"
          ? "حدث خطاء غير متوقع"
          : "An unexpected error occurred");
      toast({
        title: language === "ar" ? "خطاء" : "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <aside className="flex flex-col gap-4 px-4 py-8 bg-background rounded-xl h-fit">
      <div className="flex flex-col gap-4">
        {UserLink.map(
          ({ name_ar, name_en, href, image, alt, href2 }, index) => (
            <Link
              key={index}
              href={index === UserLink.length - 1 ? "#" : href}
              className={`flex items-center gap-2 text-gray-600 hover:text-primary ${
                pathname === href ? "text-primary" : ""
              } ${pathname === href2 ? "text-primary" : ""} ${
                index === UserLink.length - 1 && "text-red-700"
              }`}
              onClick={(e) => {
                if (index === UserLink.length - 1) {
                  e.preventDefault();
                  handleOpenDeleteDialog();
                }
              }}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={alt}
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>{language === "en" ? name_en : name_ar}</span>
            </Link>
          )
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-4 items-center !text-center">
            <DialogTitle>
              {language === "ar" ? "حذف الحساب" : "Delete Account"}
            </DialogTitle>
            <DialogDescription className="!max-w-sm !mb-2">
              {language === "ar"
                ? "هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه."
                : "Are you sure you want to delete your account? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 !justify-center">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading
                ? language === "ar"
                  ? "جاري الحذف..."
                  : "Deleting..."
                : language === "ar"
                ? "نعم، حذف الحساب"
                : "Yes, Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default AsideUser;
