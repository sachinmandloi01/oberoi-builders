"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import ProfileHeader from "../../components/ProfileHeader";
import TabMenu from "../../components/TabMenu";
import PostVideoToggle from "../../components/PostVideoToggle";
import ImageGrid from "../../components/ImageGrid";
import styles from "../Profile.module.css";

const posts = [
  "../Rectangle13.png",
  "../Rectangle14.png",
  "../Rectangle15.png",
  "../Rectangle16.png",
  "../Rectangle17.png",
  "../Rectangle18.png",
  "../Rectangle19.png",
  "../Rectangle20.png",
];

const videos = ["../1.mp4", "../2.mp4", "../3.mp4", "../4.mp4"];

export default function Page() {
  const params = useParams();

  const [activeContent, setActiveContent] = useState("Posts");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/property/${params?.id}`
        );
        setData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={"app"}>
      <div className={styles.container}>
        <div className="col-9">
          <ProfileHeader data={data} />
          <TabMenu data={data} />
          <PostVideoToggle
            activeContent={activeContent}
            setActiveContent={setActiveContent}
            data={data}
          />
          <div className={styles.content}>
            <ImageGrid
              items={data}
              type={activeContent === "Posts" ? "image" : "video"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
