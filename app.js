import fs from 'node:fs';
import { Contract, JsonRpcProvider, Wallet } from 'ethers';
import { ADDRESSES, ABIPATH, PROVIDER, PRIVATE_KEY } from './utils/constants.js';

// Define private keys for the admin and 4 other accounts
const PRIVATE_KEY2 = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
const PRIVATE_KEY3 = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';
const PRIVATE_KEY4 = '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a';

const sleepTime = 500;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const app = async () => {
    try {
        const abi = JSON.parse(fs.readFileSync(ABIPATH, { encoding: 'utf-8' }));
        const contractAddress = ADDRESSES[ADDRESSES.length - 1];
        const provider = new JsonRpcProvider(PROVIDER);
                
        // Initialize admin wallet and contract instance
        const adminWallet = new Wallet(PRIVATE_KEY, provider);
        const adminContract = new Contract(contractAddress, abi, adminWallet);
        console.log('Admin address:', adminWallet.address);

        // Initialize wallets and contract instances for each private key (excluding admin key)
        const wallet2 = new Wallet(PRIVATE_KEY2, provider);
        const wallet3 = new Wallet(PRIVATE_KEY3, provider);
        const wallet4 = new Wallet(PRIVATE_KEY4, provider);

        const contract2 = new Contract(contractAddress, abi, wallet2);
        const contract3 = new Contract(contractAddress, abi, wallet3);
        const contract4 = new Contract(contractAddress, abi, wallet4);
        
        // Reset election
        const tx = await adminContract.resetElection();
        console.log('Election reset successfully', tx);
        await sleep(sleepTime);

        // Register members with admin contract
        await adminContract.registerMember(wallet2.address);
        console.log('Register Member:', wallet2.address);
        await sleep(sleepTime);
        await adminContract.registerMember(wallet3.address);
        console.log('Register Member:', wallet3.address);
        await sleep(sleepTime);
        await adminContract.registerMember(wallet4.address);
        console.log('Register Member:', wallet4.address);
        await sleep(sleepTime);

        console.log('Member registered successfully');

        // Nominate members with member contract 2
        await contract2.nominateMember(wallet3.address);
        console.log('Member nominated:', wallet3.address);
        await sleep(sleepTime);
        await contract2.nominateMember(wallet4.address);
        console.log('Member nominated:', wallet4.address);
        await sleep(sleepTime);

        // Start voting using the admin contract 
        await adminContract.startVoting();
        console.log('Voting started');

        // Voting
        await contract2.vote(wallet3.address); 
        await sleep(sleepTime);
        await contract3.vote(wallet3.address);
        await sleep(sleepTime); 
        await contract4.vote(wallet3.address);
        await sleep(sleepTime); 

        // End voting using the admin contract 
        await adminContract.endVoting();
        console.log('Voting ended');
        await sleep(sleepTime);

        // Display winner
        const winner = await adminContract.winner();
        console.log('Winner:', winner);

        // Reset election using the admin contract 
        await adminContract.resetElection();
        console.log('Election reset');

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

app();
