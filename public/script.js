// Reward = (MaxSup - Supply) x (Stake/supply) x 
// (StakingPeriod/mintingPeriod) x Effective Consumption Rate

const SECONDS_IN_DAY= 24 * 60 * 60;
const Params = {
    MINTING_PERIOD: 365 * SECONDS_IN_DAY,
    MIN_DURATION_SECONDS: 14 * SECONDS_IN_DAY, 
    MAX_DURATION_SECONDS: 365 * SECONDS_IN_DAY,
    MAXIMUM_SUPPLY: 720000000,
    MinConsumptionRate: 0.10,
    MaxConsumptionRate: 0.12,
    VALIDATOR_FEE: 0.02,
    DELEGATOR_MIN_STAKE: 25,
    VALIDATOR_MIN_STAKE: 2000,
    API_URL: "/api/supply",
};
let currentTotalSupply = NaN;
let currentRole = 'delegator'; // default role

window.onload = function() {
    const now = new Date();
    const minStakeDur = new Date(now.getTime() + (Params.MIN_DURATION_SECONDS * 1000)); // javascript use miliseconds

    document.getElementById('startDate').value = localTime(now);
    document.getElementById('endDate').value = localTime(minStakeDur);

    init();
    setRole('delegator');
};

function localTime(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date - offset).toISOString().slice(0, 16));
}

// Sync 
function syncFromNumber() {
    const days = parseFloat(document.getElementById('myDays').value);
    const start = new Date(document.getElementById('startDate').value);

    if (!isNaN(start.getTime()) && !isNaN(days)) {
        // Calculate new end date based on input days
        const newEnd = new Date(start.getTime() + (days * SECONDS_IN_DAY * 1000));
        document.getElementById('endDate').value = localTime(newEnd);

        // Warning
        const warningBox = document.getElementById('warningBox');
        if (days < 14 || days > 365) {
            warningBox.style.display = 'flex';
        } else {
            warningBox.style.display = 'none';
        }
    }
}

function syncFromDates() {
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const timeDiff = end - start;
        const daysDiff = timeDiff / (SECONDS_IN_DAY * 1000);
        const secondsDiff = timeDiff / 1000;

        if (isNaN(daysDiff) || !isFinite(daysDiff)) return;

        const warningBox = document.getElementById('warningBox');

        if (secondsDiff < Params.MIN_DURATION_SECONDS || secondsDiff > Params.MAX_DURATION_SECONDS) {
            warningBox.style.display = 'flex';
        } else {
            warningBox.style.display = 'none';
        }

        const numberInput = document.getElementById('myDays');

        numberInput.value = Number.isInteger(daysDiff) ? daysDiff : daysDiff.toFixed(2);
        document.getElementById('dayDisplay').innerText = daysDiff;
    }
}

function getStakeAmount() {
    const stake = parseFloat(document.getElementById("myStake").value);
    return stake;
}

function getDuration() {
    const duration = parseFloat(document.getElementById("myDays").value);
    return duration;
}

function getFee() {
    const fee = parseFloat(document.getElementById('feeAmount').value);
    return fee;
}

function getEffectiveConrate(durationInSeconds) {
    const StakingPeriod = Math.min(durationInSeconds, Params.MINTING_PERIOD);
    const ratio = StakingPeriod / Params.MINTING_PERIOD;
    return (Params.MinConsumptionRate * (1 - ratio) + (Params.MaxConsumptionRate * ratio));
}

async function fetchSupply() { 
    const loading = document.getElementById('loading');
    
    try {
        const currentSupply = await fetch(Params.API_URL);

        if (!currentSupply.ok) throw new Error('Backend error');

        const data = await currentSupply.json();

        if(data.supply) {
            // converting nAvax to Avax
            const supply = data.supply / 1e9;
            currentTotalSupply = supply;
            loading.style.display = 'none';
            // return supply;
            // calculate()
        }

        // return 4656813442939137/10000000;
    } catch (error) {
        document.getElementById('loadingText').innerText = "API Error. Using Default Supply.";
        setTimeout(() => {loading.style.display = 'none'}, 2000);
        return 4656813442939137/10000000;
    }
}

async function init() {
    const supply = await fetchSupply();
    currentTotalSupply = supply;
    console.log("Current supply:", supply);
}


function setRole(role) {
    currentRole = role;

    // Update buttons
    const buttons = document.querySelectorAll('.roleBtn');
    buttons.forEach(btn => btn.classList.remove('active'));
    // index, delegator  = 0 , validator = 1
    buttons[role === 'delegator' ? 0 : 1].classList.add('active');

    // Update Limits
    const minText = document.getElementById('minStake');
    const stake = document.getElementById('myStake');
    const fee = document.getElementById('feeSection');

    if(role === 'validator') {
        minText.innerText = "Minimum 2,000 AVAX required(Validator)";
        stake.value = 2000;
        if(getStakeAmount() < Params.VALIDATOR_MIN_STAKE) {
            alert('Stake amount must be at least 2000 AVAX');
            return;
        }

        feeSection.classList.add('disabled-section')
    } else {
        minText.innerText = "Minimium 25 AVAX required(Delegator)";
        stake.value = 25;
        if(getStakeAmount() < Params.DELEGATOR_MIN_STAKE) {
            alert("Stake amount must be at least 25 AVAX");
            return; // stop the function
        } 
        fee.classList.remove('disabled-section');
    }

    //calculate();
}

function calculate() {
    //Remaining supply
    const remainingSupply = Params.MAXIMUM_SUPPLY - currentTotalSupply;

    // Share Calculation
    const myShare = getStakeAmount() / currentTotalSupply;
    
    // Duration in Seconds 
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);
    let durationSeconds = (end - start) / 1000;

    if (durationSeconds < Params.MIN_DURATION_SECONDS) {
        document.getElementById('estimatedReward').innerText = "---";
        document.getElementById('apyOutput').innerText = "---";
        document.getElementById('aprOutput').innerText = "---";
        return;
    }

    //Rate Calculation, Longer duration = Higher rate
    const effectiveRate = getEffectiveConrate(durationSeconds);
    
    // time factor
    const timeFactor = durationSeconds / Params.MINTING_PERIOD;
    
    // Gross Reward
    let reward = remainingSupply * myShare * timeFactor * effectiveRate;

    // For Delegator, Fee and Net reward
    if (currentRole === 'delegator') {
        const feeCut = reward * (getFee() / 100);
        reward = reward - feeCut;
    }

    const simpleReturn = reward / getStakeAmount();
    const apr = simpleReturn * (Params.MINTING_PERIOD / durationSeconds) * 100;
    const periodsPerYear = Params.MINTING_PERIOD / durationSeconds;
    const apy = (Math.pow(1 + simpleReturn, periodsPerYear) - 1) * 100;

    document.getElementById('estimatedReward').innerText = reward.toFixed(6);
    document.getElementById('aprOutput').textContent = apr.toFixed(2);
    document.getElementById('apyOutput').textContent = apy.toFixed(2);

    // Projections
    const projectedYearly = getStakeAmount() * (apy / 100);

    document.getElementById('projDaily').innerText = (projectedYearly / 365).toFixed(4);
    document.getElementById('projWeekly').innerText = (projectedYearly / 52).toFixed(4);
    document.getElementById('projMonthly').innerText = (projectedYearly / 12).toFixed(4);
    document.getElementById('projYearly').innerText = projectedYearly.toFixed(4);
}