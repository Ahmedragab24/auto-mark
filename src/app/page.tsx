import CategoriesSection from "@/components/sections/CategoriesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import ShortViewSection from "@/components/sections/ShortViewSection";
import SkeletonProduct from "@/components/SkeletonProduct";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="container px-4 mx-auto">
      <HeroSection />
      <CategoriesSection />
      <Suspense fallback={<SkeletonProduct count={4} />}>
        <ShortViewSection Content="Special" />
        <ShortViewSection Content="new" />
        <ShortViewSection Content="mostView" />
        <ShortViewSection Content="carsNumbers" />
        <ShortViewSection Content="scrap" />
        <ShortViewSection Content="SpareParts" />
        <ShortViewSection Content="services" />
        <ShortViewSection Content="bikes" />
        <ShortViewSection Content="trucks" />
        <ShortViewSection Content="boots" />
      </Suspense>
    </main>
  );
}
