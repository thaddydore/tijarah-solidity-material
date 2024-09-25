import fs from 'node:fs';
import { JsonRpcProvider, Wallet, ContractFactory } from 'ethers';
import { ABIPATH, BYTECODEPATH, PATHTOADDRESSES, PRIVATE_KEY, PROVIDER } from './constants.js';

async function deployAndSaveContract() {
	const contract = await deployedContract();
	const contractAddress = await contract.getAddress();
	saveDeployedContract(contractAddress);
}

async function deployedContract() {
	const abi = fs.readFileSync(ABIPATH, { encoding: 'utf-8' });
	const bytecode = JSON.parse(fs.readFileSync(BYTECODEPATH, { encoding: 'utf-8' })).bytecode;

	const provider = new JsonRpcProvider(PROVIDER);
	const wallet = new Wallet(PRIVATE_KEY, provider);

	const contractToDeploy = new ContractFactory(abi, bytecode, wallet);
	const contract = await contractToDeploy.deploy();

	return contract;
}

async function saveDeployedContract(contractAddress) {
	if (typeof contractAddress !== 'string') {
		throw new Error('invalid contract address');
	}

	if (!fs.existsSync(PATHTOADDRESSES)) {
		return fs.writeFileSync(PATHTOADDRESSES, JSON.stringify([contractAddress]), { encoding: 'utf-8' });
	}

	const addresses = JSON.parse(fs.readFileSync(PATHTOADDRESSES, { encoding: 'utf-8' }));
	addresses.push(contractAddress);
	fs.writeFileSync(PATHTOADDRESSES, JSON.stringify(addresses), { encoding: 'utf-8' });
}

deployAndSaveContract();
