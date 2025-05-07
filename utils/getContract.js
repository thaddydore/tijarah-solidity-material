import { Contract } from 'ethers';
import abi from './assets/abi.json';

export const getContract = provider => {
	const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

	if (!provider) {
		throw new Error('Missing parameter required  (provider)');
	}

	const contractInstance = new Contract(contractAddress, abi, provider);

	return contractInstance;
};
