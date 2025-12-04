// Reward = (MaxSup - Supply) x (Stake/supply) x 
// (StakingPeriod/mintingPeriod) x Effective Consumption Rate


const Params = {
    MINTING_PERIOD: 365 * 24 * 60 * 60,
    MAXIMUM_SUPPLY: 720000000,
    MinConsumptionRate: 0.10,
    MaxConsumptionRate: 0.12,
    VALIDATOR_FEE: 0.02,
    MIN_STAKE: 25,
    API_URL: "https://corsproxy.io/?" + encodeURIComponent("https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet"),
};
let currentTotalSupply = NaN;
let currentRole = 'delegator'; // default role

window.onload = function() {
    init();
    setRole('delegator');
};

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

async function fetchSupply() { 
    const loading = document.getElementById('loading');
    
    try {
        const currentSupply = await fetch(Params.API_URL, {
            method: "GET",
            headers: {
                "accept": "application/json"
            }
        });

        const data = await currentSupply.json();

        if(data.result && data.result.supply) {
            // converting nAvax to Avax
            const supply = data.result.supply / 1e9;
            Params.currentTotalSupply = supply;
            loading.style.display = 'none';
            return supply;
            // calculate()
        }

        return 4656813442939137/10000000;
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
        if(getStakeAmount() < 2000) {
            alert('Minimum 2000 Avax');
        }

        feeSection.classList.add('disabled-section')
    } else {
        minText.innerText = "Minimium 25 AVAX required(Delegator)";
        stake.value = 25;
        if(getStakeAmount() < Params.MIN_STAKE) {
            alert("Stake amount must be at least 25 AVAX");
            return; // stop the function
        } 
        fee.classList.remove('disabled-section');
    }

    //calculate();
}

function updateDayLabel() {
    document.getElementById('dayDisplay').innerText = getDuration();
}

function calculate() {
    //Remaining supply
    const remainingSupply = Params.MAXIMUM_SUPPLY - currentTotalSupply;
    console.log(remainingSupply);

    // Share Calculation
    const myShare = getStakeAmount() / currentTotalSupply;
    console.log(myShare);
    
    // Time 
    const timeFactor = getDuration()/365;

    //Rate Calculation, Longer duration = Higher rate
    const percentofMaxTime = getDuration() / 365;
    const effectiveRate = Params.MinConsumptionRate + ((Params.MaxConsumptionRate - Params.MinConsumptionRate) * percentofMaxTime); 

    // Gross Reward
    let reward = remainingSupply * myShare * timeFactor * effectiveRate;

    // Fee and Net reward
    if (currentRole === 'delegator') {
        const feeCut = reward * (getFee() / 100);
        reward = reward - feeCut;
    }

    const apy = (reward / getStakeAmount()) * (365 / getDuration()) * 100;
    
    document.getElementById('estimatedReward').innerText = reward.toFixed(6);
    document.getElementById('apyOutput').textContent = apy.toFixed(2);
}