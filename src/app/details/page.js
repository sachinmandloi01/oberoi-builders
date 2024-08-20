"use client";
import React, { useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import TabMenu from "../components/TabMenu";
import PostVideoToggle from "../components/PostVideoToggle";
import ImageGrid from "../components/ImageGrid";
import styles from "./Profile.module.css";

const posts = [
  "./Rectangle13.png",
  "./Rectangle14.png",
  "./Rectangle15.png",
  "./Rectangle16.png",
  "./Rectangle17.png",
  "./Rectangle18.png",
  "./Rectangle19.png",
  "./Rectangle20.png",

  ,
];

const videos = ["./1.mp4", "./2.mp4", "./3.mp4", "./4.mp4"];

export default function Page() {
  const [activeContent, setActiveContent] = useState("Posts");

  return (
    <div className={"app"}>
      <ProfileHeader />
      <TabMenu />
      <PostVideoToggle
        activeContent={activeContent}
        setActiveContent={setActiveContent}
      />
      <div className={styles.content}>
        <ImageGrid
          items={activeContent === "Posts" ? posts : videos}
          type={activeContent === "Posts" ? "image" : "video"}
        />
      </div>
    </div>
  );
}
