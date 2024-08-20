// src/components/PostVideoToggle.js
import React, { useState } from "react";
import styles from "../details/Profile.module.css";
import Image from "next/image";
const PostVideoToggle = () => {
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className={styles.postVideoToggle}>
      <button
        className={`${styles.toggleButton} ${
          activeTab === "Posts" ? styles.active : ""
        }`}
        onClick={() => setActiveTab("Posts")}
      >
        <Image src="/gridIcon.png" width={20} height={5} />{" "}
        <p style={{ marginLeft: "5px" }}>Posts</p>
      </button>
      <button
        className={`${styles.toggleButton} ${
          activeTab === "Videos" ? styles.active : ""
        }`}
        onClick={() => setActiveTab("Videos")}
      >
        <Image src="/video_icon.png" width={30} height={30} />{" "}
        <p style={{ marginLeft: "5px" }}>Videos</p>
      </button>
    </div>
  );
};

export default PostVideoToggle;
