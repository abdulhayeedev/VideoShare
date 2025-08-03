import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfile as fetchProfileService, refreshToken as refreshTokenService } from "../services/userServices";
import { logout, loginSuccess } from "../redux/slices/authSlice";

// Animated spinner for loading
const Spinner = () => (
  <div className="flex justify-center items-center my-6">
    <div className="w-10 h-10 border-4 border-[#25F4EE] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Multi-glow animated avatar with neon ring
const DefaultAvatar = () => (
  <div className="relative flex items-center justify-center group mb-2">
    <span className="absolute inline-flex h-36 w-36 rounded-full bg-gradient-to-tr from-[#FE2C55] via-[#25F4EE] to-[#232323] opacity-40 animate-pulse-slow blur-sm"></span>
    <span className="absolute inline-flex h-32 w-32 rounded-full bg-[#232323] border-4 border-[#25F4EE] opacity-80 animate-pulse"></span>
    <svg className="w-24 h-24 text-cyan-400 mx-auto mb-4 z-10 drop-shadow-lg group-hover:scale-105 group-hover:rotate-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path strokeWidth="2" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
    </svg>
  </div>
);

// Social icons (vibrant, interactive)
const SocialIcons = () => (
  <div className="flex gap-4 justify-center mt-4">
    <a href="#" className="text-[#25F4EE] hover:text-[#FE2C55] transition-transform transform hover:scale-125 drop-shadow-neon" title="Twitter">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.36 0-.71-.02-1.06-.06A12.13 12.13 0 0 0 7.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg>
    </a>
    <a href="#" className="text-[#FE2C55] hover:text-[#25F4EE] transition-transform transform hover:scale-125 drop-shadow-neon" title="Instagram">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 2.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.13 1.13a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0z"/></svg>
    </a>
    <a href="#" className="text-[#25F4EE] hover:text-[#FE2C55] transition-transform transform hover:scale-125 drop-shadow-neon" title="YouTube">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9C16.1 5 12 5 12 5h-.1s-4.1 0-7.1.1c-.4.1-1.2.1-1.9.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.5.1 6.9.1 6.9.1s4.1 0 7.1-.1c.4-.1 1.2-.1 1.9-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2zM9.8 15.3V8.7l6.4 3.3-6.4 3.3z"/></svg>
    </a>
  </div>
);

// Info row icon
const InfoIcon = ({ type }) => {
  if (type === "username")
    return (
      <svg className="w-5 h-5 text-cyan-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" /></svg>
    );
  if (type === "email")
    return (
      <svg className="w-5 h-5 text-cyan-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
    );
  if (type === "type")
    return (
      <svg className="w-5 h-5 text-cyan-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
    );
  return null;
};

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const refresh = useSelector((state) => state.auth.refresh);
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    setCardVisible(false);
    const getProfile = async () => {
      setLoading(true);
      setError(null);
      let currentToken = token;
      try {
        const data = await fetchProfileService(currentToken, refresh);
        setProfile(data);
      } catch (err) {
        if (err.message && err.message.includes("token")) {
          try {
            const refreshData = await refreshTokenService(refresh);
            currentToken = refreshData.access;
            dispatch(loginSuccess({ token: currentToken, refresh, user }));
            const data = await fetchProfileService(currentToken, refresh);
            setProfile(data);
          } catch (refreshErr) {
            setError("Session expired. Please log in again.");
            dispatch(logout());
          }
        } else {
          setError(err.message || "Failed to fetch profile");
        }
      } finally {
        setLoading(false);
        setTimeout(() => setCardVisible(true), 100);
      }
    };
    if (token && refresh) {
      getProfile();
    }
  }, [token, refresh, dispatch, user]);

  // For staggered info row animation
  const [showRows, setShowRows] = useState([false, false, false]);
  useEffect(() => {
    if (profile) {
      setShowRows([false, false, false]);
      setTimeout(() => setShowRows([true, false, false]), 200);
      setTimeout(() => setShowRows([true, true, false]), 400);
      setTimeout(() => setShowRows([true, true, true]), 600);
    }
  }, [profile]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#121212] to-black animate-gradient-move">
      {/* Profile Card */}
      <div
        className={`z-10 glassmorph-card-dark p-10 rounded-3xl shadow-2xl w-full max-w-md border-2 border-[#25F4EE] ring-2 ring-[#FE2C55]/60 relative transition-all duration-700 ease-out transform ${cardVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} hover:scale-105 hover:shadow-2xl`}
        style={{ boxShadow: "0 8px 32px 0 rgba(0, 188, 212, 0.25)" }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 p-2 rounded-full bg-[#232323] hover:bg-[#121212] active:scale-90 transition-all duration-200 shadow text-[#25F4EE] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Edit Profile Button (always for logged-in user) */}
        {user && (
          <button
            onClick={() => navigate('/profile/edit', { replace: true })}
            className="absolute top-4 right-4 p-2 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25F4EE] -slow"
            title="Edit Profile"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        )}
        <h2 className="text-3xl font-extrabold animate-gradient-text-dark mb-2 text-center tracking-tight drop-shadow">User Profile</h2>
        <div className="flex justify-center mb-2">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#232323] animate-gradient-move"></div>
        </div>
        <p className="text-center text-gray-400 mb-6">Personal details and account info</p>
        {loading && <Spinner />}
        {error && (
          <p className="text-center text-[#FE2C55]  mt-4 mb-2">{error}</p>
        )}
        {profile && (
          <div className="flex flex-col items-center">
            <DefaultAvatar />
            <div className="w-full mt-2">
              <div className="flex flex-col gap-2">
                <div className={`flex items-center py-2 border-b border-[#25F4EE]/30 transition-all duration-700 ${showRows[0] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}> 
                  <InfoIcon type="username" />
                  <span className="text-[#25F4EE] font-semibold mr-2">Username:</span>
                  <span className="font-mono text-[#FE2C55] text-lg drop-shadow-neon">{profile.username}</span>
                </div>
                <div className={`flex items-center py-2 border-b border-[#25F4EE]/30 transition-all duration-700 delay-100 ${showRows[1] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}> 
                  <InfoIcon type="email" />
                  <span className="text-[#25F4EE] font-semibold mr-2">Email:</span>
                  <span className="font-mono text-[#FE2C55] drop-shadow-neon">{profile.email}</span>
                </div>
                <div className={`flex items-center py-2 transition-all duration-700 delay-200 ${showRows[2] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}> 
                  <InfoIcon type="type" />
                  <span className="text-[#25F4EE] font-semibold mr-2">Account Type:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-md transition-all animate-pulse ${profile.is_creator ? 'bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] text-black' : 'bg-[#232323] text-[#25F4EE] border border-[#25F4EE]'}`}>{profile.is_creator ? 'Creator' : 'Viewer'}</span>
                </div>
              </div>
              {/* Animated divider */}
              <div className="my-6">
                <div className="h-1 w-full rounded-full bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#232323] animate-gradient-move"></div>
              </div>
              {/* Social icons */}
              <SocialIcons />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Add this to your CSS if not present:
// .drop-shadow-neon { filter: drop-shadow(0 0 6px #25F4EE) drop-shadow(0 0 2px #FE2C55); }
// .animate-pulse-slow { animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
// .-slow { animation: bounce 2.5s infinite; } 