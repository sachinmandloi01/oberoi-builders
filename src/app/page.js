"use client";
import Image from "next/image";
import "./page.module.css";
import { useState } from "react";
export default function Home() {
  const videos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  ];

  // State to track the current video index
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Function to go to the previous video
  const handlePrev = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  // Function to go to the next video
  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };
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

      <div className="reel-card">
        <div className="builder-info">
          <div className="builder-text">
            <h3>Oberoi Builders</h3>
            <p>Indore, 25 Min away</p>
          </div>
          <p className="distance">6km away</p>
        </div>

        <div className="reel-video">
          {/* <video
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video> */}
          {/* <ReactPlayer
            url={videos[currentVideoIndex]}
            controls
            width="640px"
            height="360px"
            playing
          /> */}
          <video
            src={videos[currentVideoIndex]}
            autoPlay
            loop
            muted
            playsInline
          ></video>
          {/* Next and Previous buttons */}
          <div style={{ marginTop: "20px" }}>
            <button onClick={handlePrev} className={"button"}>
              ❮ Previous
            </button>
            <button
              onClick={handleNext}
              className={"button"}
              style={{ float: "right" }}
            >
              Next ❯
            </button>
          </div>
        </div>

        <div className="builder-actions">
          <i className="icon-whatsapp"></i>
          <i className="icon-phone"></i>
          <i className="icon-send"></i>
        </div>

        <button className="reviews-button">Reviews</button>
      </div>
    </div>
  );
}
