import React, { useEffect, useState } from 'react';
import * as anchor from "@coral-xyz/anchor";
import './TrackData.css'; // Ensure the CSS file is imported
import { PublicKey, Connection } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, BorshCoder } from '@coral-xyz/anchor';
import pont_network from './pont_network.json'; // Adjust the path to your IDL file
import {Buffer} from 'buffer';

export class MyWallet {

  constructor(payer) {
      this.payer = payer
  }

  async signTransaction(tx) {
      tx.partialSign(this.payer);
      return tx;
  }

  async signAllTransactions(txs) {
      return txs.map((t) => {
          t.partialSign(this.payer);
          return t;
      });
  }

  get publicKey() {
      return this.payer.publicKey;
  }
}

const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

const eo1 = anchor.web3.Keypair.fromSeed(new Uint8Array(32).fill(3));

const wallet = new MyWallet(eo1);
const coder = new BorshCoder(pont_network);

const provider = new AnchorProvider(connection, wallet)
// const programId = new PublicKey('6gdTocGpug1w7cgV1MQXyJDDGPtw7JHM5aNjKB8wY8V6'); // Replace with your program ID
const program = new Program(pont_network, provider);

const TrackData = () => {
  const [data, setData] = useState([]);
  const [blockchainFingerprints, setBlockchainFingerprints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        const result = await response.json();
        setData(result);

        // Fetch fingerprints from Solana blockchain
        const dataAccountAddress = new PublicKey('4vg8N6yWr57zraEM5Y2JNFTWnpNjmMW1jBMewPi2TSAm'); // Replace with your data account public key
        const fingerprints = await getFingerprints(dataAccountAddress);
        setBlockchainFingerprints(fingerprints);
        console.log('Fingerprints:', fingerprints);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000); // Refetch data every 2 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const getFingerprints = async (dataAccountAddress) => {
    // Fetch the data account
    const dataAccount = await program.account.dataAccount.fetch(dataAccountAddress);

    // Access the fingerprints array
    const fingerprints = dataAccount.fingerprints;

    console.log('Fingerprints2:', fingerprints);

    // Convert fingerprints to hex strings
    const fingerprintHexArray = fingerprints.map((fingerprint) => Buffer.from(fingerprint[0]).toString('hex'));

    return fingerprintHexArray;
  };

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
      <div>
        <h3>Blockchain Fingerprints:</h3>
        <ul>
          {blockchainFingerprints.map((fingerprint, index) => (
            <li key={index}>{fingerprint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrackData;