import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile as fetchProfileService, updateProfile as updateProfileService } from "../services/userServices";
import { loginSuccess } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

export default function EditProfile() {
  const token = useSelector((state) => state.auth.token);
  const refresh = useSelector((state) => state.auth.refresh);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", is_creator: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchProfileService(token, refresh);
        setForm({ email: data.email, is_creator: data.is_creator });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (token) getProfile();
  }, [token, refresh]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await updateProfileService(token, form, refresh);
      toast.success("Profile updated!");
      const newToken = localStorage.getItem('token') || token;
      dispatch(loginSuccess({ token: newToken, refresh, user: { ...user, ...data } }));
      setTimeout(() => navigate('/profile', { replace: true }), 1200);
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#121212] to-black animate-gradient-move">
      <div className="glassmorph-card-dark p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-[#25F4EE] ring-2 ring-[#FE2C55]/60 relative transition-all duration-700 ease-out transform z-10">
        <button
          onClick={() => navigate('/profile')}
          className="absolute top-4 left-4 p-2 rounded-full bg-[#232323] hover:bg-[#121212] active:scale-90 transition-all duration-200 shadow text-[#25F4EE] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-3xl font-extrabold animate-gradient-text-dark mb-2 text-center tracking-tight drop-shadow">Edit Profile</h2>
        <div className="flex justify-center mb-2">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#232323] animate-gradient-move"></div>
        </div>
        <p className="text-center text-gray-400 mb-6">Update your account info</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-[#25F4EE] font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-[#25F4EE] bg-[#181818] text-[#FE2C55] font-mono focus:ring-2 focus:ring-[#FE2C55] focus:outline-none transition drop-shadow-neon"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_creator"
              checked={form.is_creator}
              onChange={handleChange}
              id="is_creator"
              className="accent-[#25F4EE] w-5 h-5"
            />
            <label htmlFor="is_creator" className="text-[#25F4EE] font-semibold">Account Type: Creator</label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25F4EE] drop-shadow-neon"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
} 