import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { decrypt } from './TrackData'; // Import the decrypt function
import { Buffer } from 'buffer';
import './DataDetails.css'; // Import the CSS file

const DataDetails = () => {
    const { index } = useParams();
    const location = useLocation();
    const { item } = location.state; // Get data from state

    const [decryptedData, setDecryptedData] = useState(null);
    const [isTampered, setIsTampered] = useState(false);

    useEffect(() => {
        try {
            const { ciphertext, tag, iv } = item;
            const key = new Uint8Array(32).fill(5);
            // const key = new Uint8Array(keyUint32.buffer);
            console.log("keyBytes len:", key);

            let decrypted = decrypt(ciphertext, tag, iv, key);
            decrypted = JSON.parse(decrypted);
            setDecryptedData(decrypted);
        } catch (error) {
            console.error("Decryption failed:", error);
            setIsTampered(true);
        }
    }, [item]);

    return (
        <div className="data-table-container">
            <h2 className="data-details-heading">Data Details for Row {index}</h2>
            {isTampered ? (
                <p className="tampered-message">⚠️Data tampered!⚠️</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {decryptedData && Object.entries(decryptedData).map(([key, value], idx) => (
                            <tr key={idx}>
                                <td>{key}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DataDetails;