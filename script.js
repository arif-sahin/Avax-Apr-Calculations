// Reward = (MaxSup - Supply) x (Stake/supply) x 
// (StakingPeriod/mintingPeriod) x Effective Consumption Rate


const Params = {
    MAXIMUM_SUPPLY: 720000000,
    MinConsumptionRate: 0.10,
    MaxConsumptionRate: 0.12,
    VALIDATOR_FEE: 0.02,
    MIN_STAKE: 25,
};

function getStakeAmount() {
    const stake = parseFloat(document.getElementById("myStake").value);
    return stake;
}

function getDuration() {
    const duration = parseFloat(document.getElementById("myDays").value);
    return duration;
}

function getCurrentSupply() { // Will be done with API
    return 465513067106358900/1000000000;
}

function calculate() {
    //Remaining supply
    const remainingSupply = Params.MAXIMUM_SUPPLY - getCurrentSupply();

    // Share Calculation
    const myShare = getStakeAmount() / getCurrentSupply();
    
    // Time 
    const timeFactor = getDuration()/365;

    //Rate Calculation, Longer duration = Higher rate
    const percentofMaxTime = getDuration() / 365;
    const myRate = Params.MinConsumptionRate + ((Params.MaxConsumptionRate - Params.MinConsumptionRate) * percentofMaxTime); 

    // Input control
    if(getStakeAmount() < Params.MIN_STAKE) {
        alert("Stake amount must be at least 25 AVAX");
        return; // stop the function
    } 

    // Gross Reward
    const grossReward = remainingSupply * myShare * timeFactor * myRate;

    // Validator Fee Calculation and Net reward
    const feeAmount = grossReward * Params.VALIDATOR_FEE;
    
    const netReward = grossReward - feeAmount;

    document.getElementById("estimatedReward").textContent =netReward;
}