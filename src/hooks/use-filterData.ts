import {
  useGetBrandsQuery,
  useGetModelsQuery,
  useGetSuSectionsQuery,
  useGetColorsQuery,
  useGetAutoPartsTypesQuery,
  useGetAutoPartsTypesCategoriesQuery,
} from "@/store/apis/attrbuite";
import { useGetFiltersQuery } from "@/store/apis/filtering";
import { useAppSelector } from "@/store/hooks";

export function useFilterData() {
  const { Categories, Brand, Language, AutoParts } = useAppSelector(
    (state) => ({
      Categories: state.Categories.Categories,
      Brand: state.Brand,
      Language: state.Language.language,
      AutoParts: state.AutoParts,
    })
  );

  const { data: filtersData } = useGetFiltersQuery({ id: Categories.id });
  const { data: brandsData } = useGetBrandsQuery({ id: Categories.id });
  const { data: modelData } = useGetModelsQuery({ brand_id: Brand.id || 0 });
  const { data: SuSectionsData } = useGetSuSectionsQuery({
    categoryID: Categories.id,
    lang: Language,
  });
  const { data: AutoPartsData } = useGetAutoPartsTypesQuery("");
  const { data: AutoPartsCategoriesData } = useGetAutoPartsTypesCategoriesQuery(
    AutoParts.id
  );
  const { data: Exterior_color } = useGetColorsQuery({ ColorDir: "external" });
  const { data: Interior_color } = useGetColorsQuery({ ColorDir: "internal" });

  return {
    filters: filtersData?.data || [],
    brands: brandsData?.data?.brands || [],
    models: modelData?.data || [],
    SuSections: SuSectionsData?.data?.subcategories || [],
    ExteriorColors: Exterior_color?.data?.colors || [],
    InteriorColors: Interior_color?.data?.colors || [],
    AutoParts: AutoPartsData?.data?.autoPartsType || [],
    AutoPartsCategory: AutoPartsCategoriesData?.data?.autoPartsCategory || [],
  };
}
