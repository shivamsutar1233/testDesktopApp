import { TextField } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";

const ResponsiveTextField = ({
  label,
  placeholder,
  fullWidth = true,
  size = "small",
  variant = "outlined",
  multiline = false,
  rows = 1,
  type = "text",
  ...props
}) => {
  const { isMobile, isTablet } = useResponsive();

  // Check if label is long to apply special styling
  const isLongLabel = label && label.length > 15;

  // Check if this is a search field
  const isSearchField =
    placeholder && placeholder.toLowerCase().includes("search");

  return (
    <TextField
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      label={label}
      placeholder={placeholder}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      type={type}
      data-label-long={isLongLabel}
      sx={{
        marginTop: isMobile ? 1.5 : 1,
        marginBottom: isMobile ? 1.5 : 1,
        "& .MuiInputLabel-root": {
          whiteSpace: "nowrap",
          overflow: "visible",
          textOverflow: "unset",
          maxWidth: isSearchField
            ? isMobile
              ? "calc(100% - 56px)"
              : "calc(100% - 48px)"
            : isMobile
            ? "calc(100% - 32px)"
            : "calc(100% - 24px)",
          fontSize: isMobile ? "16px" : "14px", // Prevent zoom on iOS
          ...(isLongLabel && {
            fontSize: isMobile ? "14px" : "13px",
            maxWidth: isSearchField
              ? isMobile
                ? "calc(85% - 56px)"
                : "calc(85% - 48px)"
              : isMobile
              ? "calc(85% - 32px)"
              : "calc(85% - 24px)",
          }),
        },
        "& .MuiInputLabel-shrink": {
          maxWidth: isLongLabel
            ? isSearchField
              ? isMobile
                ? "calc(150% - 56px)"
                : "calc(150% - 48px)"
              : isMobile
              ? "calc(150% - 32px)"
              : "calc(150% - 24px)"
            : isSearchField
            ? isMobile
              ? "calc(175% - 56px)"
              : "calc(175% - 48px)"
            : isMobile
            ? "calc(175% - 32px)"
            : "calc(175% - 24px)",
          fontSize: isLongLabel
            ? isMobile
              ? "12px"
              : "11px"
            : isMobile
            ? "14px"
            : "12px",
          transform: `translate(14px, -9px) scale(0.85)`,
          padding: "0 4px",
          backgroundColor: "background.paper",
        },
        "& .MuiOutlinedInput-root": {
          minHeight: size === "small" ? "40px" : "56px",
          ...(multiline && {
            alignItems: "flex-start",
            paddingTop: "14px",
            minHeight: "auto",
          }),
          ...(isSearchField && {
            minHeight: size === "small" ? "40px" : "56px",
            height: "auto",
          }),
        },
        "& .MuiInputBase-input": {
          fontSize: isMobile ? "16px" : "14px", // Prevent zoom on iOS
          minHeight: "unset",
          height: size === "small" ? "1.25rem" : "1.5rem",
          lineHeight: size === "small" ? "1.25rem" : "1.5rem",
          ...(isSearchField && {
            height: size === "small" ? "1.25rem" : "1.5rem",
            lineHeight: size === "small" ? "1.25rem" : "1.5rem",
          }),
          ...(type === "number" && {
            appearance: "textfield",
            MozAppearance: "textfield", // Firefox
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          }),
        },
        "& .MuiInputAdornment-root": {
          marginLeft: "8px",
          "&.MuiInputAdornment-positionEnd": {
            marginRight: "8px",
          },
        },
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default ResponsiveTextField;
