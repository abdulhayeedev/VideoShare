import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../services/videoservice";
import uploadIcon from "../assets/icons/upload-icon.svg";

// 1. Add FloatingSVGs component (copied from Home.jsx)
const FloatingSVGs = () => (
  <>
    <svg className="absolute top-10 left-10 animate-float-slow opacity-30 z-0" width="120" height="120" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="60" fill="#FE2C55" filter="url(#glowPink)" /></svg>
    <svg className="absolute bottom-20 right-20 animate-float-medium opacity-20 z-0" width="80" height="80" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="20" fill="#25F4EE" filter="url(#glowBlue)" /></svg>
    <svg className="absolute top-1/2 left-1/3 animate-float-fast opacity-20 z-0" width="100" height="100" viewBox="0 0 100 100" fill="none"><polygon points="50,0 100,100 0,100" fill="#00F0FF" filter="url(#glowAqua)" /></svg>
    {/* SVG filters for glow */}
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

export default function Upload() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Back button handler
  const handleBack = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProgress(0);
    if (!isAuthenticated || !user?.is_creator) {
      setError("Only creators can upload videos. Please log in as a creator.");
      return;
    }
    if (!file) {
      setError("Please select a video file.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    try {
      await uploadVideo(formData, (event) => {
        if (event.total) {
          setProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      setSuccess("Video uploaded successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.message || "Failed to upload video.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-[#121212] to-black animate-gradient-move">
      {/* Animated SVG background */}
      <FloatingSVGs />
      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-black/40 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-[#25F4EE] animate-fade-in" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="absolute -top-5 left-5 flex items-center gap-1 px-3 py-1.5 bg-black/60 border border-[#25F4EE] text-[#25F4EE] rounded-full font-semibold shadow hover:bg-[#232323] hover:scale-105 transition-all z-20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="flex flex-col items-center mb-6">
          <img src={uploadIcon} alt="Upload" className="w-16 h-16 mb-2 drop-shadow-lg filter brightness-0 invert" />
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#FFFFFF] bg-clip-text text-transparent mb-1 tracking-tight animate-gradient-text-dark">Upload Video</h2>
          <p className="text-gray-300 text-sm">Share your creativity with the world!</p>
        </div>
        {error && <div className="mb-4 text-red-400 font-semibold text-center animate-pulse">{error}</div>}
        {success && (
          <div className="mb-4 flex flex-col items-center text-green-400 font-semibold text-center animate-fade-in">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              className="w-full mb-0 p-3 pl-11 border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#25F4EE] focus:border-[#25F4EE] transition text-gray-100 font-medium bg-white/10 placeholder-gray-400"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25F4EE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0" /><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 014-4h0a4 4 0 014 4v2" /></svg>
            </span>
          </div>
          <div className="relative">
            <input
              className="w-full mb-0 p-3 pl-11 border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#25F4EE] focus:border-[#25F4EE] transition bg-white/10 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#25F4EE]/10 file:text-[#25F4EE] hover:file:bg-[#25F4EE]/20 text-gray-100 placeholder-gray-400"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25F4EE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-4 4m4-4l4 4" /></svg>
            </span>
          </div>
          <div className="relative">
            <textarea
              className="w-full mb-0 p-3 pl-11 border border-[#232323] rounded-lg focus:ring-2 focus:ring-[#25F4EE] focus:border-[#25F4EE] transition text-gray-100 font-medium bg-white/10 min-h-[80px] resize-none placeholder-gray-400"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <span className="absolute left-3 top-4 text-[#25F4EE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-8 4h6" /></svg>
            </span>
          </div>
          {loading && (
            <div className="w-full bg-[#232323] rounded-full h-4 mb-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#25F4EE] via-[#FE2C55] to-[#25F4EE] h-4 rounded-full animate-pulse transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="text-center text-xs text-gray-200 mt-1 font-semibold">{progress}%</div>
            </div>
          )}
          <button
            className="w-full py-3 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-black rounded-xl font-bold text-lg shadow-lg hover:scale-105 hover:from-[#FE2C55] hover:to-[#25F4EE] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 animate-pop-in"
            type="submit"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-4 4m4-4l4 4" /></svg>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
} 