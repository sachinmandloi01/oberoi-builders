"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faMapMarkedAlt,
  faPhoneFlip,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
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
            <button onClick={closeWelcomeModal}>Enter</button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="header">
        <div className="location-info">
          <h4>Vijay Nagar</h4>
          <p>Indore</p>
        </div>
        <div className="header-icons">
          {/* <FontAwesomeIcon icon={faBookmark} className="header-icons-color" /> */}

          {/* <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="header-icons-color"
          />
          <FontAwesomeIcon
            icon={faMapMarkedAlt}
            className="header-icons-color"
          /> */}
          <Image src={"/bx_bookmark-w.png"} height={20} width={20} />
          <Image src={"/iconamoon_search.png"} height={20} width={20} />
          <Image src={"/solar_point-on-map-bold.png"} height={20} width={20} />
        </div>
      </div>

      {/* Property Cards */}
      <div className="reel-container">
        {videos.map((item, index) => (
          <div className="reel-card" key={index}>
            <div
              className="builder-info"
              onClick={() => router.push("/details")}
            >
              <div className="builder-main">
                <div className="builder-text">
                  <h4>{item.name}</h4>
                  <p>Indore, 25 Min away</p>
                </div>
                <span className="distance-info">6Km away</span>
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
            </div>

            <div className="builder-actions">
              {/* <FontAwesomeIcon
                icon={faBookmark}
                className="icons-color-black"
              />

              <FontAwesomeIcon
                icon={faWhatsapp}
                className="icons-color-black"
              />
              <FontAwesomeIcon
                icon={faPhoneFlip}
                className="icons-color-black"
              />
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="icons-color-black"
              /> */}
              <Image src={"/bx_bookmark.png"} height={20} width={20} />
              <Image src={"/whatsapp.png"} height={20} width={20} />
              <Image
                src={"/basil_phone-outline-b.png"}
                height={20}
                width={20}
              />
              <Image
                src={"/bitcoin-icons_share-outline.png"}
                height={20}
                width={20}
              />

              <button className="reviews-button">Reviews</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
