import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/userServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import uploadIcon from "../assets/icons/upload-icon.svg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", is_creator: false });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { type, value, name, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, is_creator: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToken("");
    setUser(null);
    try {
      const res = await registerUser(form);
      toast.success("Registration successful! Redirecting to login...");
      setToken(res.token);
      setUser(res.user);
      setForm({ username: "", email: "", password: "", is_creator: false });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-[#121212] to-black animate-gradient-move">
      {/* Animated SVG background */}
      <FloatingSVGs />
      <div className="flex flex-1 items-center justify-center z-10 custom-scrollbar-dark">
        <div className="bg-gradient-to-br from-[#181A20] via-[#23272F] to-[#181A20] bg-opacity-90 p-10 rounded-2xl shadow-2xl w-full max-w-md border-2 border-[#25F4EE] animate-fade-in backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#25F4EE] opacity-10 rounded-full blur-2xl animate-float-slow"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FE2C55] opacity-10 rounded-full blur-2xl animate-float-medium"></div>
          </div>
          <div className="flex flex-col items-center mb-6 z-10 relative">
            <div className="bg-black/60 rounded-full p-4 shadow-xl mb-2 border-2 border-[#FE2C55]">
              <img src={uploadIcon} alt="Logo" className="w-14 h-14 filter brightness-0 invert" />
            </div>
            <span className="text-transparent bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#FFFFFF] bg-clip-text font-black text-2xl tracking-widest drop-shadow-lg animate-gradient-text-dark mb-2">VShare</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 text-center tracking-tight animate-gradient-text-dark">Create Account</h2>
          <p className="text-center text-gray-400 mb-6">Sign up to get started!</p>
          <form onSubmit={handleSubmit} className="space-y-5 z-10 relative">
            <input
              className="w-full p-3 bg-[#23272F] bg-opacity-80 border border-[#25F4EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25F4EE] text-white placeholder-gray-400 transition"
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 bg-[#23272F] bg-opacity-80 border border-[#25F4EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25F4EE] text-white placeholder-gray-400 transition"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                className="w-full p-3 bg-[#23272F] bg-opacity-80 border border-[#25F4EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25F4EE] text-white placeholder-gray-400 transition pr-12"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#25F4EE] hover:text-[#FE2C55] focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-6 h-6" />
                ) : (
                  <EyeIcon className="w-6 h-6" />
                )}
              </button>
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_creator"
                checked={form.is_creator}
                onChange={handleChange}
                className="accent-[#25F4EE] h-4 w-4"
              />
              <span className="text-gray-300">Register as Creator</span>
            </label>
            <button
              className="w-full py-3 bg-[#181A20] border-2 border-[#25F4EE] text-white rounded-full font-extrabold hover:bg-[#23272F] hover:border-[#FE2C55] transition-all shadow-lg text-lg animate-fade-in drop-shadow-glow focus:ring-2 focus:ring-[#25F4EE] focus:outline-none"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  Registering...
                </span>
              ) : "Register"}
            </button>
          </form>
          <div className="mt-6 text-center z-10 relative">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-[#25F4EE] font-semibold hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating SVGs for animated background
function FloatingSVGs() {
  return (
    <>
      <svg className="absolute top-10 left-10 animate-float-slow opacity-30 z-0" width="120" height="120" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="60" fill="#FE2C55" filter="url(#glowPink)" /></svg>
      <svg className="absolute bottom-20 right-20 animate-float-medium opacity-20 z-0" width="80" height="80" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="20" fill="#25F4EE" filter="url(#glowBlue)" /></svg>
      <svg className="absolute top-1/2 left-1/3 animate-float-fast opacity-20 z-0" width="100" height="100" viewBox="0 0 100 100" fill="none"><polygon points="50,0 100,100 0,100" fill="#00F0FF" filter="url(#glowAqua)" /></svg>
      <svg width="0" height="0">
        <filter id="glowPink">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowBlue">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowAqua">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>
    </>
  );
} 