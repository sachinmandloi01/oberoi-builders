import React, { useState } from "react";
import styles from "../details/Profile.module.css";
import AmenitiesModal from "../components/AmenitiesModal";

const TabMenu = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("");
  // const [title, setTitle] = useState("");
  const [modalData, setModalData] = useState();
  const toggleModal = (type) => {
    console.log("type", type);
    setType(type);
    if (type === "amenities") {
      setModalData(data?.amenities);
    }
    if (type === "activities") {
      setModalData(data?.activities);
    }
    if (type === "rules") {
      setModalData(data?.rules);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.tabMenu}>
      <button
        className={styles.tabButton}
        onClick={() => toggleModal("amenities")}
      >
        Amenities
      </button>
      <button
        className={styles.tabButton}
        onClick={() => toggleModal("activities")}
      >
        Activities
      </button>
      <button className={styles.tabButton} onClick={() => toggleModal("rules")}>
        Rules
      </button>
      <AmenitiesModal
        isModalOpen={isOpen}
        toggleModal={toggleModal}
        type={type}
        modalData={modalData}
      />
    </div>
  );
};

export default TabMenu;
