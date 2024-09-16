import React, { useEffect } from 'react';
import { useSolana } from './contexts/SolanaContext';
import './ShipAccounts.css'; // Import the CSS file for styling

const ShipAccounts = () => {
    const { shipAccounts, fetchAllShipAccounts } = useSolana();

    useEffect(() => {
        fetchAllShipAccounts();
    }, []);

    return (
        <div>
            <h1>Ship Accounts</h1>
            {shipAccounts.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Ship</th>
                            <th>Ship Management</th>
                            <th>Data Accounts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shipAccounts.map((account, index) => (
                            <tr key={index}>
                                <td>{account.ship.toString()}</td>
                                <td>{account.shipManagement.toString()}</td>
                                <td>
                                    <ul>
                                        {account.dataAccounts.map((dataAccount, idx) => (
                                            <li key={idx}>{dataAccount.toString()}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ShipAccounts;