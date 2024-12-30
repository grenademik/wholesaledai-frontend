import React, { useState } from "react";

const CustomGallery = ({ images, height = 300, width = 300, initialIndex }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [startIndex, setStartIndex] = useState(initialIndex);
    const thumbnailsToShow = 4;

    const handleNext = () => {
        if (startIndex + thumbnailsToShow < images.length) {
            setStartIndex(startIndex + 1);
        }
    };

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    return (
        <div style={{ width, height, position: "relative" }}>
            <div style={{ width: "100%", height: "100%" }}>
                <img
                    src={selectedImage}
                    alt="Selected"
                    className="rounded-lg"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                    position: "relative",
                }}
            >
                <button
                    onClick={handlePrev}
                    disabled={startIndex === 0}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: startIndex > 0 ? "pointer" : "not-allowed",
                    }}
                >
                    &#x25C0;
                </button>

                {/* Thumbnail container */}
                <div
                    style={{
                        display: "flex",
                        overflow: "hidden",
                        width: `${thumbnailsToShow * 60}px`,
                        gap: "10px",
                    }}
                >
                    {images
                        .slice(startIndex, startIndex + thumbnailsToShow)
                        .map((image, index) => (
                            <img
                                key={index + startIndex}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setSelectedImage(image)}
                                style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border:
                                        selectedImage === image
                                            ? "2px solid #000"
                                            : "1px solid #ccc",
                                    borderRadius: "5px",
                                }}
                            />
                        ))}
                </div>

                {/* Chevron for scrolling right */}
                <button
                    onClick={handleNext}
                    disabled={startIndex + thumbnailsToShow >= images.length}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor:
                            startIndex + thumbnailsToShow < images.length
                                ? "pointer"
                                : "not-allowed",
                    }}
                >
                    &#x25B6;
                </button>
            </div>
        </div>
    );
};

export default CustomGallery;
