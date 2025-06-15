import { Box, Container, useTheme } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import ResponsiveTextField from "./ResponsiveTextField";
import ResponsiveSelect from "./ResponsiveSelect";
import ResponsiveDialog from "./ResponsiveDialog";

const ResponsiveContainer = ({
  children,
  maxWidth = "lg",
  padding = true,
  fullHeight = false,
  centerContent = false,
  ...props
}) => {
  const theme = useTheme();
  const { isMobile, getSpacing, getContainerMaxWidth } = useResponsive();
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        px: padding ? { xs: 2, sm: 3 } : 0,
        py: padding ? { xs: 2, sm: 3 } : 0,
        minHeight: fullHeight ? "100vh" : "auto",
        display: centerContent ? "flex" : "block",
        alignItems: centerContent ? "center" : "stretch",
        justifyContent: centerContent ? "center" : "flex-start",
        maxWidth: getContainerMaxWidth(),
        width: "100%",
        overflowX: "hidden",
        transition: "all 0.3s ease-in-out",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

const ResponsiveGrid = ({
  children,
  spacing = "responsive",
  alignItems = "stretch",
  justifyContent = "flex-start",
  ...props
}) => {
  const { getSpacing } = useResponsive();

  const getGridSpacing = () => {
    if (spacing === "responsive") {
      return { xs: getSpacing(1, 2, 3), sm: getSpacing(2, 3, 4) };
    }
    return spacing;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: getGridSpacing(),
        alignItems,
        justifyContent,
        width: "100%",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const ResponsiveFlex = ({
  children,
  direction = "row",
  wrap = "wrap",
  gap = "responsive",
  alignItems = "stretch",
  justifyContent = "flex-start",
  ...props
}) => {
  const { getSpacing } = useResponsive();

  const getFlexGap = () => {
    if (gap === "responsive") {
      return { xs: getSpacing(1, 2, 3), sm: getSpacing(2, 3, 4) };
    }
    return gap;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: direction === "row" ? "column" : direction,
          sm: direction,
        },
        flexWrap: wrap,
        gap: getFlexGap(),
        alignItems,
        justifyContent,
        width: "100%",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

const ResponsiveCard = ({
  children,
  elevation = 1,
  padding = true,
  hover = true,
  ...props
}) => {
  const { getSpacing } = useResponsive();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[elevation],
        padding: padding
          ? { xs: getSpacing(2, 3, 4), sm: getSpacing(3, 4, 5) }
          : 0,
        transition: "all 0.3s ease-in-out",
        ...(hover && {
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: theme.shadows[elevation + 2],
          },
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveFlex,
  ResponsiveCard,
  ResponsiveTextField,
  ResponsiveSelect,
  ResponsiveDialog,
};
