import { useGetInformationQuery } from "@/store/apis/autoMarkInfo";
import { AutoMarkInfo } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  const { data } = useGetInformationQuery("");
  const Logo: AutoMarkInfo = data?.setting?.logo;
  return (
    <Link href="/" className="shrink-0">
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_URL}${Logo}` || "/Logo/Logo.png"}
        alt="Auto Mark"
        width={120}
        height={40}
        loading="lazy"
        className="w-[50px] md:w-[60px] h-auto"
      />
    </Link>
  );
};

export default Logo;
