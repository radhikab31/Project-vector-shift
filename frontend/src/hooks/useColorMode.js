import {useState, useEffect, useCallback} from "react";
export const useColorMode = () => {
  const [colorMode, setColorMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("colorMode") || "light";
    setColorMode(savedMode);

    if (savedMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";

      localStorage.setItem("colorMode", newMode);

      if (newMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newMode;
    });
  }, []);

  if (!mounted) {
    return {colorMode: "light", toggleColorMode};
  }

  return {colorMode, toggleColorMode};
};