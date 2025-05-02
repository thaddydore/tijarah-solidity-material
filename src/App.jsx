import { Contract, JsonRpcProvider } from 'ethers';
import abi from './assets/abi.json';

import { useEffect, useState } from 'react';
const App = () => {
	const [contract, setContract] = useState(null);

	useEffect(() => {
		const providerUrl = import.meta.env.VITE_SEPOLIA_URL;
		const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
		const provider = new JsonRpcProvider(providerUrl);

		const contractInstance = new Contract(contractAddress, abi, provider);
		setContract(contractInstance);
	}, []);

	useEffect(() => {
		const provider = window.ethereum;

		if (!provider) {
			alert('MetaMask is not installed');
			return;
		}

		provider
			.request({ method: 'eth_requestAccounts' })
			.then(accounts => {
				console.log('accounts', accounts);
			})
			.catch(error => {
				console.error('Error requesting accounts:', error);
			});

		if (provider) {
			provider.on('accountsChanged', accounts => {
				console.log('accountsChanged', accounts);
			});

			provider.on('chainChanged', chainId => {
				console.log('chainChanged', chainId);
			});

			provider.on('disconnect', error => {
				console.log('disconnect', error);
			});
		} else {
			alert('MetaMask is not installed');
		}
	}, []);

	console.log(contract, 'contract');

	const handleTest = async () => {
		try {
			const response = await contract.isNominated('');
			console.log(response, 'response');
		} catch (error) {
			console.error('Error:', error.message);
		}
	};

	return (
		<main>
			<h1>Welcome to our Balloting Project</h1>
			<button onClick={handleTest}>Test Contract</button>
		</main>
	);
};

export default App;
