import React, { createContext, useState, useEffect } from "react";
import { contractAbi, contractAddress } from "../utils/constants";
import toast from "react-hot-toast";
import { ethers } from "ethers";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    if (typeof window !== "undefined" && window.ethereum) {
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
    }
  };

  const getContractInstance = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractAbi, signer);
  };

  const createWill = async (
    _beneficiaries,
    _shares,
    _releaseTime,
    etherValue
  ) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const tx = await contract.createWill(
        _beneficiaries,
        _shares,
        _releaseTime,
        {
          value: ethers.utils.parseEther(etherValue),
        }
      );
      await tx.wait();
      toast.success("Will created successfully!");
    } catch (error) {
      console.error("Error creating will:", error);
      toast.error("Failed to create the will. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawFromWill = async (willId) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const tx = await contract.withdrawWill(willId);
      await tx.wait();
      toast.success("Withdrawal successful!");
    } catch (error) {
      console.error("Error withdrawing from will:", error);
      toast.error("Withdrawal failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const modifyWill = async (willId, _beneficiaries, _shares, _releaseTime) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const tx = await contract.modifyWill(
        willId,
        _beneficiaries,
        _shares,
        _releaseTime
      );
      await tx.wait();
      toast.success("Will modified successfully!");
    } catch (error) {
      console.error("Error modifying will:", error);
      toast.error("Failed to modify the will.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWill = async (willId) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const tx = await contract.deleteWill(willId);
      await tx.wait();
      toast.success("Will deleted successfully!");
    } catch (error) {
      console.error("Error deleting will:", error);
      toast.error("Failed to delete the will.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWill = async (willId) => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const tx = await contract.verifyWill(willId);
      await tx.wait();
      toast.success("Will verified successfully!");
    } catch (error) {
      console.error("Error verifying will:", error);
      toast.error("Failed to verify the will.");
    } finally {
      setIsLoading(false);
    }
  };

  const getOwnerWills = async () => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const wills = await contract.getOwnerWills();
      console.log(wills);
      return wills;
    } catch (error) {
      console.error("Error fetching owner wills:", error);
      toast.error("Failed to fetch owner wills.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBeneficiaryWills = async () => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      const wills = await contract.getBeneficiaryWills();
      console.log(wills);
      return wills;
    } catch (error) {
      console.error("Error fetching beneficiary wills:", error);
      toast.error("Failed to fetch beneficiary wills.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContractDetails = async () => {
    setIsLoading(true);
    try {
      const contract = getContractInstance();
      console.log(contract);
    } catch (error) {
      console.error("Error fetching contract details:", error);
      toast.error("Failed to fetch contract details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { ethereum } = window;
      if (ethereum) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length) setCurrentAccount(accounts[0]);
      }
    };
    init();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        createWill,
        withdrawFromWill,
        modifyWill,
        deleteWill,
        verifyWill,
        getOwnerWills,
        getBeneficiaryWills,
        fetchContractDetails,
        currentAccount,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
