import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { likeVideo, unfavoriteVideo, addComment } from "../services/videoservice";
import { toast } from "react-toastify";

export default function VideoCard({ video, userId, onFavoriteUpdate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(video.comments || []);
  const [favorites, setFavorites] = useState(Array.isArray(video.favorites) ? video.favorites : []);
  const [likeCount, setLikeCount] = useState(favorites.length);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  // Find if user already favorited and get the favorite object
  const userFavorite = favorites.find(fav => fav.user == userId);
  const alreadyFavorited = !!userFavorite;

  // Like (Favorite) Handler
  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (!alreadyFavorited) {
        const newFav = await likeVideo(video.id);
        const favObj = newFav.data || newFav; // fallback if not wrapped
        const updatedFavorites = [...favorites, favObj];
        setFavorites(updatedFavorites);
        setLikeCount(c => c + 1);
        if (onFavoriteUpdate) onFavoriteUpdate(video.id, updatedFavorites);
        if (newFav && newFav.message) toast.success(newFav.message);
      } else {
        const res = await unfavoriteVideo(userFavorite.id);
        const updatedFavorites = favorites.filter(fav => fav.id !== userFavorite.id);
        setFavorites(updatedFavorites);
        setLikeCount(c => Math.max(0, c - 1));
        if (onFavoriteUpdate) onFavoriteUpdate(video.id, updatedFavorites);
        if (res && res.message) toast.success(res.message);
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        dispatch(logout());
        navigate("/login");
        return;
      }
      toast.error(err.message || "Failed to update favorite");
    } finally {
      setLikeLoading(false);
    }
  };

  // Comment Handler
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const data = await addComment({ video: video.id, text: commentText, is_shared: true });
      setComments((prev) => [...prev, data]);
      setCommentText("");
    } catch (err) {
      if (err.message === "Unauthorized") {
        dispatch(logout());
        navigate("/login");
        return;
      }
      toast.error(err.message || "Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // Share Handler
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/video/" + video.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoClick = () => {
    handlePlayPause();
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  return (
    <section
      className="flex flex-col justify-between items-start snap-center group transition-transform duration-300 glassmorph-card-dark p-8 w-full max-w-full min-h-[480px] h-[480px] sm:h-[500px] md:h-[520px] rounded-3xl shadow-2xl overflow-hidden animate-pop-in"
      style={{ boxShadow: '0 8px 32px 0 rgba(254,44,85,0.10), 0 1.5px 8px 0 rgba(37,244,238,0.08)', background: 'rgba(18,18,18,0.85)' }}
    >
      {/* Video Title */}
      <h2 className="text-2xl md:text-3xl font-extrabold animate-gradient-text-dark mb-2 w-full text-left tracking-tight drop-shadow-lg animate-fade-in line-clamp-2">
        {video.title}
      </h2>
      {/* Uploader Info */}
      <div className="flex items-center gap-3 mb-2 animate-fade-in-slow">
        <img
          src={video.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${video.uploaded_by}`}
          alt={video.user?.user_name || `User #${video.uploaded_by}`}
          className="w-10 h-10 rounded-full border-2 border-[#25F4EE] shadow-md bg-[#232323]"
        />
        <span className="font-semibold text-white text-base drop-shadow">
          {video.uploader_name || `${video.uploaded_by}`}
        </span>
        <span className="ml-2 text-xs text-gray-400">{new Date(video.uploaded_at).toLocaleString()}</span>
      </div>
      {/* Video Player */}
      <div
        className="w-full flex justify-center items-center rounded-2xl overflow-hidden shadow-lg border-2 border-[#FE2C55] bg-black mb-4 relative animate-fade-in min-h-[180px] max-h-[220px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ boxShadow: '0 4px 24px 0 rgba(254,44,85,0.18)' }}
      >
        <video
          ref={videoRef}
          src={video.video}
          className="max-w-full max-h-[200px] object-contain rounded-2xl bg-transparent shadow-xl"
          poster={video.thumbnail || '/default-thumbnail.png'}
          preload="metadata"
          onClick={handleVideoClick}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          style={{ background: "transparent" }}
          controls={false}
        />
        {/* Play/Pause Button Logic */}
        {!isPlaying ? (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center focus:outline-none"
            style={{ pointerEvents: "auto", background: "transparent", boxShadow: "none" }}
            aria-label="Play video"
          >
            <span className="bg-[#FE2C55]/80 rounded-full p-4 transition hover:bg-[#25F4EE]/80 shadow-xl border-2 border-[#25F4EE]">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </span>
          </button>
        ) : (
          isHovered && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center focus:outline-none"
              style={{ pointerEvents: "auto", background: "transparent", boxShadow: "none" }}
              aria-label="Pause video"
            >
              <span className="bg-[#25F4EE]/80 rounded-full p-4 transition hover:bg-[#FE2C55]/80 animate-pulse shadow-xl border-2 border-[#FE2C55]">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="2" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" rx="2" fill="currentColor"/>
                </svg>
              </span>
            </button>
          )
        )}
      </div>
      {/* Video Description */}
      <p className="mt-2 text-base text-gray-200 w-full text-left font-medium mb-2 animate-fade-in line-clamp-2">
        {video.description}
      </p>
      {/* Tags (optional) */}
      {video.tags && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 animate-fade-in-slow">
          {video.tags.map((tag, idx) => (
            <span key={idx} className="animate-gradient-text-dark text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:scale-105 transition-all cursor-pointer border border-[#FE2C55]">
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex gap-6 mt-auto justify-center animate-fade-in-slow">
        {/* Like Button */}
        <button
          className={`flex flex-col items-center justify-center bg-[#121212] shadow-lg rounded-full w-16 h-16 transition-transform hover:scale-110 border-2 border-[#FE2C55] group ${alreadyFavorited ? 'text-[#FE2C55] animate-pulse' : 'text-[#25F4EE]'}`}
          onClick={handleLike}
          disabled={likeLoading}
          title={alreadyFavorited ? 'Unlike' : 'Like'}
        >
          <svg className="w-8 h-8 mb-1" fill={alreadyFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
          <span className="text-xs font-bold">{likeCount}</span>
        </button>
        {/* Comment Button */}
        <button
          className="flex flex-col items-center justify-center bg-white shadow-lg rounded-full w-16 h-16 transition-transform hover:scale-110 border-2 border-cyan-200 text-cyan-600 group"
          onClick={() => setShowComments((v) => !v)}
          title="Comments"
        >
          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2m5-4h-4a2 2 0 00-2 2v0a2 2 0 002 2h4a2 2 0 002-2v0a2 2 0 00-2-2z" />
          </svg>
          <span className="text-xs font-bold">{comments.length}</span>
        </button>
        {/* Share Button */}
        <button
          className="flex flex-col items-center justify-center bg-white shadow-lg rounded-full w-16 h-16 transition-transform hover:scale-110 border-2 border-cyan-200 text-cyan-600 group"
          onClick={handleShare}
          title="Share"
        >
          <svg className="w-8 h-8 mb-1 animate-fade-in" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4m4-4v16" />
          </svg>
          <span className="text-xs font-bold">{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="w-full mt-6 animate-fade-in-slow">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
            <input
              className="flex-1 p-2 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition bg-white/80"
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={commentLoading}
            />
            <button
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-600 transition disabled:opacity-60"
              type="submit"
              disabled={commentLoading}
            >
              {commentLoading ? 'Posting...' : 'Post'}
            </button>
          </form>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {comments.length === 0 ? (
              <div className="text-gray-400 text-sm">No comments yet.</div>
            ) : (
              comments.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2 shadow animate-fade-in">
                  <img
                    src={c.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${c.user?.id || c.user}`}
                    alt={c.user?.user_name || `User #${c.user?.id || c.user}`}
                    className="w-7 h-7 rounded-full border border-cyan-200"
                  />
                  <span className="font-semibold text-cyan-600 text-xs">{c.user?.user_name || `User #${c.user?.id || c.user}`}</span>
                  <span className="text-gray-600 text-sm flex-1">{c.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
} 