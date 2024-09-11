"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./page.module.css";
import SearchModal from "./components/SearchModal";

export default function Home() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(true);
  const [videoSrc, setVideoSrc] = useState(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const videoRefs = useRef([]);
  const secondReelRef = useRef(null); // Ref for the second reel-card
  const [videos, setVideos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [cityName, setCityName] = useState("");

  const loadGoogleMaps = (callback) => {
    const existingScript = document.getElementById("googleMaps");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
      script.id = "googleMaps";
      document.body.appendChild(script);
      script.onload = () => {
        if (typeof google !== "undefined") {
          callback();
        } else {
          console.error("Google Maps API not loaded.");
        }
      };
    } else if (typeof google !== "undefined") {
      callback();
    } else {
      existingScript.onload = () => {
        if (typeof google !== "undefined") {
          callback();
        } else {
          console.error("Google Maps API not loaded.");
        }
      };
    }
  };

  const initMap = (lat, lng) => {
    const location = { lat, lng };
    const map = new google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 15,
    });

    new google.maps.Marker({
      position: location,
      map: map,
    });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        // Initialize the Google Map with current location
        loadGoogleMaps(() => initMap(lat, lng));

        // Fetch location name and city using Google Maps Geocoding API
        fetchLocationName(lat, lng);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchLocationName = (lat, lng) => {
    const geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    fetch(geocodeApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const locationName = data.results[0].formatted_address;
          let city = "";

          data.results[0].address_components.forEach((component) => {
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
          });

          setLocationName(locationName);
          setCityName(city);
        } else {
          console.error(
            "Geocode was not successful for the following reason: " +
              data.status
          );
        }
      })
      .catch((err) => console.error("Error fetching geocode data: ", err));
  };

  useEffect(() => {
    getLocation();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/property`)
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  const handleUnmute = () => {
    setIsMuted(false);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = false;
    });
  };

  const handleMute = () => {
    setIsMuted(true);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = true;
    });
  };

  const closeWelcomeModal = () => {
    setIsMuted(false);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = false;
    });
    setIsWelcomeModalOpen(false);

    // Scroll to the second reel-card
    if (secondReelRef.current) {
      secondReelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const topElements = document.querySelectorAll(".top"); // Select all elements with class 'top'

      // Loop through all elements and apply the same logic
      topElements.forEach((topElement) => {
        if (window.scrollY > 50) {
          topElement.style.top = "0vh"; // Scrolls down
        } else {
          topElement.style.top = "7vh"; // Near the top
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.8,
    });

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          observer.unobserve(video);
        }
      });
    };
  }, [videos]);

  useEffect(() => {
    if (videos.length > 0) {
      loadVideoChunk(0, 0, 500000); // Load first chunk of the first video
    }
  }, [videos]);

  const loadVideoChunk = async (videoIndex, start, end) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/uploads/videos/${videos[videoIndex].videoFiles[0]}`,
      {
        headers: {
          Range: `bytes=${start}-${end}`,
        },
      }
    );

    const blob = await response.blob();
    const chunkUrl = URL.createObjectURL(blob);
    setVideoSrc(chunkUrl);
  };

  const handleVideoEnded = (videoIndex) => {
    const nextStart = 500001;
    const nextEnd = nextStart + 500000;
    loadVideoChunk(videoIndex, nextStart, nextEnd);
  };
  const handleShare = async (contactName, location, id) => {
    const shareUrl = `${window.location.origin}/details/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: contactName,
          text: location,
          url: shareUrl,
        });
        setIsShared(true); // Update the state if sharing was successful
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported in your browser.");
    }
  };

  const handleShareWhatsapp = (contactName, location, id) => {
    const shareUrl = `${window.location.origin}/details/${id}`;
    const message = `${contactName}: ${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1); // Convert degrees to radians
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance);
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <>
      <div className="app">
        {isWelcomeModalOpen && (
          <div className="welcome-modal">
            <div className="welcome-content">
              <h2>Welcome to Our Property</h2>
              <button onClick={closeWelcomeModal}>Enter</button>
            </div>
          </div>
        )}
        {isModalOpen && <SearchModal onClose={closeModal} />}
        <header>
          <nav className="navbar">
            <div className="container">
              <div className="location-info">
                <img src="/carbon_location.png" width={22} height={22} />
                <h4>{locationName}</h4>
                <i className="fa fa-angle-down" aria-hidden="true"></i>
                <p>{cityName}</p>
              </div>
              <div className="nav-links">
                <ul className="nav-group">
                  <li className="nav-item">
                    <a href="#">
                      <img src={"/bx_bookmark-w.png"} height={30} width={30} />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="#">
                      <img
                        onClick={openModal}
                        src={"/iconamoon_search.png"}
                        height={31}
                        width={31}
                      />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="">
                      <img
                        src={"/solar_point-on-map-bold.png"}
                        height={30}
                        width={31}
                      />
                    </a>
                  </li>
                  <li className="nav-item">
                    <a href="">
                      <i className="far fa-heart"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>

        <main>
          <div className="container">
            <div className="col-9">
              {videos?.map((item, index) => {
                // Ensure that the destination lat/lon (lat2, lon2) is defined
                const lat2 = item?.lat;
                const lon2 = item?.long;

                const distance = getDistanceFromLatLonInKm(
                  latitude,
                  longitude,
                  lat2,
                  lon2
                );

                return (
                  <div className="card reel-card" key={index}>
                    <div
                      className="top"
                      onClick={() => router.push(`/details/${item?._id}`)}
                    >
                      <div className="userDetails">
                        <div className="profilepic">
                          <div className="profile_img">
                            <div className="image">
                              <img
                                src="https://media.geeksforgeeks.org/wp-content/uploads/20220609093241/g3-200x200.png"
                                alt="img9"
                              />
                            </div>
                          </div>
                        </div>
                        <h3>
                          {item?.contactName}
                          <br />
                          <span>{item?.location}</span>
                        </h3>
                        <div className="builder-location-text">
                          <img
                            src={"/solar_point-on-map-bold.png"}
                            height={30}
                            width={31}
                          />
                          <span className="distance-info">
                            {distance}Km away
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="dot">
                          <i className="fas fa-ellipsis-h"></i>
                        </span>
                      </div>
                    </div>
                    <div className="imgBx">
                      <div className="video-container">
                        <video
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/videos/${item.videoFiles[0]}`}
                          autoPlay
                          loop
                          playsInline
                          className="video-player"
                          controls={false}
                          muted={isMuted}
                          ref={(el) => (videoRefs.current[index] = el)}
                          onEnded={() => handleVideoEnded(index)}
                        ></video>
                        {isMuted && (
                          <div className="unmute-button" onClick={handleUnmute}>
                            <img
                              src="/1234.png"
                              alt="test"
                              width={25}
                              height={20}
                            />
                          </div>
                        )}
                        {!isMuted && (
                          <div className="unmute-button" onClick={handleMute}>
                            <img
                              src="/Speaker_Icon.svg.png"
                              alt="test"
                              width={25}
                              height={20}
                            />
                          </div>
                        )}
                      </div>

                      <div className="bottom">
                        <div className="actionBtns">
                          <img
                            src={"/bx_bookmark.png"}
                            height={30}
                            width={30}
                          />
                          {/* <a
                          href="https://wa.me/?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                        > */}
                          <a
                            href="#"
                            onClick={() =>
                              handleShareWhatsapp(
                                item?.contactName,
                                item?.location,
                                item?._id
                              )
                            }
                          >
                            <img src={"/whatsapp.png"} height={28} width={28} />
                          </a>
                          <a href="tel:+1234567890" className="btn">
                            <img
                              src={"/basil_phone-outline-b.png"}
                              height={34}
                              width={34}
                            />
                          </a>
                          <img
                            src={"/bitcoin-icons_share-outline.png"}
                            height={33}
                            width={33}
                            onClick={() =>
                              handleShare(
                                item?.contactName,
                                item?.location,
                                item?._id
                              )
                            }
                          />
                        </div>
                        <div>
                          <button className="reviews-button">Reviews</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
