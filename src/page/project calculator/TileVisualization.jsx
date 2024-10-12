import React from "react";
import { Canvas } from "@react-three/fiber";
import { Image } from "@react-three/drei";

const TileVisualization = ({ tileLength, tileWidth, totalTiles, selectedImages }) => {
  console.log("selectedImages",selectedImages)
  // Fallback for tile dimensions if they are missing
  const validatedTileLength = parseFloat(tileLength) || 1; // Default to 1 if undefined
  const validatedTileWidth = parseFloat(tileWidth) || 1; // Default to 1 if undefined

  if (!totalTiles || !selectedImages || selectedImages.length === 0) {
    return <p>Please provide all the necessary inputs.</p>;
  }

  // Calculate rows and columns based on the number of tiles
  const roomArea = Math.ceil(Math.sqrt(totalTiles));
  const cols = Math.floor(roomArea);
  const rows = Math.ceil(totalTiles / cols);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {Array.from({ length: totalTiles }).map((_, index) => {
        const x = (index % cols) * (validatedTileWidth + 0.1);
        const y = Math.floor(index / cols) * (validatedTileLength + 0.1);

        // Select the appropriate image for the tile, cycling through the selected images
        const imageIndex = index % selectedImages.length;

        return (
          <Image
            key={index}
            position={[x, 0, y]}
            url={selectedImages[imageIndex] || "https://via.placeholder.com/300"} // Fallback image
            args={[validatedTileWidth, validatedTileLength]} // Validated tile dimensions
            rotation={[0, Math.PI / 2, 0]} // Rotate if needed
          />
        );
      })}
    </Canvas>
  );
};

export default TileVisualization;
