"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Check, Plus } from "lucide-react";
import { useStoreFollowersMutation } from "@/store/apis/followers";
import type { ErrorType, ShowroomFlowersType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";

interface IProps {
  ShowroomID: number;
  DataFollowersList: ShowroomFlowersType;
}

const FollowingShowroomBtn = ({ ShowroomID, DataFollowersList }: IProps) => {
  const [followShowroom] = useStoreFollowersMutation();
  const { user } = useAppSelector((state: RootState) => state.UserData);
  const [isFollow, setIsFollow] = React.useState<boolean>(false);

  useEffect(() => {
    if (user) {
      const followers = DataFollowersList?.followers?.data;
      if (followers) {
        const isFollowing = followers.some(
          (follower) => follower.id === user.id
        );
        setIsFollow(isFollowing);
      }
    }
  }, [DataFollowersList, user]);

  const handleFollowToggle = async () => {
    try {
      if (isFollow) {
        // Unfollow logic
        await followShowroom(ShowroomID);
        setIsFollow(false);
        toast({
          title: "تمت العملية بنجاح",
          description: "تم إلغاء متابعة المعرض بنجاح",
        });
      } else {
        // Follow logic
        await followShowroom(ShowroomID);
        setIsFollow(true);
        toast({
          title: "تمت العملية بنجاح",
          description: "تمت متابعة المعرض بنجاح",
        });
      }
    } catch (error) {
      const errorObj = error as ErrorType;
      toast({
        title: "خطأ",
        description:
          errorObj.data?.message || "حدث خطأ أثناء تحديث حالة المتابعة",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      size={"lg"}
      className={`w-full ${isFollow ? "bg-chart-2" : "bg-primary"}`}
      onClick={handleFollowToggle}
    >
      {isFollow ? "تم المتابعة" : "متابعة"}
      {isFollow ? (
        <Check size={20} className="ml-2" />
      ) : (
        <Plus size={20} className="ml-2" />
      )}
    </Button>
  );
};

export default FollowingShowroomBtn;
