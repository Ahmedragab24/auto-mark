"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ForgetPassword from "./ForgetPassword";
import RegisterForm from "./register-Form";
import LoginForm from "./login-Form";
import OTPVerification from "./OTP";
import PasswordOTPForm from "./ChangePasswordInOTP";
import TypeRegister from "./TypeRegister";
import ExRegistrationForm from "../exhibitions/ExhibitionsRegister";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

interface LoginModelProps {
  className?: string;
  children: React.ReactNode;
}

export type ModelType =
  | "Login"
  | "Register"
  | "TypeRegister"
  | "ForgetPassword"
  | "OTP"
  | "ChangePassword"
  | "ExhibitionsRegister";

const LoginModel: React.FC<LoginModelProps> = ({ className, children }) => {
  const { language } = useAppSelector((state: RootState) => state.Language);
  const [typeModel, setTypeModel] = React.useState<ModelType>("Login");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [language]);

  const dialogTitles: Record<ModelType, { ar: string; en: string }> = {
    Login: { ar: "اهلا بعودتك", en: "Welcome Back" },
    Register: { ar: "إنشاء حساب جديد", en: "Create a New Account" },
    TypeRegister: { ar: "مرحبا بك في اوتو مارك", en: "Welcome to AutoMark" },
    ForgetPassword: { ar: "استعادة كلمة المرور", en: "Recover Password" },
    OTP: { ar: "أدخل كود التحقق", en: "Enter Verification Code" },
    ChangePassword: { ar: "تعيين كلمة المرور", en: "Set New Password" },
    ExhibitionsRegister: { ar: "أنشاء حساب جديد", en: "Create a New Account" },
  };

  const dialogDescriptions: Record<ModelType, { ar: string; en: string }> = {
    Login: {
      ar: "ادخل بيانات حسابك حتى تتمكن من الدخول",
      en: "Enter your account details to log in",
    },
    Register: {
      ar: "من الرائع الانضمام إلينا لتحظى الى تجربة مميزة",
      en: "It's great to join us for an amazing experience",
    },
    TypeRegister: {
      ar: "اختر نوع حسابك وابدأ رحلتك واستمتع بتجربة مميزة",
      en: "Choose your account type and start your journey",
    },
    ForgetPassword: {
      ar: "أدخل رقم هاتفك لاستعادة كلمة المرور",
      en: "Enter your phone number to recover your password",
    },
    OTP: { ar: "", en: "" },
    ChangePassword: {
      ar: "الرجاء كتابة شيء تتذكره في المستقبل",
      en: "Please write something you will remember",
    },
    ExhibitionsRegister: {
      ar: "من الرائع الانضمام إلينا نتمنى لك تجربة مميزة",
      en: "It's great to join us, we wish you a great experience",
    },
  };

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader className="flex flex-col gap-2 !text-center">
          <DialogTitle>
            {dialogTitles[typeModel][language]}
            <span role="img" aria-label="welcome" className="mx-2 text-2xl">
              {typeModel === "Login" && "😍"}
              {typeModel === "Register" ||
                (typeModel === "TypeRegister" && "👋") ||
                (typeModel === "ExhibitionsRegister" && "👋")}
              {typeModel === "OTP" && "🔒"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {dialogDescriptions[typeModel][language]}
          </DialogDescription>
        </DialogHeader>
        {typeModel === "Login" && (
          <LoginForm setTypeModel={setTypeModel} setIsOpen={setIsOpen} />
        )}
        {typeModel === "TypeRegister" && (
          <TypeRegister setTypeModel={setTypeModel} />
        )}
        {typeModel === "Register" && (
          <RegisterForm setTypeModel={setTypeModel} />
        )}
        {typeModel === "ForgetPassword" && (
          <ForgetPassword setTypeModel={setTypeModel} />
        )}
        {typeModel === "OTP" && <OTPVerification setTypeModel={setTypeModel} />}
        {typeModel === "ChangePassword" && (
          <PasswordOTPForm setTypeModel={setTypeModel} />
        )}
        {typeModel === "ExhibitionsRegister" && (
          <ExRegistrationForm setTypeModel={setTypeModel} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModel;
