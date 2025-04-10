import { useEffect, useState } from "react"
import { useMediaQuery } from "./useMediaQuery"
import theme from "tailwindcss/defaultTheme"

const useIsMobile = () => {
  const matches = useMediaQuery(`(max-width:${theme.screens.md})`)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(matches)
  }, [matches])
  return isMobile
}

export default useIsMobile