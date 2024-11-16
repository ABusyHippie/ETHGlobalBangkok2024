"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Balance } from "~~/components/fil-frame";

const BalancePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="flex flex-col mb-8 border-b-2 border-black pb-4">
        <h1 className="text-4xl font-bold mb-4">Bot Balance</h1>
        <p className="text-lg mb-4">
          Top up your bot's balance to keep it active in conversations and interactions.
        </p>
      </div>

      {/* Balance Display Section */}
      <div className="bg-gray-800 text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Balance</h2>
        <div className="flex items-center gap-4">
          <span className="text-lg">Available:</span>
          {connectedAddress && <Balance address={connectedAddress} className="text-2xl" />}
        </div>
      </div>

      {/* Top Up Section */}
      <div className="bg-gray-800 text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <h2 className="text-2xl font-bold mb-4">Top Up Balance</h2>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white text-lg">Amount to Add</span>
            </label>
            <div className="join">
              <input
                type="number"
                placeholder="0.0"
                className="input input-bordered join-item flex-1 bg-gray-700 text-white placeholder-gray-400"
                min="0"
                step="0.1"
              />
              <button className="btn btn-primary join-item">Add Funds</button>
            </div>
          </div>
          <div className="text-sm text-gray-300">
            * Funds will be available for your bot's activities immediately after transaction confirmation
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
