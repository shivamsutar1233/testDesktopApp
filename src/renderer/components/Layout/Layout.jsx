import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Inventory as InventoryIcon,
  LocalShipping as DeliveryIcon,
  People as CustomersIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";
import {
  toggleTheme,
  toggleSidebar,
  updatePreference,
} from "../../store/slices/userPreferencesSlice";
import NavigationItem from "./NavigationItem";
import NotificationsPanel from "../Notifications/NotificationsPanel";
import useResponsive from "../../hooks/useResponsive";
import useTranslation from "../../hooks/useTranslation";

function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const userPreferences = useSelector((state) => state.userPreferences);

  // Responsive hooks
  const { isMobile, isTablet, shouldCollapseSidebar, getDrawerWidth } =
    useResponsive();
  const { t, getAvailableLanguages } = useTranslation();

  const drawerWidth = getDrawerWidth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);

  // Auto-collapse sidebar on mobile/tablet
  useEffect(() => {
    if (shouldCollapseSidebar && !userPreferences.layout.sidebarCollapsed) {
      dispatch(toggleSidebar());
    }
  }, [
    shouldCollapseSidebar,
    dispatch,
    userPreferences.layout.sidebarCollapsed,
  ]);

  const navigationItems = [
    {
      text: t("navigation.dashboard"),
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: t("navigation.orders"),
      icon: <OrdersIcon />,
      path: "/orders",
    },
    {
      text: t("navigation.inventory"),
      icon: <InventoryIcon />,
      path: "/inventory",
    },
    {
      text: t("navigation.deliveries"),
      icon: <DeliveryIcon />,
      path: "/deliveries",
    },
    {
      text: t("navigation.customers"),
      icon: <CustomersIcon />,
      path: "/customers",
    },
  ];
  const handleDrawerToggle = () => {
    if (isMobile || isTablet) {
      setMobileOpen(!mobileOpen);
    } else {
      dispatch(toggleSidebar());
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleLanguageChange = (language) => {
    dispatch(updatePreference({ key: "language", value: language }));
    handleLanguageMenuClose();
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleSettingsClick = () => {
    handleProfileMenuClose();
    navigate("/settings");
  };
  const drawer = (
    <div>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          noWrap
          component="div"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
          }}
        >
          {t("common.appName", "Grocery Manager")}
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.path}
            text={item.text}
            icon={item.icon}
            path={item.path}
            active={location.pathname.startsWith(item.path)}
            onClick={() => {
              navigate(item.path);
              if (mobileOpen) {
                setMobileOpen(false);
              }
            }}
          />
        ))}
      </List>
      <Divider />
      <List sx={{ px: 1 }}>
        <NavigationItem
          text={t("navigation.settings")}
          icon={<SettingsIcon />}
          path="/settings"
          active={location.pathname === "/settings"}
          onClick={() => {
            navigate("/settings");
            if (mobileOpen) {
              setMobileOpen(false);
            }
          }}
        />{" "}
      </List>

      {/* Quick Actions in Sidebar */}
      <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
        {/* Theme toggle moved to top bar */}
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          width: {
            xs: "100%",
            sm:
              userPreferences.layout.sidebarCollapsed || shouldCollapseSidebar
                ? "100%"
                : `calc(100% - ${drawerWidth}px)`,
          },
          ml: {
            xs: 0,
            sm:
              userPreferences.layout.sidebarCollapsed || shouldCollapseSidebar
                ? 0
                : `${drawerWidth}px`,
          },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: {
                xs: "block",
                sm: userPreferences.layout.sidebarCollapsed ? "block" : "none",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "block", sm: "none" } }}
          >
            {t("common.appName", "Grocery Manager")}
          </Typography>
          <Box sx={{ flexGrow: 1 }} /> {/* Language Selector */}
          <Tooltip title={t("settings.language")}>
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              sx={{ mr: 1 }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>
          {/* Theme Toggle */}
          <Tooltip
            title={
              userPreferences.theme === "dark"
                ? t("settings.light")
                : t("settings.dark")
            }
          >
            <IconButton
              color="inherit"
              onClick={handleThemeToggle}
              sx={{ mr: 1 }}
            >
              {userPreferences.theme === "dark" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </Tooltip>
          {/* Notifications */}
          <Tooltip title={t("common.notifications", "Notifications")}>
            <IconButton
              color="inherit"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          {/* Profile Menu */}
          <Tooltip title={t("common.profile", "Profile")}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account menu"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                {user?.name?.charAt(0) || <AccountIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {/* Language Menu */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={handleLanguageMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {getAvailableLanguages().map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={userPreferences.language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleSettingsClick}>
          <SettingsIcon sx={{ mr: 1 }} />
          {t("navigation.settings")}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          {t("navigation.logout")}
        </MenuItem>
      </Menu>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: {
            xs: 0,
            sm:
              userPreferences.layout.sidebarCollapsed || shouldCollapseSidebar
                ? 0
                : drawerWidth,
          },
          flexShrink: { sm: 0 },
          transition: "width 0.3s ease-in-out",
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="persistent"
          open={
            !userPreferences.layout.sidebarCollapsed && !shouldCollapseSidebar
          }
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              transition: "transform 0.3s ease-in-out",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {/* Main Content */}{" "}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: {
            xs: "100%",
            sm:
              userPreferences.layout.sidebarCollapsed || shouldCollapseSidebar
                ? "100%"
                : `calc(100% - ${drawerWidth}px)`,
          },
          maxWidth: "100%",
          mt: { xs: 7, sm: 8 },
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
          transition: "all 0.3s ease-in-out",
          overflow: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </Box>
  );
}

export default Layout;
