import { useMediaQuery } from "./useMediaQuery"

export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 639px)")
  const isTablet = useMediaQuery("(min-width: 640px) and (max-width: 1023px)")
  return isMobile ? "mobile" : isTablet ? "tablet" : "desktop"
}
