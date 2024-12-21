import React, { createContext, useState, useEffect } from "react";
import { contractAbi, contractAddress } from "../utils/constants";
import toast from "react-hot-toast";
import { ethers } from "ethers";

export const TransactionContext = createContext();

const getContractInstance = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractAbi, signer);
  }
  throw new Error("Ethereum object not found");
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;
      if (!ethereum) return alert("Please install MetaMask!");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      localStorage.setItem("account", accounts[0]);
      toast.success("Wallet Connected Successfully");
    } catch (error) {
      console.error("Wallet connection failed", error);
      toast.error("Unable to connect the wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const createWill = async (
    willId,
    beneficiaryData, // An object containing addresses, shares, and names
    releaseTime,
    assetName,
    assetCategory,
    amount
  ) => {
    setIsLoading(true);

    // Destructure beneficiaryData to get the individual arrays
    const { addresses, shares, names } = beneficiaryData;

    try {
      // Get the contract instance
      const contract = getContractInstance();

      // Log the input data for debugging
      console.log(
        willId,
        addresses,
        shares,
        names,
        releaseTime,
        assetName,
        assetCategory,
        amount
      );

      // Call the createWill function on the contract
      const transaction = await contract.createWill(
        willId,
        {
          addresses: addresses,
          shares: shares,
          names: names,
        },
        releaseTime,
        assetName,
        assetCategory,
        {
          value: ethers.utils.parseEther(amount.toString()), // Amount passed as ethers
        }
      );

      // Wait for the transaction to be mined
      await transaction.wait();

      // Show success toast
      toast.success("Will created successfully!");
    } catch (error) {
      console.error("Error creating will:", error);

      // Show error toast
      toast.error("Failed to create will.");
    } finally {
      // Set loading state to false
      setIsLoading(false);
    }
  };

  const modifyWill = async (
    willId,
    newAssetName,
    newAssetCategory,
    newBeneficiaryData,
    newReleaseTime
  ) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const transaction = await contract.modifyWill(
        willId,
        newAssetName,
        newAssetCategory,
        newBeneficiaryData,
        newReleaseTime
      );
      await transaction.wait();
      toast.success("Will modified successfully!");
    } catch (error) {
      console.error("Error modifying will:", error);
      toast.error("Failed to modify will.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWill = async (willId) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const transaction = await contract.verifyWill(willId);
      await transaction.wait();
      toast.success("Will verified successfully!");
    } catch (error) {
      console.error("Error verifying will:", error);
      toast.error("Failed to verify will.");
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFunds = async (willId) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const transaction = await contract.withdrawFunds(willId);
      await transaction.wait();
      toast.success("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWill = async (willId) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const transaction = await contract.deleteWill(willId);
      await transaction.wait();
      toast.success("Will deleted successfully!");
    } catch (error) {
      console.error("Error deleting will:", error);
      toast.error("Failed to delete will.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWills = async (method, param) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const wills = await contract[method](param);
      return wills;
    } catch (error) {
      console.error("Error fetching wills:", error);
      toast.error("Failed to fetch wills.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        createWill,
        modifyWill,
        verifyWill,
        withdrawFunds,
        deleteWill,
        fetchWills,
        currentAccount,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
