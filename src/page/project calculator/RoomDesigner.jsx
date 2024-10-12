import React, { useEffect, useState } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const RoomDesigner = ({
  totalTiles,
  tileLength,
  tileWidth,
  tileColor,
  roomLength,
  roomWidth,
  containerRef,
  images,
  grid,
  gap,
}) => {
  const [selectedTileImage, setSelectedTileImage] = useState("");

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Add Ambient Light for soft light and Directional Light for shadowing
    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(ambientLight);
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    // directionalLight.position.set(5, 10, 5);
    // scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Disable panning, allowing only rotation
    controls.minPolarAngle = 0; // Restrict vertical rotation
    controls.maxPolarAngle = Math.PI; // Limit vertical rotation to looking downwards
    controls.update();

    // Set the camera inside the room, closer to the front wall
    camera.position.set(roomWidth / 2, 5, roomLength * 0.5); // Start the camera inside the room
    controls.target.set(roomWidth / 2, 0, roomLength / 2); 

    // Create realistic walls with textures
    const wallHeight = 5; // You can adjust height to room size
    const textureLoader = new THREE.TextureLoader();
    const wallTexture = textureLoader.load(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfPEdgUg9aED8EAwinXZDvdzaxnH0MAehtREu8nqGwFPI9sIoEfQ9KiIPPwe30o_4gXG8&usqp=CAU"
    );
    const wallMaterial = new THREE.MeshBasicMaterial({ map: wallTexture });

    // Create the walls with textures
    const createWall = (width, height, depth, x, y, z) => {
      const wallGeometry = new THREE.BoxGeometry(width, height, depth);
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(x, y, z);
      scene.add(wall);
    };

    createWall(
      roomWidth,
      wallHeight,
      0.1,
      roomWidth / 2,
      wallHeight / 2,
      roomLength
    ); // Back wall
    createWall(0.1, wallHeight, roomLength, 0, wallHeight / 2, roomLength / 2); // Left wall
    createWall(
      0.1,
      wallHeight,
      roomLength,
      roomWidth,
      wallHeight / 2,
      roomLength / 2
    ); // Right wall
    createWall(roomWidth, wallHeight, 0.1, roomWidth / 2, wallHeight / 2, 0); // Front wall

    const roofGeometry = new THREE.PlaneGeometry(roomWidth, roomLength);
    const roofMaterial = new THREE.MeshBasicMaterial({ map: wallTexture }); // You can use a texture as well
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.x = Math.PI / 2; // Rotate to make it horizontal
    roof.position.set(roomWidth / 2, wallHeight, roomLength / 2); // Position at the top of the walls
    scene.add(roof);

    // Create floor with tile texture
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomLength);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(roomWidth / 2, 0, roomLength / 2);
    scene.add(floor);

    const renderTiles = () => {
      textureLoader.load(
        selectedTileImage,
        (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture });

          for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.cols; col++) {
              const geometry = new THREE.BoxGeometry(
                tileWidth - gap,
                0.1,
                tileLength - gap
              );
              const tile = new THREE.Mesh(geometry, material);
              tile.position.set(
                col * tileWidth + tileWidth / 2,
                0.05,
                row * tileLength + tileLength / 2
              );
              scene.add(tile);
            }
          }
        },
        undefined,
        (error) => {
          console.error("An error occurred loading the texture:", error);
        }
      );
    };

    if (selectedTileImage) {
      console.log("fdsfs");
      renderTiles();
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    if (selectedTileImage) {
      animate();
    }

    return () => {
      // Clean up: Remove renderer from containerRef
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [
    grid,
    tileWidth,
    tileLength,
    roomLength,
    roomWidth,
    selectedTileImage,
    gap,
    containerRef,
  ]);

  console.log(selectedTileImage);

  return (
    <div className="room_container">
      {images.map((item, index) => (
        <div
          key={index}
          className="image_section_visulize"
          onClick={() => setSelectedTileImage(item)}
        >
          <img src={item} alt="" />
        </div>
      ))}
    </div>
  );
};

export default RoomDesigner;
