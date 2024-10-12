import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./tilesCalulator.css";
import RoomDesigner from "./RoomDesigner";

const TileCalculator = () => {
  const [roomLength, setRoomLength] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  const [roomHeightUnit, setRoomHeightUnit] = useState("meter");
  const [roomLenthUnit, setRoomLengthUnit] = useState("meter");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomWidthUnit, setRoomWidthUnit] = useState("meter");
  const [tileLength, setTileLength] = useState("");
  const [tileWidth, setTileWidth] = useState("");
  const [boxSize, setBoxSize] = useState("");
  const [gap, setGap] = useState("");
  const [Visualize, setVisualize] = useState(false);
  const containerRef = useRef(null);

  const [grid, setGrid] = useState({
    rows: 0,
    cols: 0,
    totalTiles: 0,
    roomArea: 0,
    totalBox: 0,
  });

  const getConvertMetter = (roomLenthUnit,room) => {
   
    if ("meter" == roomLenthUnit) {
      return room;
    }
    if ("cm" == roomLenthUnit) {
      return parseFloat(room) * 0.01;
    }
    if ("foot" == roomLenthUnit) {
      return parseFloat(room) * 0.3048;
    }
    if ("inch" == roomLenthUnit) {
      return parseFloat(room) * 0.0254;
    }
  };

  const roomlenth = getConvertMetter(roomLenthUnit,roomLength);

  
  const roomwidth = getConvertMetter(roomWidthUnit,roomWidth);
  const roomheight = getConvertMetter(roomHeightUnit,roomHeight);


  const calculateTiles = async () => {
   
    
    try {
      const response = await axios.post(
        "http://localhost:5000/calculate-tiles",
        {
          roomLength: parseFloat(roomlenth),
          roomWidth: parseFloat(roomwidth),
          tileLength: parseFloat(tileLength),
          tileWidth: parseFloat(tileWidth),
          groutWidth: parseFloat(gap),
          boxSize: boxSize,
        }
      );
      setGrid(response.data);
    } catch (error) {
      console.error("Error calculating tiles", error);
    }
  };

  const getotal = (percentage) => {
    const total = Math.ceil(grid.totalTiles * (percentage / 100));
    return Math.round(total + grid.totalTiles);
  };

  const getBox = (percentage) => {
    const total = Math.ceil(grid.totalBox * (percentage / 100));
    return Math.round(total + grid.totalBox);
  };

  const handleVisualize = () => {
    setVisualize(true);
  };

  const images = [
    "https://anttile.com/wp-content/uploads/2017/01/TR2-SD-MB-W_1.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQteVVhvxcGniUt-JD4o9SpUhUBTPOOXQz9MvZPdC26idzYBZqMQQ1tCArovMuTsDBUPOM&usqp=CAU",
    "https://tileswale.com/cdn-cgi/imagedelivery/mzSuEo-CuZj22GZ2Ldj31w/74815f92-d647-4114-25e0-d4e9b8373e00/public",
    "https://miznertilestudio.com/wp-content/uploads/2019/06/HP538w.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUEwguwiEcRBtHOnIdROgbaegSTHK0ln45EEQKFCTmCt50RBukmo52e69sJWcnjl0PB9c&usqp=CAU",
    "https://m.media-amazon.com/images/I/81SAvEC8O7L._AC_UF894,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/51WES4C3bqL._AC_UF894,1000_QL80_.jpg",
  ];

  return (
    <div className="tiles_container" ref={containerRef}>
      {!Visualize ? (
        <div>
          {grid.rows > 0 && grid.cols > 0 && (
            <div className="calculation_result">
              <h2>Result</h2>
              <h3>Total Tiles Needed: {grid.totalTiles} Pieces</h3>
              <h3>Boxes Needed: {grid.totalBox} Boxes</h3>
              <h3>Total Area: {grid.roomArea} meter2</h3>
              <p>
                Purchase 5% - 10% more ({getotal(5)} - {getotal(10)} tiles or{" "}
                {getBox(5)} - {getBox(10)} boxes) for cutting, waste, and
                possible future repairs.
              </p>
            </div>
          )}
          <div className="tiles_calulator_section">
            <h2 className="header_tiles_calculator">Tile Calculator</h2>
            <div className="tiles_calulator_input">
              <label htmlFor="room_length">Room Lenth</label>
              <input
                type="number"
                placeholder="Room Length (m)"
                value={roomLength}
                onChange={(e) => setRoomLength(e.target.value)}
              />
              <select
                name="totalwidthunit"
                onChange={(e) => setRoomLengthUnit(e.target.value)}
              >
                <option value="meter">meters</option>
                <option value="foot">feet</option>
                <option value="inch">inches</option>
                <option value="cm">cm</option>
                <option value="yard">yards</option>
              </select>
            </div>
            <div className="tiles_calulator_input">
              <label htmlFor="room_length">Room Width</label>
              <input
                type="number"
                placeholder="Room Width (m)"
                value={roomWidth}
                onChange={(e) => setRoomWidth(e.target.value)}
              />
              <select
                name="totalwidthunit"
                onChange={(e) => setRoomWidthUnit(e.target.value)}
              >
                <option value="meter">meters</option>
                <option value="foot">feet</option>
                <option value="inch">inches</option>
                <option value="cm">cm</option>
                <option value="yard">yards</option>
              </select>
            </div>
            <div className="tiles_calulator_input">
              <label htmlFor="room_length">Room Hight</label>
              <input
                type="number"
                placeholder="Room Length (m)"
                value={roomHeight}
                onChange={(e) => setRoomHeight(e.target.value)}
              />
              <select
                name="totalwidthunit"
                onChange={(e) => setRoomHeightUnit(e.target.value)}
              >
                <option value="meter">meters</option>
                <option value="foot">feet</option>
                <option value="inch">inches</option>
                <option value="cm">cm</option>
                <option value="yard">yards</option>
              </select>
            </div>
            <div className="tiles_calulator_input">
              <label htmlFor="">Tiles Length</label>
              <input
                type="number"
                placeholder="Tile Length (m)"
                value={tileLength}
                onChange={(e) => setTileLength(e.target.value)}
              />
              <select name="totalwidthunit">
                <option value="foot">feet</option>
                <option value="meter" selected="">
                  meters
                </option>
                <option value="inch">inches</option>
                <option value="cm">cm</option>
                <option value="yard">yards</option>
              </select>
            </div>
            <div className="tiles_calulator_input">
              <label htmlFor="">Tiles Width</label>
              <input
                type="number"
                placeholder="Tile Width (m)"
                value={tileWidth}
                onChange={(e) => setTileWidth(e.target.value)}
              />
              <select name="totalwidthunit">
                <option value="foot">feet</option>
                <option value="meter" selected="">
                  meters
                </option>
                <option value="inch">inches</option>
                <option value="cm">cm</option>
                <option value="yard">yards</option>
              </select>
            </div>
            <div className="tiles_calulator_input">
              <label htmlFor="">Gap</label>
              <input
                type="number"
                placeholder="tile grout spacing (m)"
                value={gap}
                onChange={(e) => setGap(e.target.value)}
              />
              <select name="totalwidthunit">
                <option value="foot">feet</option>
                <option value="meter" selected="">
                  meters
                </option>
                <option value="inch">inches</option>
                <option value="cm">cm</option>
                <option value="yard">yards</option>
              </select>
            </div>
            <div className="tiles_calulator_input_box_size">
              <label htmlFor="">Box Size</label>
              <input
                type="number"
                placeholder="tiles per box"
                value={boxSize}
                onChange={(e) => setBoxSize(e.target.value)}
              />
            </div>
            <div className="calulator_button_section">
              <button className="calculate_button" onClick={calculateTiles}>
                Calculate
              </button>
              <button className="calculate_button" onClick={handleVisualize}>
                Visualize
              </button>
            </div>
          </div>
        </div>
      ) : (
        <RoomDesigner
          images={images}
          wallImages={images}
          roomWidth={roomwidth}
          tileLength={tileLength}
          tileWidth={tileWidth}
          gap={gap}
          grid={grid}
          roomLength={roomlenth}
          containerRef={containerRef}
          wallHeight={roomheight}
        />
      )}
      {/* <label>
        Choose Tile Image URL:
        <input
          type="text"
          placeholder="Enter Tile Image URL"
          value={selectedTileImage}
          onChange={(e) => setSelectedTileImage(e.target.value)}
        />
      </label> */}
    </div>
  );
};

export default TileCalculator;
