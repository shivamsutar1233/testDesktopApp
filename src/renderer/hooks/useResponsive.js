import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isExtraLarge = useMediaQuery(theme.breakpoints.up("xl"));

  // Device type detection
  const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  // Sidebar behavior based on screen size
  const shouldCollapseSidebar = isMobile || isTablet;

  // Grid system helpers
  const getGridCols = (mobile = 12, tablet = 6, desktop = 4, large = 3) => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    if (isLargeDesktop) return large;
    return desktop;
  };

  // Container max width
  const getContainerMaxWidth = () => {
    if (isExtraLarge) return "1400px";
    if (isLargeDesktop) return "1200px";
    if (isDesktop) return "960px";
    if (isTablet) return "720px";
    return "100%";
  };
  // Responsive spacing - optimized for no horizontal scrolling
  const getSpacing = (mobile = 1, tablet = 2, desktop = 3) => {
    if (isMobile) return Math.max(mobile * 0.8, 0.5); // Reduce mobile spacing by 20%
    if (isTablet) return tablet;
    return desktop;
  };

  // Responsive font sizes
  const getFontSize = (base = 14) => {
    if (isMobile) return base - 2;
    if (isTablet) return base;
    return base + 2;
  };

  // Drawer width based on screen size
  const getDrawerWidth = () => {
    if (isMobile) return 280;
    if (isTablet) return 240;
    return 280;
  };

  return {
    // Screen size booleans
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isExtraLarge,

    // Device type
    deviceType,

    // Layout helpers
    shouldCollapseSidebar,
    getGridCols,
    getContainerMaxWidth,
    getSpacing,
    getFontSize,
    getDrawerWidth,

    // Breakpoint values
    breakpoints: theme.breakpoints.values,
  };
};

export default useResponsive;
