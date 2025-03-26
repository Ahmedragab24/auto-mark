"use client";

import { useEffect, useState } from "react";
import AddAdvertisementFormStepOne from "./AddAdvertisementFormStepOne";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import AddAdCarStepTwo from "./AddAdCarFormStepTow";
import AddAdMotoStepTow from "./AddAdMotoFormStepTow";
import AddAdTrackStepTow from "./AddAdTrackFormStepTow";
import AddAdBoatStepTwo from "./AddAdBoatFormStepTow";
import AddAdServicesStepTow from "./AddAdServicesFormStepTow";
import AddAdSparePartsStepTow from "./AddAdSparePartsFormStepTow";
import AddAdCarNumberStepTow from "./AddAdCarNumberFormStepTow";

export function AddAdvertisement() {
  const [stepTow, setStepTow] = useState<boolean>(false);
  const typeAdvertisement = useAppSelector(
    (state: RootState) => state.TypeAdvertisement.typeAdvertisement
  );
  const [IsClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (stepTow) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stepTow]);

  if (!IsClient) return null;

  return (
    <>
      {!stepTow ? (
        <AddAdvertisementFormStepOne setStepTwo={setStepTow} />
      ) : (
        <>
          {(typeAdvertisement === "car" || typeAdvertisement === "scrap") && (
            <AddAdCarStepTwo />
          )}
          {typeAdvertisement === "motorcycle" && <AddAdMotoStepTow />}
          {typeAdvertisement === "truck" && <AddAdTrackStepTow />}
          {typeAdvertisement === "boat" && <AddAdBoatStepTwo />}
          {typeAdvertisement === "service" && <AddAdServicesStepTow />}
          {typeAdvertisement === "spare_parts" && <AddAdSparePartsStepTow />}
          {typeAdvertisement === "carNumber" && <AddAdCarNumberStepTow />}
        </>
      )}
    </>
  );
}
