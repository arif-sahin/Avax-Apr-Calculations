console.log('console');

const Params = {
    MAXIMUM_SUPPLY: 720000000,
    MINTING_PERIOD: 365 * 24 * 60 * 60, // 1 year in seconds
};








// const API_URL = "https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet";
// async function fetchFromSnowpeer() {

//             // The exact message we send to the P-Chain
//             var payload = {
//                 jsonrpc: "2.0",
//                 id: 1,
//                 method: "platform.getCurrentSupply",
//                 params: {}
//             };

//             try {
//                 // 1. Send the message
//                 let response = await fetch(API_URL, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(payload)
//                 });

//                 // 2. Get the answer
//                 let data = await response.json();
//                 console.log("API Answer:", data); // Check your console (F12) to see this!

//                 if(data.result && data.result.supply) {
//                     // 3. Convert nAVAX to AVAX (divide by 1 billion)
//                     let supplyInAvax = data.result.supply / 1000000000;
                    
//                     // 4. Update the box
//                     console.log(supplyInAvax);
//                 } else {
//                     console.log('nothing');
//                 }

//             } catch (err) {
//                 console.error(err);

//             }
//         }



// function getCurrentSupply() {
//     const url = 'https://api.snowpeer.io/v1/monetary/current-total-supply?network=mainnet';

//     const data = {
//         currentSupply: "currentSupply",
//     };

//     const requestOptions = {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//     };

//     fetch(url, requestOptions)
//     .then(response => {
//         if (!response.ok) {
//         throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         outputElement.textContent = JSON.stringify(data, null, 2);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

// }
