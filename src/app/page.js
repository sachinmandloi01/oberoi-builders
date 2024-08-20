"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  const videoRefs = useRef([]);
  const secondReelRef = useRef(null); // Ref for the second reel-card

  const videos = [
    { name: "Hotel WOW", src: "./1.mp4" },
    { name: "Oberoi Hotels", src: "./2.mp4" },
    { name: "Radisson Blu Mumbai International Airport", src: "./3.mp4" },
    { name: "Fairfield by Marriott Mumbai", src: "./4.mp4" },
  ];

  const handleUnmute = () => {
    setIsMuted(false);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = false;
    });
  };

  const handleMute = () => {
    setIsMuted(true);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = true;
    });
  };

  const closeWelcomeModal = () => {
    setIsMuted(false);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = false;
    });
    setIsWelcomeModalOpen(false);

    // Scroll to the second reel-card
    if (secondReelRef.current) {
      secondReelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.8,
    });

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, []);

  useEffect(() => {
    loadVideoChunk(0, 0, 500000); // Load first chunk of the first video
  }, []);

  const loadVideoChunk = async (videoIndex, start, end) => {
    const response = await fetch(videos[videoIndex].src, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

    const blob = await response.blob();
    const chunkUrl = URL.createObjectURL(blob);
    setVideoSrc(chunkUrl);
  };

  const handleVideoEnded = (videoIndex) => {
    const nextStart = 500001;
    const nextEnd = nextStart + 500000;
    loadVideoChunk(videoIndex, nextStart, nextEnd);
  };

  return (
    <div className="app">
      {isWelcomeModalOpen && (
        <div className="welcome-modal">
          <div className="welcome-content">
            <h2>Welcome to Our Property </h2>
            <button onClick={closeWelcomeModal}>Enter</button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="header">
        <div className="location-info">
          <img src="/carbon_location.png" width={22} height={22} />
          <h4>Vijay Nagar</h4>
          <p>Indore</p>
        </div>
        <div className="header-icons">
          <img src={"/bx_bookmark-w.png"} height={30} width={30} />
          <img src={"/iconamoon_search.png"} height={31} width={31} />
          <img src={"/solar_point-on-map-bold.png"} height={30} width={31} />
        </div>
      </div>

      {/* Property Cards */}
      <div className="reel-container">
        {videos.map((item, index) => (
          <div
            className="reel-card"
            key={index}
            ref={index === 1 ? secondReelRef : null} // Attach ref to the second reel-card
          >
            <div
              className="builder-info"
              onClick={() => router.push("/details")}
            >
              <div className="builder-main">
                <div className="builder-text">
                  <img src={"/profile_default.png"} height={40} width={42} />
                  <h4>{item.name}</h4>
                  <p>Indore, 25 Min away</p>
                </div>
                <div className="builder-location-text">
                  <img
                    src={"/solar_point-on-map-bold.png"}
                    height={30}
                    width={31}
                  />
                  <span className="distance-info">6Km away</span>
                </div>
              </div>
            </div>

            <div className="reel-video" onClick={() => router.push("/details")}>
              <video
                src={index === 0 ? videoSrc : item.src}
                autoPlay
                loop
                playsInline
                className="video-player"
                controls={false}
                muted={isMuted}
                ref={(el) => (videoRefs.current[index] = el)}
                onEnded={() => handleVideoEnded(index)}
              ></video>
            </div>
          </div>
        ))}
        <div className="builder-actions">
          <img src={"/bx_bookmark.png"} height={30} width={30} />
          <img src={"/whatsapp.png"} height={28} width={28} />
          <img src={"/basil_phone-outline-b.png"} height={34} width={34} />
          <img
            src={"/bitcoin-icons_share-outline.png"}
            height={33}
            width={33}
          />
          <button className="reviews-button">Reviews</button>
        </div>
      </div>
    </div>
  );
}
