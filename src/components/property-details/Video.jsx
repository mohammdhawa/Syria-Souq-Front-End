import React, { useState, useEffect } from "react";
import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";
import OvalLoader from "../OvalLoader";

export default function Video({ videoUrl }) {
  const [isOpen, setOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const parseYouTubeUrl = (url) => {
    try {
      let id = "";

      if (url.includes("youtube.com/watch")) {
        const params = new URLSearchParams(new URL(url).search);
        id = params.get("v");
      } else if (url.includes("youtu.be")) {
        id = url.split("/").pop().split("?")[0];
      }

      if (!id) throw new Error("Invalid YouTube URL");

      setVideoId(id);
    } catch (error) {
     
      setVideoId("MLpWrANjFbI");
    }
  };

  useEffect(() => {
    if (videoUrl) {
      setIsLoading(true);
      parseYouTubeUrl(videoUrl);
    }
  }, [videoUrl]);

  const getThumbnailUrl = () =>
    videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";

  return (
    <div className="d-flex flex-column gap-0">
      <h5 className="title fw-6">فيديو توضيحي</h5>
      <div className="img-video" style={{ position: "relative" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <OvalLoader />
          </div>
        )}
        <img
          alt="video-thumbnail"
          src={getThumbnailUrl()}
          onLoad={() => setIsLoading(false)}
          style={{
            display: isLoading ? "none" : "block",
            objectFit: "cover",
            maxHeight: "457px",
            width: "100%",
          }}
        />
        {!isLoading && (
          <a
            onClick={() => setOpen(true)}
            className="btn-video"
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="icon icon-play" />
          </a>
        )}
      </div>

      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 1 }}
        isOpen={isOpen}
        videoId={videoId}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
