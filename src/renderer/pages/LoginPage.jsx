import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Store as StoreIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import { ResponsiveTextField } from "../components/Responsive/ResponsiveComponents";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "admin@grocerymanager.com",
    password: "admin123",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the reducer
      console.error("Login failed:", error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      {" "}
      <Box
        sx={{
          marginTop: { xs: 4, sm: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
          justifyContent: "center",
          px: { xs: 5, sm: 20, md: 20, lg: 60, xl: 80 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {" "}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: { xs: "100%", sm: "400px", md: "450px" },
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, sm: 3 },
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <StoreIcon
              sx={{
                fontSize: { xs: 35, sm: 40 },
                color: "primary.main",
                mr: { xs: 0, sm: 1 },
                mb: { xs: 1, sm: 0 },
              }}
            />
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.125rem" },
              }}
            >
              Grocery Manager
            </Typography>
          </Box>{" "}
          <Typography
            component="h2"
            variant="h6"
            sx={{
              mb: { xs: 2, sm: 3 },
              color: "text.secondary",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              textAlign: "center",
            }}
          >
            Sign in to your account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}{" "}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <ResponsiveTextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <ResponsiveTextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />{" "}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: { xs: 2, sm: 3 },
                mb: 2,
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>{" "}
          <Box
            sx={{
              mt: 2,
              p: { xs: 1.5, sm: 2 },
              bgcolor: "grey.50",
              borderRadius: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                mb: 1,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontWeight: "bold",
              }}
            >
              Default Login Credentials:
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Email: admin@grocerymanager.com
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Password: admin123
            </Typography>
          </Box>{" "}
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              mt: 2,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Welcome to the Grocery Delivery Management System
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
