// src/components/PostVideoToggle.js
import React, { useState } from "react";
import styles from "../details/Profile.module.css";
import Image from "next/image";
import Link from "next/link";
const PostVideoToggle = ({ activeContent, setActiveContent, data }) => {
  // const [activeTab, setActiveTab] = useState("Posts");

  const handleClick = (index) => {
    setActiveContent(index);
  };

  return (
    <div className={styles.postVideoToggle}>
      <button
        className={`${styles.toggleButton} ${
          activeContent === "Posts" ? styles.active : ""
        }`}
        onClick={() => handleClick("Posts")}
      >
        <Image src="/gridIcon.png" width={20} height={5} />{" "}
        <p style={{ marginLeft: "5px" }}>Posts</p>
      </button>
      <button
        className={`${styles.toggleButton} ${
          activeContent === "Videos" ? styles.active : ""
        }`}
        // onClick={() => handleClick("Videos")}
      >
        <Image src="/video_icon.png" width={30} height={30} />{" "}
        <a href={data?.youtubeLinks} target="_blank" rel="noopener noreferrer">
          Videos
        </a>
      </button>
    </div>
  );
};

export default PostVideoToggle;
