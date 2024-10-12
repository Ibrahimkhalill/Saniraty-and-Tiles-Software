import React, { useState } from 'react';
import axios from 'axios';

const SanitaryCalculator = () => {
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  const [products, setProducts] = useState([{ name: 'Toilet', length: 1.2, width: 0.8 }]);
  const [totalProducts, setTotalProducts] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('http://localhost:5000/calculate-sanitary', {
      roomLength,
      roomWidth,
      products,
    });

    setTotalProducts(response.data.totalProducts);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Length (meters):</label>
          <input
            type="number"
            value={roomLength}
            onChange={(e) => setRoomLength(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Room Width (meters):</label>
          <input
            type="number"
            value={roomWidth}
            onChange={(e) => setRoomWidth(e.target.value)}
            required
          />
        </div>

        {/* Additional product form inputs can go here */}

        <button type="submit">Calculate</button>
      </form>

      <h2>Total Products: {totalProducts}</h2>
    </div>
  );
};

export default SanitaryCalculator;
