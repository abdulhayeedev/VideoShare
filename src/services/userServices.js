import axios from "axios";
// Service for interacting with the backend API for videos
const BASE_URL = "https://6mqqg03m-8000.inc1.devtunnels.ms/api";


export async function registerUser({ username, email, password, is_creator }) {
  try {
    const response = await axios.post(`${BASE_URL}/register/`, { username, email, password, is_creator });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    const errorMsg = errorData?.detail || (errorData && Object.values(errorData).flat().join(" ")) || "Registration failed";
    throw new Error(errorMsg);
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await axios.post(`${BASE_URL}/login/`, { username, password });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    throw new Error(errorData?.detail || "Login failed");
  }
}

// Helper to check if error is token expired
function isTokenExpiredError(error) {
  if (!error) return false;
  if (typeof error === 'string' && error.includes('token')) return true;
  if (error.detail && error.code === 'token_not_valid') return true;
  return false;
}

export async function fetchProfile(token, refresh) {
  try {
    const response = await axios.get(`${BASE_URL}/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    if (isTokenExpiredError(errorData) && refresh) {
      const refreshData = await refreshToken(refresh);
      const newToken = refreshData.access;
      localStorage.setItem('token', newToken);
      const retryResponse = await axios.get(`${BASE_URL}/profile/`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      return retryResponse.data;
    }
    throw new Error(errorData?.detail || 'Failed to fetch profile');
  }
}

export async function refreshToken(refresh) {
  try {
    const response = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
    return response.data;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
}

export async function updateProfile(token, data, refresh) {
  try {
    const response = await axios.patch(`${BASE_URL}/profile/`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    if (isTokenExpiredError(errorData) && refresh) {
      const refreshData = await refreshToken(refresh);
      const newToken = refreshData.access;
      localStorage.setItem('token', newToken);
      const retryResponse = await axios.patch(`${BASE_URL}/profile/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
      });
      return retryResponse.data;
    }
    throw new Error(errorData?.detail || (errorData && Object.values(errorData).flat().join(" ")) || "Failed to update profile");
  }
}
