"use client";

import type React from "react";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
  useStoreFavoriteMutation,
} from "@/store/apis/favorite";
import type { ProductType, AllShowroomsType, ErrorType } from "@/types";
import LoginModel from "./LoginModel";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { Trash2 } from "lucide-react";

interface IProps {
  product: ProductType | AllShowroomsType;
  className?: string;
  type: "Cart" | "Page";
}

const FavoriteButton: React.FC<IProps> = ({ product, className, type }) => {
  const [storeFavorite] = useStoreFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const { data: favoritesData, refetch } = useGetFavoritesQuery("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { UserData, Language } = useAppSelector((state: RootState) => state);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setToken(UserData.token || null);
  }, [UserData.token]);

  useEffect(() => {
    if (favoritesData?.data?.products) {
      setIsFavorite(
        favoritesData.data.products.some(
          (item: ProductType) => item.id === product.id
        )
      );
    }
  }, [favoritesData, product.id]);

  const handleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();
      e.stopPropagation();

      if (!product.id) return;

      if (isFavorite) {
        setIsDialogOpen(true);
      } else {
        try {
          await storeFavorite(product.id).unwrap();
          setIsFavorite(true);
          refetch();
          toast({
            variant: "default",
            description: (
              <div className="flex flex-col items-center justify-center gap-2">
                <Image
                  src="/Icons/done.png"
                  alt="done"
                  width={20}
                  height={20}
                  className="w-10 h-10"
                />
                <h2>
                  {Language.language === "en"
                    ? "Successful operation"
                    : "عملية ناجحة"}
                </h2>
                <p>
                  {Language.language === "en"
                    ? "Product added to favorites"
                    : "تم اضافة المنتج للمفضلة"}
                </p>
              </div>
            ),
          });
        } catch (err: unknown) {
          const error = err as ErrorType;
          toast({
            variant: "destructive",
            description: error?.data?.message || "حدث خطأ",
          });
        }
      }
    },
    [isFavorite, product.id, storeFavorite, refetch, Language.language]
  );

  const confirmRemove = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        if (!product.id) return;
        await deleteFavorite(product.id).unwrap();
        setIsFavorite(false);
        setIsDialogOpen(false);
        refetch();
        toast({
          variant: "destructive",
          description:
            Language.language === "en"
              ? "Product removed from favorites"
              : "تم حذف المنتج من المفضلة",
        });
      } catch (err: unknown) {
        const error = err as ErrorType;
        toast({
          variant: "destructive",
          description: error?.data?.message || "حدث خطأ",
        });
      }
    },
    [product.id, deleteFavorite, refetch, Language.language]
  );

  const cancelRemove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(false);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {!token ? (
        <Button
          variant="secondary"
          size="icon"
          className={`rounded-full ${className}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <LoginModel>
            {type === "Cart" ? (
              <Image
                src="/Icons/heart.svg"
                alt="heart"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            ) : (
              <Image
                src="/Icons/heart-gray.svg"
                alt="heart"
                width={20}
                height={20}
                className="w-5 h-5 filter invert brightness-50"
              />
            )}
          </LoginModel>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="icon"
          className={`rounded-full ${className}`}
          onClick={handleFavorite}
        >
          {type === "Cart" ? (
            <Image
              src={isFavorite ? "/Icons/heart-fill.svg" : "/Icons/heart.svg"}
              alt={isFavorite ? "favorite" : "heart"}
              width={20}
              height={20}
              className="w-5 h-5"
              priority={true}
            />
          ) : (
            <Image
              src={
                isFavorite ? "/Icons/heart-fill.svg" : "/Icons/heart-gray.svg"
              }
              alt={isFavorite ? "favorite" : "heart"}
              width={20}
              height={20}
              className={`w-5 h-5 ${
                isFavorite
                  ? ""
                  : "filter brightness-75 dark:!invert dark:!brightness-75"
              }`}
              priority={true}
            />
          )}
        </Button>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent className="flex flex-col gap-4 items-center justify-center w-full md:w-fit">
          <AlertDialogTitle className="flex gap-2">
            {Language.language === "en" ? "Delete" : "حذف"}
            <Trash2 className="w-6 h-6 text-primary" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            {Language.language === "en"
              ? "Are you sure you want to delete this product from favorites?"
              : "هل انت متأكد من حذف هذا المنتج من المفضلة؟"}
          </AlertDialogDescription>
          <AlertDialogAction onClick={confirmRemove} className="w-full">
            {Language.language === "en" ? "Delete" : "حذف"}
          </AlertDialogAction>
          <AlertDialogCancel onClick={cancelRemove} className="w-full">
            {Language.language === "en" ? "Cancel" : "إلغاء"}
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FavoriteButton;
