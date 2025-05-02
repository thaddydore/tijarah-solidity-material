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
