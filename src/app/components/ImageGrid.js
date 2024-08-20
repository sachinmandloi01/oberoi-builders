// src/components/ImageGrid.js
import React from "react";
import styles from "../details/Profile.module.css";

const ImageGrid = ({ items, type }) => {
  return (
    <div className={styles.imageGrid}>
      {items.map((item, index) => (
        <div key={index} className={styles.imageItem}>
          {type === "image" ? (
            <img src={item} alt={`Image ${index + 1}`} />
          ) : (
            <video src={item} controls />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
