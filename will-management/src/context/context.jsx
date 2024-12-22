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
    beneficiaryData,
    releaseTime,
    assetName,
    assetCategory,
    amount
  ) => {
    setIsLoading(true);
    const { addresses, shares, names } = beneficiaryData;

    try {
      const contract = getContractInstance();
      const transaction = await contract.createWill(
        willId,
        { addresses, shares, names },
        releaseTime,
        assetName,
        assetCategory,
        { value: ethers.utils.parseEther(amount.toString()) }
      );

      await transaction.wait();
      toast.success("Will created successfully!");
    } catch (error) {
      console.error("Error creating will:", error);
      toast.error("Failed to create will.");
    } finally {
      setIsLoading(false);
    }
  };

  const modifyWill = async (
    willId,
    newBeneficiaryData,
    newReleaseTime,
    newAssetName,
    newAssetCategory
  ) => {
    setIsLoading(true);
    const { addresses, shares, names } = newBeneficiaryData;

    try {
      const contract = getContractInstance();
      const transaction = await contract.modifyWill(
        willId,
        newAssetName,
        newAssetCategory,
        { addresses, shares, names },
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
      toast.success("Will verified and funds withdrawn successfully!");
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

  const getOwnerWills = async (ownerAddress) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const ownerWills = await contract.getOwnerWills(ownerAddress); // Get wills of the owner
      return ownerWills;
    } catch (error) {
      console.error("Error fetching owner's wills:", error);
      toast.error("Failed to fetch owner's wills.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all wills of the beneficiary
  const getBeneficiaryWills = async (beneficiaryAddress) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const beneficiaryWills = await contract.getBeneficiaryWills(
        beneficiaryAddress
      ); // Get wills of the beneficiary
      return beneficiaryWills;
    } catch (error) {
      console.error("Error fetching beneficiary's wills:", error);
      toast.error("Failed to fetch beneficiary's wills.");
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
        currentAccount,
        isLoading,
        getOwnerWills,
        getBeneficiaryWills,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
