"use client";
import { useState, useEffect, useRef } from "react";
import "./page.module.css";
import Image from "next/image";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true); // Modal state
  const videoRefs = useRef([]);

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
            {/* <p>We are glad to have you here!</p> */}
            <button onClick={closeWelcomeModal}>Enter</button>
          </div>
        </div>
      )}

      <div className="reel-container">
        {videos.map((item, index) => (
          <div className="reel-card" key={index}>
            <div className="builder-info">
              <div className="builder-main">
                <div className="builder-text">
                  <h3>{item.name}</h3>
                  <p>Indore, 25 Min away</p>
                </div>
              </div>
            </div>

            <div className="reel-video">
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

              <div
                className="unmute-button"
                onClick={isMuted ? handleUnmute : handleMute}
              >
                <Image
                  src={isMuted ? "/1234.png" : "/Speaker_Icon.svg.png"}
                  alt="Unmute/Mute"
                  width={25}
                  height={20}
                />
              </div>
            </div>

            <div className="builder-actions">
              <i className="icon-whatsapp"></i>
              <i className="icon-phone"></i>
              <i className="icon-send"></i>
            </div>

            <button className="reviews-button">Reviews</button>
          </div>
        ))}
      </div>
    </div>
  );
}
