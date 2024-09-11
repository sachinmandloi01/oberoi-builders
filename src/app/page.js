"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.module.css";
import SearchModal from "./components/SearchModal";

export default function Home() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const videoRefs = useRef([]);
  const secondReelRef = useRef(null); // Ref for the second reel-card
  const [videos, setVideos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/property`)
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  // const videos = [
  //   { name: "Hotel WOW", src: "./1.mp4" },
  //   { name: "Oberoi Hotels", src: "./2.mp4" },
  //   { name: "Radisson Blu Mumbai International Airport", src: "./3.mp4" },
  //   { name: "Fairfield by Marriott Mumbai", src: "./4.mp4" },
  // ];

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
    const handleScroll = () => {
      const topElements = document.querySelectorAll(".top"); // Select all elements with class 'top'

      // Loop through all elements and apply the same logic
      topElements.forEach((topElement) => {
        if (window.scrollY > 50) {
          topElement.style.top = "0vh"; // Scrolls down
        } else {
          topElement.style.top = "7vh"; // Near the top
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  }, [videos]);

  useEffect(() => {
    if (videos.length > 0) {
      loadVideoChunk(0, 0, 500000); // Load first chunk of the first video
    }
  }, [videos]);

  const loadVideoChunk = async (videoIndex, start, end) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/uploads/videos/${videos[videoIndex].videoFiles[0]}`,
      {
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      }
    );

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
    <>
      <div className="app">
        {isWelcomeModalOpen && (
          <div className="welcome-modal">
            <div className="welcome-content">
              <h2>Welcome to Our Property</h2>
              <button onClick={closeWelcomeModal}>Enter</button>
            </div>
          </div>
        )}
        {isModalOpen && <SearchModal onClose={closeModal} />}
        <header>
          <nav className="navbar">
            <div className="container">
              <div className="location-info">
                <img src="/carbon_location.png" width={22} height={22} />
                <h4>Vijay Nagar</h4>
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                <p>Indore</p>
              </div>
              <div className="nav-links">
                <ul className="nav-group">
                  <li className="nav-item">
                    <a href="#">
                      <img src={"/bx_bookmark-w.png"} height={30} width={30} />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#">
                      <img
                        onClick={openModal}
                        src={"/iconamoon_search.png"}
                        height={31}
                        width={31}
                      />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="">
                      <img
                        src={"/solar_point-on-map-bold.png"}
                        height={30}
                        width={31}
                      />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="">
                      <i className="far fa-heart"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main>
          <div className="container">
            <div className="col-9">
              {videos?.map((item, index) => (
                <div className="card reel-card" key={index}>
                  <div
                    className="top"
                    onClick={() => router.push(`/details/${item?._id}`)}
                  >
                    <div className="userDetails">
                      <div className="profilepic">
                        <div className="profile_img">
                          <div className="image">
                            <img
                              src="https://media.geeksforgeeks.org/wp-content/uploads/20220609093241/g3-200x200.png"
                              alt="img9"
                            />
                          </div>
                        </div>
                      </div>
                      <h3>
                        {item?.contactName}
                        <br />
                        <span>{item?.location}</span>
                      </h3>
                      <div className="builder-location-text">
                        <img
                          src={"/solar_point-on-map-bold.png"}
                          height={30}
                          width={31}
                        />
                        <span className="distance-info">6Km away</span>
                      </div>
                    </div>
                    <div>
                      <span className="dot">
                        <i className="fas fa-ellipsis-h"></i>
                      </span>
                    </div>
                  </div>
                  <div className="imgBx">
                    <div className="video-container">
                      <video
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/videos/${item.videoFiles[0]}`}
                        autoPlay
                        loop
                        playsInline
                        className="video-player"
                        controls={false}
                        muted={isMuted}
                        ref={(el) => (videoRefs.current[index] = el)}
                        onEnded={() => handleVideoEnded(index)}
                      ></video>
                      {isMuted && (
                        <div className="unmute-button" onClick={handleUnmute}>
                          <img
                            src="/1234.png"
                            alt="test"
                            width={25}
                            height={20}
                          />
                        </div>
                      )}
                      {!isMuted && (
                        <div className="unmute-button" onClick={handleMute}>
                          <img
                            src="/Speaker_Icon.svg.png"
                            alt="test"
                            width={25}
                            height={20}
                          />
                        </div>
                      )}
                    </div>

                    <div className="bottom">
                      <div className="actionBtns">
                        <img src={"/bx_bookmark.png"} height={30} width={30} />
                        <a
                          href="https://wa.me/9669563039?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                        >
                          <img src={"/whatsapp.png"} height={28} width={28} />
                        </a>
                        <a href="tel:+1234567890" className="btn">
                          <img
                            src={"/basil_phone-outline-b.png"}
                            height={34}
                            width={34}
                          />
                        </a>
                        <img
                          src={"/bitcoin-icons_share-outline.png"}
                          height={33}
                          width={33}
                        />
                      </div>
                      <div>
                        <button className="reviews-button">Reviews</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
