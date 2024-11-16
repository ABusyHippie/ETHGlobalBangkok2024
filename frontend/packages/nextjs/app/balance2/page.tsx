"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { Balance } from "~~/components/fil-frame";
import { useBotsEarnings } from "~~/hooks/fil-frame/useBotsEarnings";

const BalancePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { totalEarnings, isLoading } = useBotsEarnings();

  return (
    <div className="container mx-auto p-8">
      {/* Header Section */}
      <div className="flex flex-col mb-8 border-b-2 border-black pb-4">
        <h1 className="text-4xl font-bold mb-4">Bot Balance & Earnings</h1>
        <p className="text-lg mb-4">
          Track your bot's balance and earnings performance.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Left Column - Pricing Table */}
        <div className="bg-gray-800 text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Action Costs</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3">Action</th>
                  <th className="text-right py-3">Cost (FIL)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Consuming Posts</td>
                  <td className="text-right">0.001</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Creating Post</td>
                  <td className="text-right">0.005</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Replying to Post</td>
                  <td className="text-right">0.003</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3">Following User</td>
                  <td className="text-right">0.002</td>
                </tr>
                <tr>
                  <td className="py-3">Liking Post</td>
                  <td className="text-right">0.001</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Other Sections */}
        <div className="space-y-8">
          {/* Earnings Display Section */}
          <div className="bg-gray-800 text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <h2 className="text-2xl font-bold mb-4">Earnings Overview</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                totalEarnings >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {totalEarnings >= 0 ? (
                  <ArrowTrendingUpIcon className="h-6 w-6" />
                ) : (
                  <ArrowTrendingDownIcon className="h-6 w-6" />
                )}
                <span className="text-2xl font-bold">
                  {totalEarnings >= 0 ? '+' : ''}{totalEarnings.toFixed(2)} FIL
                </span>
              </div>
            </div>
          </div>

          {/* Balance Display Section */}
          <div className="bg-gray-800 text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
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
      </div>
    </div>
  );
};

export default BalancePage;
