import React, { useEffect, useState } from 'react';
import './TrackData.css'; // Ensure the CSS file is imported

const TrackData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000); // Refetch data every 2 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const truncate = (str) => {
    if (str.length <= 16) return str;
    return `${str.slice(0, 8)}...${str.slice(-8)}`;
  };

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Fingerprint</th>
            <th>Ciphertext</th>
            <th>Tag</th>
            <th>IV</th>
            <th>Timestamp (Unix)</th>
            <th>Timestamp (Date)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{truncate(item.fingerprint)}</td>
              <td>{truncate(item.ciphertext)}</td>
              <td>{truncate(item.tag)}</td>
              <td>{truncate(item.iv)}</td>
              <td>{item.ciphertext_timestamp_unix}</td>
              <td>{new Date(item.ciphertext_timestamp_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackData;