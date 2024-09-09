"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import styles from "./OtpPage.module.css";

const OtpPage = () => {
  const router = useRouter();
  const params = useParams();

  // State to track OTP input values and error
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(""); // Error message state

  // Handle OTP input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^[0-9]*$/)) {
      // Only allow numeric input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  // Check if all OTP fields are filled and if the OTP is correct
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      const enteredOtp = otp.join(""); // Combine OTP digits
      if (enteredOtp === "1234") {
        setError(""); // Clear any previous error
        router.push("/"); // Replace with the actual route
      } else {
        setError("Invalid OTP, please try again."); // Show error message
      }
    }
  }, [otp, router]);

  return (
    <div className={styles.otpContainer}>
      <div className={styles.imageContainer}>
        <Image
          src="/otp_header.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className={styles.backgroundImage}
        />
        <button className={styles.backButton} onClick={() => router.back()}>
          <Image src="/Vector.png" alt="Back" width={24} height={24} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.logo}>LOGO</div>
        <p className={styles.verificationText}>
          We’ve sent a verification code to <br /> {params.phone}
        </p>
        <div className={styles.otpInputContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className={styles.otpInput}
              value={digit}
              onChange={(e) => handleChange(e, index)}
            />
          ))}
        </div>

        {/* Display error message if OTP is incorrect */}
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
};

export default OtpPage;
