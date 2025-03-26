"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "../TopBar";
import { Navbar } from "../Navbar";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      // Update last scroll position
      setLastScrollY(currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // Cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [controlNavbar]);

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md"
      >
        <TopBar />
        <Navbar />
      </motion.header>
    </AnimatePresence>
  );
};

export default Header;
