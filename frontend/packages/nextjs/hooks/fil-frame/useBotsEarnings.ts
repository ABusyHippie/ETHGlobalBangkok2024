import { useEffect, useState } from "react";
import { useWatchBalance } from "./useWatchBalance";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

const EARNINGS_STORAGE_KEY = "bot_earnings";

export const useBotsEarnings = () => {
  const { address } = useAccount();
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { data: currentBalance } = useWatchBalance({ address });

  useEffect(() => {
    const fetchEarnings = async () => {
      setIsLoading(true);
      try {
        // Get earnings from localStorage or generate new if none exists
        let earnings = localStorage.getItem(EARNINGS_STORAGE_KEY);
        if (!earnings) {
          const mockEarnings = Math.random() * 200 - 100; // Random number between -100 and 100
          earnings = mockEarnings.toString();
          localStorage.setItem(EARNINGS_STORAGE_KEY, earnings);
        }
        setTotalEarnings(Number(earnings));
      } catch (error) {
        console.error("Error fetching bot earnings:", error);
        setTotalEarnings(0);
      }
      setIsLoading(false);
    };

    if (address) {
      fetchEarnings();
    }
  }, [address]);

  return { totalEarnings, isLoading };
};
