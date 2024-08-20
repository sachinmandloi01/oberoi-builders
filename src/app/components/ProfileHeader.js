// src/components/ProfileHeader.js
import React from "react";
import styles from "../details/Profile.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfileHeader = () => {
  const router = useRouter();
  return (
    <div className={styles.profileHeader}>
      <img
        src="./Group39.png"
        alt="Profile Background"
        className={styles.backgroundImage}
      />

      <div className={styles.overlay}>
        <div className={styles.topBar}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            <Image src="/Vector.png" width={10} height={10} />
          </button>
          <div className={styles.actions}>
            <button className={styles.callButton}>
              {" "}
              <Image src="/basil_phone-outline.png" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.stats}>
          <div>
            <p className={styles.shortlisted}>200 </p>
            <p className={styles.shortlisted}>shortlisted</p>
          </div>
          <div>
            <p className={styles.views}>100K </p>
            <p className={styles.views}> Views</p>
          </div>
        </div>
        <h2 className={styles.title}>Oberoi Builders</h2>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className={styles.location}>
          <Image src="/carbon_location.png" width={20} height={5} />
          <p className={styles.address}>
            2972 Westheimer Rd. Santa Ana, Illinois 85486
          </p>
        </div>
        <div className={styles.location}>
          <Image src="/fluent_link-28-filled.png" width={20} height={5} />
          <a href="https://www.oberoibuilders.com" className={styles.website}>
            www.oberoibuilders.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
