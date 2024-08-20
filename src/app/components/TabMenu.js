// src/components/TabMenu.js
import React from "react";
import styles from "../details/Profile.module.css";

const TabMenu = () => {
  return (
    <div className={styles.tabMenu}>
      <button className={styles.tabButton}>Amenities</button>
      <button className={styles.tabButton}>Activities</button>
      <button className={styles.tabButton}>Rules</button>
    </div>
  );
};

export default TabMenu;
