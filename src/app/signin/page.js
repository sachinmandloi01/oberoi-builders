"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Signup.module.css";

const Signin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (phoneNumber) {
      // Redirect to the OTP page with the phone number as a query parameter
      router.push(`/OTPverification/${phoneNumber}`);
    } else {
      alert("Please enter a phone number");
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Image */}
      <div className={styles.headerImage}>
        <Image
          src="/Rectangle_logog.png"
          alt="Header Image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logo}>
          <p>LOGO</p>
        </div>

        {/* Sign-up title */}
        <h2 className={styles.title}>Sign Up to Name</h2>

        {/* Phone Number Input */}
        <div className={styles.inputContainer}>
          <select className={styles.countryCode}>
            <option value="+91">+91</option>
            {/* Add more country codes here */}
          </select>
          <input
            type="text"
            className={styles.phoneNumber}
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Continue Button */}
        <button className={styles.continueButton} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Signin;
