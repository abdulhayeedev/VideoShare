import axios from "axios";

// ✅ Centralized axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// ------------------- AUTH -------------------
export async function registerUser({ username, email, password, is_creator }) {
  try {
    const response = await api.post("/register/", {
      username,
      email,
      password,
      is_creator,
    });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    const errorMsg =
      errorData?.detail ||
      (errorData && Object.values(errorData).flat().join(" ")) ||
      "Registration failed";
    throw new Error(errorMsg);
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await api.post("/login/", { username, password });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    throw new Error(errorData?.detail || "Login failed");
  }
}

// ------------------- PROFILE -------------------
function isTokenExpiredError(error) {
  if (!error) return false;
  if (typeof error === "string" && error.includes("token")) return true;
  if (error.detail && error.code === "token_not_valid") return true;
  return false;
}

export async function fetchProfile(token, refresh) {
  try {
    const response = await api.get("/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    if (isTokenExpiredError(errorData) && refresh) {
      const refreshData = await refreshToken(refresh);
      const newToken = refreshData.access;
      localStorage.setItem("token", newToken);
      const retryResponse = await api.get("/profile/", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      return retryResponse.data;
    }
    throw new Error(errorData?.detail || "Failed to fetch profile");
  }
}

// ------------------- TOKENS -------------------
export async function refreshToken(refresh) {
  try {
    const response = await api.post("/token/refresh/", { refresh });
    return response.data;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
}

// ------------------- UPDATE PROFILE -------------------
export async function updateProfile(token, data, refresh) {
  try {
    const response = await api.patch("/profile/", data, {
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
      localStorage.setItem("token", newToken);
      const retryResponse = await api.patch("/profile/", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
      });
      return retryResponse.data;
    }
    throw new Error(
      errorData?.detail ||
        (errorData && Object.values(errorData).flat().join(" ")) ||
        "Failed to update profile"
    );
  }
}

export default api;
