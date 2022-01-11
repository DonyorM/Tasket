import { useEffect, useState } from "react";

const useMediaMatch = (mediaQuery: string) => {
  const [doesMatch, setDoesMatch] = useState(false);

  useEffect(() => {
    const mediaMatch = window.matchMedia(mediaQuery);

    setDoesMatch(mediaMatch.matches);
    const updateMatch = (e: any) => {
      setDoesMatch(e.matches);
    };
    mediaMatch.addEventListener("change", updateMatch);
    return () => {
      mediaMatch.removeEventListener("change", updateMatch);
    };
  });

  return doesMatch;
};

export const useSmMediaMatch = () => {
  return useMediaMatch("(min-width: 640px)");
};

export default useMediaMatch;
