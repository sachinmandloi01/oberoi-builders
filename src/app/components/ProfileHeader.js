"use client";
import React, { useState, useEffect } from "react";
import styles from "../details/Profile.module.css";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

const ProfileHeader = (props) => {
  const [data, setData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  useEffect(() => {
    setData(props.data);
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, [props.data]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data?.propertyImages?.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    if (data?.propertyImages?.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === data?.propertyImages?.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.slider}>
        {/* <button className={styles.prevButton} onClick={prevSlide}>
          &#10094;
        </button> */}
        <div className={styles.imageContainer}>
          <div className={styles.vectorIconContainer}>
            <img
              src="../Vector.png"
              width={13}
              onClick={() => router.push(`/`)}
            />
          </div>

          {data?.propertyImages?.map((image, index) => {
            // console.log("Image URL:", image);
            // console.log("Index:", index);
            // console.log("Current Index:", currentIndex);

            return (
              <div
                className={`${styles.imageSlide} ${
                  index === currentIndex ? styles.active : ""
                }`}
                key={index}
              >
                {index === currentIndex && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${image}`}
                    alt={`Slide ${index}`}
                    objectFit="cover"
                    layout="fill"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* <button className={styles.nextButton} onClick={nextSlide}>
          &#10095;
        </button> */}
      </div>

      {/* Rest of the ProfileHeader code */}
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
        <h2 className={styles.title}>{data?.contactName}</h2>
        <p className={styles.description}>{data?.propertyDescription}</p>
        <div className={styles.location}>
          <Image src="/carbon_location.png" width={20} height={5} />
          <p className={styles.address}>{data?.location}</p>
        </div>
        <div className={styles.location}>
          <Image src="/fluent_link-28-filled.png" width={20} height={5} />
          <a
            href={data?.websiteLink}
            target="__blank"
            className={styles.website}
          >
            {data?.websiteLink}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
