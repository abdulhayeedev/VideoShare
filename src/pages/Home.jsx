import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchVideos } from "../services/videoservice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import VideoCard from "../components/VideoCard";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import uploadIcon from "../assets/icons/upload-icon.svg";
import { HomeIcon } from "@heroicons/react/24/solid";

const navItems = [
  { to: "/", icon: <HomeIcon className="w-8 h-8 text-white" />, label: "Home" },
  { to: "/upload", icon: "➕", label: "Upload" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

// Floating SVG shapes for background
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

// Trending tags with shuffle
const initialTags = ["#nature", "#travel", "#skills", "#fun", "#music", "#art", "#tech", "#vlog", "#gaming", "#food"];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tags, setTags] = useState(initialTags.slice(0, 4));
  const [shuffleAnim, setShuffleAnim] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  const handleLogoutCancel = () => setShowLogoutModal(false);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      try {
        const res = await fetchVideos();
        // If response is wrapped with message/data/status
        if (res && res.message) {
          toast.success(res.message);
        }
        setVideos(res.data || res); // fallback to res if not wrapped
      } catch (err) {
        toast.error(err.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Handler to update a video's favorites in the videos state
  const handleFavoriteUpdate = (videoId, newFavorites) => {
    setVideos((prev) => prev.map(v => v.id === videoId ? { ...v, favorites: newFavorites } : v));
  };

  // Shuffle trending tags
  const handleSurprise = () => {
    setShuffleAnim(true);
    setTimeout(() => {
      setTags(prev => {
        let arr = [...initialTags];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.slice(0, 4);
      });
      setShuffleAnim(false);
    }, 500);
  };

  return (
    <>
      <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-[#121212] to-black animate-gradient-move">
        {/* Animated SVG background */}
        <FloatingSVGs />
        {/* Glassmorphism Sidebar */}
        <aside className="hidden md:flex flex-col items-center w-28 py-10 bg-black/40 backdrop-blur-2xl shadow-2xl border-r border-[#232323] z-10 relative sidebar-animate glassmorph-dark">
          <div className="mb-12 flex flex-col items-center relative">
            <div className="bg-transparent rounded-full p-4 shadow-xl mb-2 border-2 border-[#FE2C55]">
              <img src={uploadIcon} alt="Logo" className="w-14 h-14 filter brightness-0 invert" />
            </div>

            <span className="text-white font-black text-xl tracking-widest drop-shadow-lg animate-gradient-text-dark">VShare</span>
          </div>
          <nav className="flex flex-col gap-12 text-3xl mt-6 w-full items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center group transition relative bg-transparent ${isActive
                    ? "text-[#FE2C55] scale-125 shadow-[0_0_16px_4px_rgba(254,44,85,0.7)] shadow-none bg-transparent"
                    : "text-gray-500 hover:text-[#25F4EE] bg-transparent"}`
                }
                title={item.label}
              >
                <span className="transition-transform group-hover:scale-125 group-hover: bg-transparent">{item.icon}</span>
                <span className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-all bg-black/90 px-3 py-1 rounded shadow text-[#25F4EE] font-semibold absolute left-16 whitespace-nowrap z-20 group-hover:scale-110 group-hover:drop-shadow-lg duration-200">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
          {isAuthenticated && (
            <div className="absolute bottom-8 flex flex-col items-center w-full">
              <span className="text-white font-semibold text-xs truncate px-2">
                {useSelector((state) => state.auth.user?.username)
                  ? `@${useSelector((state) => state.auth.user.username)}`
                  : "@user"}
              </span>
              <button
                onClick={handleLogoutClick}
                className="mt-4 p-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition text-base shadow-lg hover:shadow-blue-300/60 hover:scale-110 duration-200 flex items-center justify-center"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-7 h-7" />
              </button>
            </div>
          )}
        </aside>
        {/* Main Feed - Snap Scrolling */}
        <main className="flex-1 flex flex-col items-center justify-center px-0 py-0 overflow-y-auto h-screen relative z-10 custom-scrollbar-dark">
          <div className="w-full h-full max-w-5xl mx-auto">
            {/* Welcome header */}
            <div className="w-full flex flex-col items-center mt-12 mb-6 animate-fade-in">
              <div className="flex items-center gap-4 mb-3">
                <img src={uploadIcon} alt="Welcome" className="w-14 h-14 drop-shadow-2xl -slow filter brightness-0 invert" />
                <h1 className="text-5xl font-black bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#FFFFFF] bg-clip-text text-transparent drop-shadow-2xl tracking-tight animate-gradient-text-dark">Welcome to VShare</h1>
              </div>
              <p className="text-lg text-gray-200 mb-2 font-medium animate-fade-in-slow">Discover, share, and enjoy amazing videos from creators around the world.</p>
              {!isAuthenticated && (
                <div className="mt-3">
                  <NavLink to="/register" className="px-8 py-3 bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#FFFFFF] text-black rounded-full font-extrabold hover:scale-105 hover:shadow-xl transition-all shadow-lg text-xl animate-fade-in">Join Now</NavLink>
                </div>
              )}
            </div>
            {/* Trending/Tags section with shuffle */}
            <div className={`flex flex-wrap gap-4 mb-10 justify-center animate-fade-in-slow ${shuffleAnim ? 'animate-shuffle' : ''}`}>
              {tags.map((tag, i) => (
                <span key={tag} className="animate-gradient-text-dark text-white font-bold text-base px-6 py-3 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer animate-pop-in border border-[#25F4EE]" style={{ animationDelay: `${i * 0.07}s` }}>{tag}</span>
              ))}
              <button onClick={handleSurprise} className="ml-2 px-5 py-2 bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] text-black rounded-full font-bold shadow-lg hover:scale-110 hover:shadow-[#FE2C55]/40 transition-all animate-pop-in border border-[#FE2C55]" style={{ animationDelay: `${tags.length * 0.07}s` }}>🎲 Surprise Me</button>
            </div>
            {/* Video grid with glassmorphism and hover overlays */}
            {loading ? (
              <div className="flex flex-col justify-center items-center h-96">
                <svg className="animate-spin h-14 w-14 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="text-indigo-500 text-2xl font-black animate-pulse">Loading videos...</span>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <span className="text-gray-500 text-xl font-semibold">No videos found.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="">
                    <VideoCard video={video} userId={userId} onFavoriteUpdate={handleFavoriteUpdate} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-[#232323] rounded-2xl shadow-2xl p-8 flex flex-col items-center w-80 animate-fade-in border border-[#25F4EE]">
            <ArrowRightOnRectangleIcon className="text-[#FE2C55] w-12 h-12 mb-2" />
            <h3 className="text-lg font-bold text-white mb-2">Confirm Logout</h3>
            <p className="text-gray-300 mb-6 text-center">Are you sure you want to logout?</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={handleLogoutConfirm}
                className="px-5 py-2 bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] text-black rounded-xl font-bold hover:scale-105 hover:shadow-xl transition shadow text-base"
              >
                Confirm
              </button>
              <button
                onClick={handleLogoutCancel}
                className="px-5 py-2 bg-[#232323] text-white rounded-xl font-bold hover:bg-[#121212] transition shadow text-base border border-[#25F4EE]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 