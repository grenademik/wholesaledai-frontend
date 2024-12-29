import React, { useState } from "react";

const CustomGallery = ({ images, height = 300, width = 300 }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div style={{ width, height, position: "relative" }}>
            <div style={{ width: "100%", height: "100%" }}>
                <img
                    src={selectedImage}
                    alt="Selected"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "10px",
                }}
            >
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => setSelectedImage(image)}
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            cursor: "pointer",
                            border: selectedImage === image ? "2px solid #000" : "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CustomGallery;
