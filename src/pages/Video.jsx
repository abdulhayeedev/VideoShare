import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoDetail } from "../services/videoservice";

export default function Video() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      setError(null);
      try {
        const data = await getVideoDetail(id);
        setVideoData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-white">
      <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-cyan-600 mb-6 text-center">Video Page</h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && videoData && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-center">{videoData.title}</h3>
            <video
              className="w-full rounded mb-4"
              src={videoData.video}
              controls
            />
            <p className="mb-4 text-center text-gray-700">{videoData.description}</p>
            <div className="flex justify-center mb-4">
              <ShareButton videoLink={videoData.video} />
            </div>
            <div className="mb-4">
              <h4 className="font-bold mb-2">Comments:</h4>
              {videoData.comments && videoData.comments.length > 0 ? (
                <ul className="space-y-2">
                  {videoData.comments.map((comment) => (
                    <li key={comment.id} className="bg-gray-100 p-2 rounded">
                      <span className="font-mono text-blue-600">User {comment.user}:</span> {comment.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
            <p className="mb-2 text-center text-xs text-gray-400">Video ID: <span className="font-mono text-blue-600">{id}</span></p>
          </>
        )}
      </div>
    </div>
  );
}

function ShareButton({ videoLink }) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(videoLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleShare}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        Share Video Link
      </button>
      {copied && (
        <span className="mt-2 text-green-600 text-sm">Link copied!</span>
      )}
    </div>
  );
} 