"use client";

import React from "react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";

const ScrollUp = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollUpElement = document.getElementById("scroll-up");
      if (window.scrollY >= 500) {
        if (scrollUpElement) {
          scrollUpElement.classList.add("show-scroll");
        }
      } else {
        if (scrollUpElement) {
          scrollUpElement.classList.remove("show-scroll");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      variant={"secondary"}
      size={"icon"}
      className="scrollup z-10 hover:bg-primary"
      id="scroll-up"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ChevronUp size={18} />
    </Button>
  );
};

export default ScrollUp;
