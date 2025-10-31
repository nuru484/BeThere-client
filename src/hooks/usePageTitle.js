// src/hooks/usePageTitle.js
import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `BeThere - ${title}` : "BeThere";
  }, [title]);
}
