"use client";
import { useState, useEffect, useRef } from "react";
import "./page.module.css";
import Image from "next/image";
export default function Home() {
  const videos = [
    { name: "Hotel WOW", src: "./1.mp4" },
    { name: "Oberoi Hotels", src: "./2.mp4" },
    { name: "Radisson Blu Mumbai International Airport", src: "./3.mp4" },
    { name: "Fairfield by Marriott Mumbai", src: "./4.mp4" },
  ];

  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const videoRefs = useRef([]);

  const handleUnmute = () => {
    if (videoRefs.current[0]) {
      videoRefs.current[0].muted = false;
      setIsMuted(false);
    }
  };
  const handlemute = () => {
    if (videoRefs.current[0]) {
      videoRefs.current[0].muted = true;
      setIsMuted(true);
    }
  };

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

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0; // Reset video to the beginning
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
    const handleScroll = () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          const rect = video.getBoundingClientRect();
          const inView =
            rect.top >= 0 &&
            rect.bottom <=
              (window.innerHeight || document.documentElement.clientHeight);

          if (inView) {
            video.play();
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Initial call to handleScroll to autoplay the first video
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    loadVideoChunk(0, 0, 500000); // Load first chunk of the first video
  }, []);

  const handleVideoEnded = (videoIndex) => {
    const nextStart = 500001; // Continue from where the last chunk ended
    const nextEnd = nextStart + 500000; // Next chunk size
    loadVideoChunk(videoIndex, nextStart, nextEnd);
  };

  return (
    <div className="app">
      {/* <header className="app-header">
        <div className="location-info">
          <span className="location">Vijay nagar</span>
          <span className="city">Indore</span>
        </div>
        <div className="header-icons">
          <i className="icon-bookmark"></i>
          <i className="icon-notifications"></i>
          <i className="icon-menu"></i>
        </div>
      </header> */}
      <div className="reel-container">
        {videos.map((item, index) => (
          <div className="reel-card" key={index}>
            <div className="builder-info">
              <div className="builder-main">
                <div className="builder-text">
                  <h3>{item.name}</h3>
                  <p>Indore, 25 Min away</p>
                </div>
                {/* <p className="distance">6km away</p> */}
              </div>
            </div>

            <div className="reel-video">
              <video
                src={index === 0 ? videoSrc : item.src}
                autoPlay={index === 0}
                loop={true}
                playsInline
                className="video-player"
                controls={false}
                muted={isMuted}
                ref={(el) => (videoRefs.current[index] = el)}
                onEnded={() => handleVideoEnded(index)}
              ></video>

              {isMuted && (
                <div className="unmute-button" onClick={handleUnmute}>
                  <Image src="/1234.png" alt="test" width={25} height={20} />
                </div>
              )}
              {!isMuted && (
                <div className="unmute-button" onClick={handlemute}>
                  <Image
                    src="/Speaker_Icon.svg.png"
                    alt="test"
                    width={25}
                    height={20}
                  />
                </div>
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
