"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "./page.module.css";

export default function Home() {
  const videos = [
    { name: "Hotel WOW", src: "./1.mp4" },
    { name: "Oberoi Hotels", src: "./2.mp4" },
    {
      name: "Radisson Blu Mumbai International AirportOpens in new window",
      src: "./3.mp4",
    },
    { name: "Fairfield by Marriott Mumbai", src: "./4.mp4" },
  ];

  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);
  const handleUnmute = () => {
    if (videoRefs.current) {
      videoRefs.current.muted = false;
      setIsMuted(false);
    }
  };
  useEffect(() => {
    // Intersection Observer callback
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    // Create Intersection Observer instance
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Trigger when 50% of the video is in view
    });

    // Observe each video
    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      // Clean up the observer on unmount
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="location-info">
          <span className="location">Vijay nagar</span>
          <span className="city">Indore</span>
        </div>
        <div className="header-icons">
          <i className="icon-bookmark"></i>
          <i className="icon-notifications"></i>
          <i className="icon-menu"></i>
        </div>
      </header>
      <div className="reel-container">
        {videos.map((item, index) => (
          <div className="reel-card" key={index}>
            <div className="builder-info">
              <div className="builder-main">
                <div className="builder-text">
                  <h3>{item.name}</h3>
                  <p>Indore, 25 Min away</p>
                </div>
                <p className="distance">6km away</p>
              </div>
            </div>

            <div className="reel-video">
              <video
                src={item.src}
                autoPlay={index === 0}
                loop
                playsInline
                className="video-player"
                controls={false}
                muted={isMuted}
                ref={(el) => (videoRefs.current[index] = el)}
              ></video>
              {isMuted && (
                <button className="unmute-button" onClick={handleUnmute}>
                  🔊
                </button>
              )}
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
