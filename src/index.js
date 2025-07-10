import React from 'react';
import ReactDOM from 'react-dom';
import Mint from './components/Mint.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';
import {useState, useEffect} from 'react';
import {  CML} from "@lucid-evolution/lucid";
import './index.css';
import logo from './static/pactmint_logo.png';


const Separator = (
  <h5 
    className="d-inline-block justify-content-lg-center" 
    style={{ 
      backgroundColor: '#e2d6b5', 
      width: '285px', 
      marginLeft: '0px', 
      borderRadius: '30px', 
      padding: '5px', 
      marginTop: '20px', 
      color: '#ffffff', 
      fontSize: '18px' 
    }}>
    Mint
  </h5>
);

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [cip, setCip] = useState(null);
  
  useEffect(() => {
    async function connectWallet() {
      console.log("connectWallet called with wallet:", wallet);
      let api = null;
      if (wallet) {
        // Check if wallet API is available
        if (!window.cardano || !window.cardano[wallet] || (await window.cardano[wallet].supportedExtensions.length) == 0) {
          console.log("Wallet API not available yet, retrying in 1 second...");
          setTimeout(() => connectWallet(), 3000);
          return;
        }
        
        console.log("wallet", window.cardano[wallet].supportedExtensions);
        try {
          if(window.cardano[wallet].supportedExtensions.includes(106)){
            api = await window.cardano[wallet].enable([106]);
            setCip(106);
          }
          else if(window.cardano[wallet].supportedExtensions.includes(141)){
            api = await window.cardano[wallet].enable([141]);
            setCip(141);
          }
          else{
            console.log("not supported")
            setWallet(null);
            setAddress(null);
            setCip(null);
            return;
          }
          const address = CML.Address.from_hex((await api.getUnusedAddresses()).at(0)).to_bech32()

          console.log(address)
          setAddress(address);
          console.log('Wallet connected');
          localStorage.setItem("wallet", JSON.stringify( wallet));

        } catch (e) {
          console.log("Error connecting wallet:", e);
        }
      }else{
        console.log("No wallet, clearing state");
        setWallet(null);
        setAddress(null);
        setCip(null);
      }
    }
    connectWallet();
  }, [wallet]);

  useEffect(() => {
    if (!address || !wallet  || !cip) return;
    
    const interval = setInterval(async () => {
      console.log("address", address);
      const api = await window.cardano[wallet].enable([cip]);
      const address2 = CML.Address.from_hex((await api.getUnusedAddresses()).at(0)).to_bech32()
      if(address2 !== address){
        console.log("address changed", address2);
        setAddress(address2);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [address, wallet, cip]);


  useEffect(() => {
    const wallet = JSON.parse(localStorage.getItem("wallet"));
    console.log("Loading wallet from localStorage:", wallet);
    if(wallet){
        console.log("Setting wallet from localStorage:", wallet);
        setWallet(wallet);
    }
  },[])


  return (
    <div className='app darkMode'>
      <img src={logo} alt="PactMint Logo" style={{ width: '250px', margin: '30px auto 10px', display: 'block' }} />
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#ffffff', margin: '0px' }}>
        Pact-Mint enables organizations to mint native tokens on Cardano in a secure and decentralized way. For more info visit our
        <a href="https://github.com/LnLLabs/Pact-mint" target="_blank" rel="noopener noreferrer" style={{ color: '#fff176', margin: '0 5px' }}>GitHub</a>
        or
        <a href="https://discord.com/channels/1118131999308251267/1392892184801575023" target="_blank" rel="noopener noreferrer" style={{ color: '#fff176', margin: '0 5px' }}>Discord</a>
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '10px 0 20px 0' }}>
        <a href="https://github.com/LnLLabs/Pact-mint" target="_blank" rel="noopener noreferrer" title="GitHub">
          <svg height="32" width="32" viewBox="0 0 16 16" fill="#fff" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
            -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
            -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82
            .64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
            2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
            1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
        <a href="https://discord.com/channels/1118131999308251267/1392892184801575023" target="_blank" rel="noopener noreferrer" title="Discord">
          <svg height="32" width="32" viewBox="0 0 71 55" fill="#fff" aria-hidden="true">
            <path d="M60.104 4.552A58.36 58.36 0 0 0 46.852.8a.117.117 0 0 0-.124.06c-2.048
            3.614-4.096 8.27-5.624 12.06-6.748-1.012-13.36-1.012-20.032 0-1.528-3.79-3.58-8.446-5.624
            -12.06A.115.115 0 0 0 15.14.8a58.38 58.38 0 0 0-13.26 3.752.105.105 0 0 0-.058.04C.21
            18.08-.32 31.36.1 44.58a.112.112 0 0 0 .042.082c5.6 4.1 11.1 6.6 16.6 8.24a.116.116 0
            0 0 .127-.042c1.28-1.76 2.42-3.6 3.4-5.56a.112.112 0 0 0-.06-.154c-1.8-.68-3.5-1.5-5.14
            -2.48a.112.112 0 0 1-.012-.186c.346-.26.692-.53 1.022-.8a.112.112 0 0 1 .114-.01c10.8
            4.94 22.5 4.94 33.26 0a.112.112 0 0 1 .116.01c.33.27.676.54 1.022.8a.112.112 0 0 1-.01
            .186c-1.64.98-3.34 1.8-5.14 2.48a.112.112 0 0 0-.06.154c.98 1.96 2.12 3.8 3.4 5.56a.115
            .115 0 0 0 .127.042c5.5-1.64 11-4.14 16.6-8.24a.112.112 0 0 0 .042-.082c.5-13.22-.04
            -26.5-6.84-40.01a.09.09 0 0 0-.058-.04zM23.725 37.32c-3.18 0-5.78-2.92-5.78-6.5s2.58
            -6.5 5.78-6.5c3.22 0 5.8 2.94 5.78 6.5 0 3.58-2.58 6.5-5.78 6.5zm23.55 0c-3.18 0-5.78
            -2.92-5.78-6.5s2.58-6.5 5.78-6.5c3.22 0 5.8 2.94 5.78 6.5 0 3.58-2.58 6.5-5.78 6.5z"/>
          </svg>
        </a>
      </div>
      <ConnectWallet wallet={wallet} setWallet={setWallet}/>
      <Mint wallet={wallet} address={address} cip={cip}/>
      <div style={{ textAlign: 'center', color: '#bbb', fontSize: '14px', marginTop: '30px' }}>
        <strong>Disclaimer:</strong> This software is provided “AS IS”, without warranty of any kind. See the
        <a href="https://github.com/LnLLabs/Pact-mint/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" style={{ color: '#fff176' }}> Mozilla Public License 2.0 (LICENSE)</a> for details.
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
