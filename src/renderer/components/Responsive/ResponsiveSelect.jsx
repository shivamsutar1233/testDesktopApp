import { TextField, MenuItem } from "@mui/material";
import useResponsive from "../../hooks/useResponsive";

const ResponsiveSelect = ({
  options = [],
  value,
  onChange,
  label,
  placeholder,
  fullWidth = true,
  size = "small",
  variant = "outlined",
  minWidth = 120,
  ...props
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getSelectWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return "100%";
    return fullWidth ? "100%" : "auto";
  };

  const getMinWidth = () => {
    if (isMobile) return "100%";
    if (isTablet) return minWidth;
    return minWidth;
  };

  // Check if label is long to apply special styling
  const isLongLabel = label && label.length > 15;

  return (
    <TextField
      select
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-label-long={isLongLabel}
      sx={{
        width: getSelectWidth(),
        minWidth: getMinWidth(),
        marginTop: isMobile ? 1.5 : 1,
        marginBottom: isMobile ? 1.5 : 1,
        "& .MuiSelect-select": {
          minWidth: getMinWidth(),
          paddingTop: size === "small" ? "8.5px" : "14px",
          paddingBottom: size === "small" ? "8.5px" : "14px",
          minHeight: size === "small" ? "1.25rem" : "1.5rem",
          lineHeight: size === "small" ? "1.25rem" : "1.5rem",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiOutlinedInput-root": {
          minWidth: getMinWidth(),
          minHeight: size === "small" ? "40px" : "56px",
        },
        "& .MuiInputLabel-root": {
          whiteSpace: "nowrap",
          overflow: "visible",
          textOverflow: "unset",
          maxWidth: isMobile ? "calc(100% - 48px)" : "calc(100% - 32px)",
          fontSize: isMobile ? "16px" : "14px", // Prevent zoom on iOS
          ...(isLongLabel && {
            fontSize: isMobile ? "14px" : "13px",
            maxWidth: isMobile ? "calc(90% - 48px)" : "calc(90% - 32px)",
          }),
        },
        "& .MuiInputLabel-shrink": {
          maxWidth: isLongLabel
            ? isMobile
              ? "calc(150% - 48px)"
              : "calc(150% - 32px)"
            : isMobile
            ? "calc(175% - 48px)"
            : "calc(175% - 32px)",
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
        ...props.sx,
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ResponsiveSelect;
