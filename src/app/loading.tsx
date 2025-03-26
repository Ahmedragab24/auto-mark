import LoaderSpan from "@/components/LoaderSpan";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center p-4 mx-auto mt-16">
      <LoaderSpan />
    </div>
  );
};

export default Loading;
