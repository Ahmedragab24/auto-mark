import React from "react";
import { Button } from "./ui/button";
import { ProductType, ShowroomByIdType } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SendHorizontal, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ChatArea from "./ChatArea";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

const SendMessageBtn = ({
  product,
  showroom,
}: {
  product?: ProductType;
  showroom?: ShowroomByIdType;
}) => {
  const [IsOpen, setIsOpen] = React.useState(false);
  const language = useAppSelector(
    (state: RootState) => state.Language.language
  );

  return (
    <AlertDialog open={IsOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full h-12 text-base" variant="outline">
          {language === "en" ? "Send Message" : "ارسل رسالة"}
          <SendHorizontal className="w-6 h-6" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full h-auto">
        <AlertDialogHeader>
          <Button
            variant="destructive"
            className="w-5 h-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          <VisuallyHidden>
            <AlertDialogTitle>رسالة</AlertDialogTitle>
          </VisuallyHidden>
        </AlertDialogHeader>
        <ChatArea
          userId={product?.user_id || showroom?.setting?.user_id}
          productId={product?.id || showroom?.id}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SendMessageBtn;
