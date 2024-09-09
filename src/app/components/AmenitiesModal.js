import styles from "./Modal.module.css"; // Example import

export default function AmenitiesModal({
  isModalOpen,
  toggleModal,
  type,
  modalData,
}) {
  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <img src="../Vector.png" width={13} onClick={toggleModal} />
          <h2 className={styles.modalTitle}>{type}</h2>
        </div>
        <div className={styles.amenitiesList}>
          {type === "amenities" &&
            modalData.map((item, index) => {
              return (
                <div className={styles.amenity} key={index}>
                  {item}
                </div>
              );
            })}

          {(type === "activities" || type === "rules") && <p>{modalData}</p>}
        </div>
      </div>
    </div>
  );
}
