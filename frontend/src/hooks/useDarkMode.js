// hooks/useDarkMode.js
// Custom hook to track dark mode changes and trigger component re-renders

import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);

    // Create observer to watch for dark class changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setIsDark(isDarkNow);
    });

    // Observe HTML element for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return isDark;
};