import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/FinanceManager.sol/FinanceManager.json";  // Updated ABI import

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState('');

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Update address as per deployment
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      console.log("Account connected: ", account[0]);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, get the contract instance
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const currentBalance = await atm.checkBalance();
      setBalance(currentBalance.toNumber());
    }
  };

  const deposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount to deposit.");
      return;
    }
    if (atm) {
      let tx = await atm.addFunds(Number(amount));
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid amount to withdraw.");
      return;
    }
    if (atm) {
      let tx = await atm.removeFunds(Number(amount));
      await tx.wait();
      getBalance();
    }
  };

  const burn = async () => {
    if (atm) {
      let tx = await atm.clearFunds();
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask to use this application.</p>;
    }

    // If not connected, show connect button
    if (!account) {
      return <button onClick={connectAccount}>Connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <div style={{ marginTop: '10px' }}>
          <button onClick={deposit}>Deposit ETH</button>
          <button onClick={withdraw} style={{ marginLeft: '10px' }}>Withdraw ETH</button>
          <button onClick={burn} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
            Burn Funds
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>My Sweet ATM</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          margin: 20px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
        }
      `}</style>
    </main>
  );
}
