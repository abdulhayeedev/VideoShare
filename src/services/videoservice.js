import axios from "axios";

const BASE_URL = "https://videoshare-f3f4fjc2fehbfzah.canadacentral-01.azurewebsites.net/api";

export async function fetchVideos() {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No access token found. Please log in.");
  try {
    const response = await axios.get(`${BASE_URL}/videos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch videos");
  }
}

export async function uploadVideo(formData, onUploadProgress) {
  const token = localStorage.getItem('access');
  if (!token) throw new Error("No access token found. Please log in.");
  try {
    const response = await axios.post(
      `${BASE_URL}/videos/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress,
      }
    );
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;
    throw new Error(
      errorData?.detail ||
      (errorData && Object.values(errorData).flat().join(' ')) ||
      'Failed to upload video'
    );
  }
}

export async function likeVideo(videoId) {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No access token found. Please log in.");
  try {
    const response = await axios.post(`${BASE_URL}/favorites/`, { video: videoId, is_favorite: true }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Unauthorized");
    }
    throw new Error(error.response?.data?.detail || "Failed to like video");
  }
}

export async function unfavoriteVideo(favoriteId) {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No access token found. Please log in.");
  try {
    const response = await axios.delete(`${BASE_URL}/favorites/${favoriteId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    // Some backends return 204 No Content
    return response.data || { message: "Video removed from favorites successfully." };
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Unauthorized");
    }
    throw new Error(error.response?.data?.detail || "Failed to remove favorite");
  }
}

export async function addComment({ video, text, is_shared = true }) {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No access token found. Please log in.");
  try {
    const response = await axios.post(`${BASE_URL}/comments/`, { video, text, is_shared }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error("Unauthorized");
    }
    throw new Error(error.response?.data?.detail || "Failed to post comment");
  }
}

export async function getVideoDetail(videoId) {
  const token = localStorage.getItem("access");
  if (!token) throw new Error("No access token found. Please log in.");
  try {
    const response = await axios.get(`${BASE_URL}/videos/${videoId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch video details");
  }
}
