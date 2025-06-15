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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
            }}
          >
            <StoreIcon sx={{ fontSize: 40, color: "primary.main", mr: 1 }} />
            <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
              Grocery Manager
            </Typography>
          </Box>
          <Typography
            component="h2"
            variant="h6"
            sx={{ mb: 3, color: "text.secondary" }}
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 1 }}
            >
              <strong>Default Login Credentials:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Email: admin@grocerymanager.com
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Password: admin123
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 2 }}
          >
            Welcome to the Grocery Delivery Management System
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
