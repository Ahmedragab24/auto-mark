import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { useUpgradeAccountMutation } from "@/store/apis/upgrade";
import { toast } from "@/hooks/use-toast";
import { ErrorType, UpgradeAccountType } from "@/types";
import { setTypeRegister } from "@/store/features/typeRegister";
import { setTypeUser } from "@/store/features/typeUser";
import { useLoginMutation } from "@/store/apis/Auth/Auth";
import { setUserData } from "@/store/features/userData";

interface IProps {
  open: boolean;
  changeOpen: (open: boolean) => void;
}

const DialgoVendorUpgrade = ({ open, changeOpen }: IProps) => {
  const {
    Language: { language },
    UserData: { user },
    Password: { password },
  } = useAppSelector((state: RootState) => state);
  const [UpGradeAccountUser] = useUpgradeAccountMutation();
  const [loginForm] = useLoginMutation();
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const SubmitUpgradeUserAccount = async () => {
    try {
      const data: UpgradeAccountType = {
        country_id: user?.country?.id || 1,
        city_id: user?.city?.id || 1,
        type: "vendor",
        package_id: 1,
      };
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      await UpGradeAccountUser({ formData, lang: language }).unwrap();
      const requestData = {
        phone: user?.phone,
        password: password,
        fcm: user?.fcm,
      };

      const loginData = await loginForm(requestData).unwrap();
      dispatch(setUserData(loginData));
      toast({
        title: language === "ar" ? "تم تحديث حسابك بنجاح" : "Account Updated",
        description:
          language === "ar"
            ? "تم تسجيلك كتاجر سيارات"
            : "You are registered as a car dealer.",
        variant: "default",
      });
      dispatch(setTypeRegister("vendor"));
      dispatch(setTypeUser("vendor"));

      changeOpen(false);
    } catch (error) {
      const errorMessage =
        (error as ErrorType)?.data?.message || "حدث خطاء غير متوقع";
      toast({
        title: "خطاء",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (!isClient) return null;

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-center">
            <div className="flex flex-col items-center gap-4">
              <CircleAlert className="w-20 h-20 text-primary" />
              <span className="font-semibold text-lg">
                {language === "ar" ? "ترقية حسابك" : "Account Upgrade"}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="!max-w-md text-center text-md">
            {language === "ar"
              ? "سوف تؤدي ترقية الحساب لحذف جميع البيانات والاعلانات الخاصة بك وايقاف الاعلانات الجارية"
              : "Upgrading your account will delete all your data and ads and stop running ads."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col !justify-center items-center gap-4">
          <Button type="submit" onClick={SubmitUpgradeUserAccount}>
            {language === "ar" ? "استمرار" : "Continue"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {language === "ar" ? "الغاء" : "Cancel"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialgoVendorUpgrade;
