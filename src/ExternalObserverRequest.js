import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { encode } from 'bs58';
import { blake3 } from 'hash-wasm';
import { x25519 } from '@noble/curves/ed25519';
import './App.css'; // Import the CSS file
import { useSolana } from './contexts/SolanaContext';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

function App() {
  const [shipAddress, setShipAddress] = useState('AKnL4NNf3DGWZJS6cPknBuEGnVsV4A4m5tgebLHaRSZ9');
  const { publicKey, signMessage } = useWallet();
  const [x25519Pk, setX25519Pk] = useState(null);
  const { program, selfPublicAddress, selfKeypair } = useSolana();

  const handleRequestExternalObserver = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first.');
      return;
    }

    
    if (selfKeypair) {
      console.log('selfKeypair public key:', selfKeypair);
    }
    

    const message = 'SIGN THIS MESSAGE TO GET SEED FOR25199 KEYPAIR';
    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signature = await signMessage(encodedMessage);
      const encodedSignature = encode(signature);
      const seed = await blake3(signature);
      console.log('Signature:', encodedSignature);
      console.log('Signature hash:', seed);
      alert('Message signed successfully! Your seed: ' + seed);

      const x25519_sk = x25519.getPublicKey(seed);
      const x25519_pk = x25519.getPublicKey(x25519_sk);
      setX25519Pk(x25519_pk);

      // TODO: mozda ne mora da se pravi PublicKey objekat od shipAddress
      const [shipAccountAddress, bump1] = PublicKey.findProgramAddressSync(
        [Buffer.from("ship_account"), new PublicKey(shipAddress).toBuffer()],
        program.programId
      );

      const shipAccount = await program.account.shipAccount.fetch(shipAccountAddress);

      console.log('Ship account:', shipAccount);

      const [latestDataAccount, bump2] = PublicKey.findProgramAddressSync(
				[Buffer.from("data_account"), new PublicKey(shipAddress).toBuffer(), new anchor.BN(shipAccount.dataAccounts.length - 1, "le").toArrayLike(Buffer, "le", 8)],
				program.programId
			);
	
			const [externalObserversAccount, bump3] = PublicKey.findProgramAddressSync(
				[Buffer.from("external_observers_account"), latestDataAccount.toBuffer()],
				program.programId
			);

      // Call the externalObserverRequest instruction with x25519_pk
      await program.methods
      .externalObserverRequest(new PublicKey(x25519_pk))
      .accounts({
        dataAccount: latestDataAccount,
				externalObserversAccount,
				externalObserver: selfKeypair.publicKey,
				systemProgram: SystemProgram.programId,
      })
      .signers([selfKeypair])
      .rpc();

      alert('Request succesful.');
      
    } catch (error) {
      console.error('Error signing message:', error);
      alert('Failed to sign message.');
    }
  };

  return (
    <div className="App">
      <h1>Request to be External Observer</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter ship address"
          value={shipAddress}
          onChange={(e) => setShipAddress(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="button-container">
        <button onClick={handleRequestExternalObserver} className="wallet-button">
          Request to be External Observer
        </button>
      </div>
      {x25519Pk && (
        <div className="public-key-display">
          Your X25519 Public key is: <span className="public-key">{x25519Pk}</span>
        </div>
      )}
    </div>
  );
}

export default App;