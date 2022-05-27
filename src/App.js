import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import { useBalance, useAccount, useContractRead, useContractWrite } from "wagmi";
import { parseEther } from 'ethers/lib/utils'
import { useCallback, useMemo } from 'react'
import { AiAbi } from './config'

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [value, setValue] = React.useState("0");
  const [value2, setValue2] = React.useState("0");
  const [balVal, setBalVal] = React.useState("0");
  const [depVal, setDepVal] = React.useState("0");
  const [aiBal, setAiBal] = React.useState("0");
  const addressOrName = "0x534AE404AFBc08782762B156445Ce2cea51d7E43";
  const contractInterface = AiAbi;
  const decimals = 18;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
          Balance();
          balDeposited();
          AIBalance();
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Deposit = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(addressOrName, contractInterface, signer);
        const amount = ethers.utils.parseUnits(value, decimals);

        let depositTxn = await connectedContract.deposit({value: amount});
        await depositTxn.wait();
        Balance();
        balDeposited();
        AIBalance();
        
      } else {
        console.log("Could not deposit");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const Burn = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(addressOrName, contractInterface, signer);
        const amountBurn = ethers.utils.parseUnits(value2, decimals);

        let burnTxn = await connectedContract.burnAI(amountBurn);
        await burnTxn.wait();
        Balance();
        balDeposited();
        AIBalance();
        
      } else {
        console.log("Could not burn");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const Balance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(addressOrName, contractInterface, signer);

        const balAmount = (await signer.getBalance()).toString();
        let balStr = ethers.utils.formatEther(balAmount, {commify: true});
        balStr = Math.round(balStr * 1e4) / 1e4;
        setBalVal(balStr);
        
      } else {
        console.log("Could not get balance");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const AIBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(addressOrName, contractInterface, signer);

        const AIBal = (await connectedContract.balanceOf((await signer.getAddress()).toString()));
        let aiBalStr = ethers.utils.formatEther(AIBal, {commify: true});
        aiBalStr = Math.round(aiBalStr * 1e4) / 1e4;
        setAiBal(aiBalStr);
        
      } else {
        console.log("Could not get balance");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const balDeposited = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(addressOrName, contractInterface, signer);

        let depAmount = (await connectedContract.getETHBalance((await signer.getAddress()).toString()));
        let depStr = ethers.utils.formatEther(depAmount, {commify: true});
        depStr = Math.round(depStr * 1e4) / 1e4;
        setDepVal(depStr);
        
      } else {
        console.log("Could not get balance");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderContent = () => {
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet
          </button>
        </div>
      );
    } else if (currentAccount) {
      return <div className='container-double'>
        <div className='container-content'>
          <h1>Deposit</h1>
          <p>Deposit <span className="token">ETH</span> to mint new <span className="token">AI</span></p>
          <div className='container-deposit'>
          <label><span><span className="token">ETH</span> balance: {balVal}</span></label> {'  '}
          <input className='input-deposit' value={value} onChange={(e) => setValue(e.target.value)} />
          <button className='button-deposit' onClick={Deposit}>
              Deposit
      </button>
          </div>
      </div>

      <div className='container-content'>
          <h1>Burn</h1>
          <p>Burn <span className="token">AI</span> to withdraw <span className="token">ETH</span></p>
          <div className='container-deposit'>
          <label><span><span className="token">AI</span> balance: {aiBal}</span></label> {'  '}
          <input className='input-deposit' value={value2} onChange={(e) => setValue2(e.target.value)} />
          <button className='button-deposit' onClick={Burn}>
              Burn
      </button>
          </div>
      </div>
      </div>
    }
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== "4") {
          alert("Please connect to Rinkeby!");
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">AiDAO</p>
          <p className="sub-text">
            A DAO dedicated to the advancement in A.I. and Robotics!
          </p>
          <span className="sub-text"><span className='token'>ETH</span> deposited: {depVal}</span>
          <p />
          {renderContent()}
        </div>
        <div className="footer-container"></div>
      </div>
    </div>
  );
};

export default App;
