import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import idl from '../idl/pont_network.json'; // Adjust the path to your IDL file
import { PublicKey, Keypair } from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

const SolanaContext = createContext();

export const SolanaProvider = ({ children }) => {
  const { connection } = useConnection();
  // const wallet = useAnchorWallet();
  let wallet;

  // console.log("Wallet: ", wallet);

  const [program, setProgram] = useState(null);
  const [shipAccounts, setShipAccounts] = useState([]);
  const [selfPublicAddress, setSelfPublicAddress] = useState(null);
  const [activeShip, setActiveShip] = useState(null);
  const [activeShipAccount, setActiveShipAccount] = useState(null);
  const [selfKeypair, setSelfKeypair] = useState(null);
  

  // useEffect(() => {
  //   if (wallet && connection) {
  //     const provider = new AnchorProvider(connection, wallet);
  //     setProvider(provider);

  //     const program = new Program(idl, provider);
  //     console.log("Program initialized:", program);
  //     setProgram(program);
  //     setSelfPublicAddress(wallet.publicKey.toString());
  //   }
  // }, [wallet, connection]);

  useEffect(() => {
    const privateKey = JSON.parse(process.env.REACT_APP_PRIVATE_KEY).slice(0, 32);
    console.log("Private key: ", privateKey);

    const selfKeypair = Keypair.fromSeed(Uint8Array.from(privateKey));
    console.log("Private key selfKeypair: ", selfKeypair);
    setSelfKeypair(selfKeypair);

    const wallet = new NodeWallet(selfKeypair);
    console.log("Wallet: ", wallet);
    const provider = new AnchorProvider(connection, wallet);
    setProvider(provider);

    console.log("Provider: ", provider);

    const program = new Program(idl, provider);
    console.log("Program initialized with private key:", program);
    setProgram(program);
    // setSelfPublicAddress(selfKeypair.publicKey.toString());
  }, [connection, wallet]);

  const fetchAllShipAccounts = async () => {
    if (!program) throw new Error("Program is not initialized. Connect Wallet first.");
    const shipAccounts = await program.account.shipAccount.all();

    setShipAccounts(shipAccounts.map(account => account.account));

    for (const shipAccount of shipAccounts) {
      console.log("Ship account: ", shipAccount);

      for (const dataAccount of shipAccount.account.dataAccounts) {
        console.log("Data account: ", dataAccount);

        const [externalObserversAccount, bump] = PublicKey.findProgramAddressSync(
          [Buffer.from("external_observers_account"), new PublicKey(dataAccount).toBuffer()],
          program.programId
        );
        console.log("External observers account: ", await program.account.externalObserversAccount.fetch(externalObserversAccount));
      }
    }
  };

  const fetchShipAccount = async (shipAccountAddress) => {
    if (!program) throw new Error("Program is not initialized. Connect Wallet first.");
    return await program.account.shipAccount.fetch(shipAccountAddress);
  };

  const deriveDataAccount = (shipAccountAddress, shipAccount) => {
    if (!program) throw new Error("Program is not initialized. Connect Wallet first.");
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("data_account"),
        shipAccountAddress.toBuffer(),
        new anchor.BN(shipAccount.dataAccounts.length - 1, "le").toArrayLike(Buffer, "le", 8)
      ],
      program.programId
    );
  };

  return (
    <SolanaContext.Provider value={{ program, shipAccounts, fetchAllShipAccounts, publicAddress: selfPublicAddress, selfKeypair }}>
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => {
  return useContext(SolanaContext);
};