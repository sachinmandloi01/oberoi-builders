// src/components/ImageGrid.js
import React from "react";
import styles from "../details/Profile.module.css";

const ImageGrid = ({ items, type }) => {
  return (
    <div className={styles.imageGrid}>
      {items?.videoFiles.map((item, index) => (
        <div key={index} className={styles.imageItem}>
          {type === "image" ? (
            // <img src={item} alt={`Image ${index + 1}`} />
            <video
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/videos/${item}`}
              controls={false}
            />
          ) : (
            <video src={item} controls={false} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
