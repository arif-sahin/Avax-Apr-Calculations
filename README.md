# 🔺 Avacabus

A real-time staking rewards calculator for the **Avalanche (AVAX)** Primary Network. Built with a focus on UI/UX, featuring skeleton loading states, real-time price data, and accurate protocol formulas.

🔗 [**Live Demo**](https://avax-apr-calculations.vercel.app/)

## ✨ Features

* **Dual Role Support:** Switch seamlessly between **Validator** (2000 AVAX min) and **Delegator** (25 AVAX min) calculations.
* **Real-Time Data:**
  * Fetches **Network Supply** and **AVAX Price (USD)** Snowpeer.
* **Smart Date Logic:**
  * Date pickers synchronized with a duration number input.
  * Preset buttons (Min, 30d, 6M, Max).
  * Validation to prevent durations shorter than the protocol minimum (14 days).
* **Detailed Projections:** Calculates Daily, Weekly, Monthly, and Yearly earnings based on Compound Interest (APY).
* **Premium UX:**
  * **Skeleton Loading:** Smooth shimmer effects while data fetches.
  * **Contextual Tooltips:** Explanations for APR vs APY.

## 🛠 Tech Stack

* **Core:** HTML5, CSS3, JavaScript.
* **APIs:**
  * [Snowpeer, Current Total Supply](https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet) (Supply Data)
  * [Snowpeer, Current Avax Price](https://api.snowpeer.io/v1/monetary/current-avax-price) (Price Data)

## 🧮 The Formula

Rewards are calculated based on the official [Avalanche Primary Network Reward Formula](https://build.avax.network/docs/primary-network/validate/rewards-formula).

The core logic determines the **Effective Consumption Rate** (interest rate), which scales linearly based on the staking duration:

* **Minimum Rate (10%):** achieved at 14 days duration.
* **Maximum Rate (12%):** achieved at 365 days duration.

```javascript
// Simplified Logic
Rate = MinRate + (MaxRate - MinRate) * (StakingDuration / MintingPeriod)
Reward = (MaxSupply - CurrentSupply) * (YourStake / CurrentSupply) * (Duration / Year) * Rate