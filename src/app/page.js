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
    <>
      {/* // <div className="app">
    //   {isWelcomeModalOpen && (
    //     <div className="welcome-modal">
    //       <div className="welcome-content">
    //         <h2>Welcome to Our Property </h2>
    //         <button onClick={closeWelcomeModal}>Enter</button>
    //       </div>
    //     </div>
    //   )}


    //   <div className="header">
    //     <div className="location-info">
    //       <img src="/carbon_location.png" width={22} height={22} />
    //       <h4>Vijay Nagar</h4>
    //       <p>Indore</p>
    //     </div>
    //     <div className="header-icons">
    //       <img src={"/bx_bookmark-w.png"} height={30} width={30} />
    //       <img src={"/iconamoon_search.png"} height={31} width={31} />
    //       <img src={"/solar_point-on-map-bold.png"} height={30} width={31} />
    //     </div>
    //   </div>


    //   <div className="reel-container">
    //     {videos.map((item, index) => (
    //       <div
    //         className="reel-card"
    //         key={index}
    //         ref={index === 1 ? secondReelRef : null} // Attach ref to the second reel-card
    //       >
    //         <div
    //           className="builder-info"
    //           onClick={() => router.push("/details")}
    //         >
    //           <div className="builder-main">
    //             <div className="builder-text">
    //               <img src={"/profile_default.png"} height={40} width={42} />
    //               <h4>{item.name}</h4>
    //               <p>Indore, 25 Min away</p>
    //             </div>
    //             <div className="builder-location-text">
    //               <img
    //                 src={"/solar_point-on-map-bold.png"}
    //                 height={30}
    //                 width={31}
    //               />
    //               <span className="distance-info">6Km away</span>
    //             </div>
    //           </div>
    //         </div>

    //         <div className="reel-video" onClick={() => router.push("/details")}>
    //           <video
    //             src={index === 0 ? videoSrc : item.src}
    //             autoPlay
    //             loop
    //             playsInline
    //             className="video-player"
    //             controls={false}
    //             muted={isMuted}
    //             ref={(el) => (videoRefs.current[index] = el)}
    //             onEnded={() => handleVideoEnded(index)}
    //           ></video>
    //         </div>
    //         <div className="builder-actions">
    //           <img src={"/bx_bookmark.png"} height={30} width={30} />
    //           <img src={"/whatsapp.png"} height={28} width={28} />
    //           <img src={"/basil_phone-outline-b.png"} height={34} width={34} />
    //           <img
    //             src={"/bitcoin-icons_share-outline.png"}
    //             height={33}
    //             width={33}
    //           />
    //           <button className="reviews-button">Reviews</button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div> */}
      <div className="app">
        {isWelcomeModalOpen && (
          <div className="welcome-modal">
            <div className="welcome-content">
              <h2>Welcome to Our Property </h2>
              <button onClick={closeWelcomeModal}>Enter</button>
            </div>
          </div>
        )}
        <header>
          <nav className="navbar">
            <div className="container">
              <div className="logo">
                <a href="#">
                  <img
                    src="/images/logo.png"
                    alt="img1"
                    height="30px"
                    style={{ height: "30px" }}
                  />
                </a>
              </div>

              <div className="nav-links">
                <ul className="nav-group">
                  <li className="nav-item">
                    <a href="#">
                      <img src={"/bx_bookmark-w.png"} height={30} width={30} />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="">
                      <img
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
                  <li className="nav-item">
                    <div className="action">
                      <div className="profile" onclick="menuToggle()">
                        <img
                          src="https://media.geeksforgeeks.org/wp-content/uploads/20220609093221/g2-200x200.jpg"
                          alt="user Avatar"
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main>
          <div className="container">
            <div className="col-9">
              {videos.map((item, index) => (
                <div className="card">
                  <div className="top">
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
                        Piyush Agarwal
                        <br />
                        <span>Delhi, India</span>
                      </h3>
                    </div>
                    <div>
                      <span className="dot">
                        <i className="fas fa-ellipsis-h"></i>
                      </span>
                    </div>
                  </div>
                  <div className="imgBx">
                    <div
                      className="reel-video"
                      onClick={() => router.push("/details")}
                    >
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
                        width={200}
                      ></video>
                    </div>
                    {/* ))} */}
                  </div>
                  <div className="bottom">
                    <div className="actionBtns">
                      <div className="left">
                        <span className="heart" onclick="addlike()">
                          <span>
                            <svg
                              aria-label="Like"
                              color="#262626"
                              fill="#262626"
                              height="24"
                              role="img"
                              viewBox="0 0 48 48"
                              width="24"
                            >
                              <path
                                d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 
												0 6.8-5.9 11-11.5 16S25 41.3 24 
												41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 
												11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 
												4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 
												2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 
												0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 
												3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 
												16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 
												6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 
												1.1-.2 1.6-.5 1-.6 2.8-2.2 
												7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 
												29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                              ></path>
                            </svg>
                          </span>
                        </span>
                        <svg
                          aria-label="Comment"
                          className="_8-yf5 "
                          color="#262626"
                          fill="#262626"
                          height="24"
                          role="img"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <path
                            clip-rule="evenodd"
                            d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1
                  2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11
                  47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2
                  1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2
                  1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8
                  1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7
                  3.5 24 3.5 44.5 12.7 44.5 24z"
                            fill-rule="evenodd"
                          ></path>
                        </svg>
                        <svg
                          aria-label="Share Post"
                          className="_8-yf5 "
                          color="#262626"
                          fill="#262626"
                          height="24"
                          role="img"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <path
                            d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 
										3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 
										1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 
										6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 
										8.6 23.9 39.7z"
                          ></path>
                        </svg>
                      </div>
                      <div className="right">
                        <svg
                          aria-label="Save"
                          className="_8-yf5 "
                          color="#262626"
                          fill="#262626"
                          height="24"
                          role="img"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <path
                            d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 
										47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3 .7 
										3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 
										1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 1.6.3 
										2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <a href="#">
                      <p className="likes">119 likes</p>
                    </a>
                    <a href="#">
                      <p className="message">
                        <b>Piyush Agarwal</b>
                      </p>
                    </a>
                    <a href="#">
                      <h4 className="comments">View all 20 comments</h4>
                    </a>
                    <a href="#">
                      <h5 className="postTime">4 hours ago</h5>
                    </a>
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
