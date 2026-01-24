// hooks/useColorMode.js
// Custom hook for managing dark/light mode with localStorage persistence

import {useState, useEffect, useCallback} from "react";

/**
 * useColorMode Hook
 *
 * Manages dark/light mode state with localStorage persistence
 *
 * Returns:
 *   - colorMode: 'light' | 'dark'
 *   - toggleColorMode: () => void
 *
 * Usage:
 *   const { colorMode, toggleColorMode } = useColorMode();
 */
export const useColorMode = () => {
  const [colorMode, setColorMode] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("colorMode") || "light";
    setColorMode(savedMode);

    // Apply to HTML element for Tailwind dark: prefix
    if (savedMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  // Toggle dark/light mode
  const toggleColorMode = useCallback(() => {
    setColorMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";

      // Save to localStorage
      localStorage.setItem("colorMode", newMode);

      // Apply to HTML element for Tailwind dark: prefix
      if (newMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newMode;
    });
  }, []);

  // Return null during hydration to avoid mismatch
  if (!mounted) {
    return {colorMode: "light", toggleColorMode};
  }

  return {colorMode, toggleColorMode};
};

/**
 * ColorModeProvider Component (Optional - for future use with Context)
 * Currently not needed, but can be added for more advanced use cases
 */
