import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi';
import { formatAddress } from '../utils/formatAddress';
import abi from './assets/abi.json';
import { contractAddress } from '../utils/const';

const App = () => {
	const { address, isConnected } = useAccount();
	const { connectors, connect, isPending } = useConnect();
	const { disconnect, isDisconnecting } = useDisconnect();
	const {
		writeContract: registerMember,
		// data: hash,
		error: memberRegistrationError,
		isPending: isRegistringMember,
	} = useWriteContract({});

	const { data: members = [] } = useReadContract({
		address: contractAddress,
		abi,
		functionName: 'getMembers',
		args: [],
	});

	const handleMemberRegistration = () => {
		registerMember({
			address: contractAddress,
			abi,
			functionName: 'registerMember',
			args: [address],
		});
	};

	const connector = connectors[0];

	console.log(members, 'this is balance');

	return (
		<main>
			<button key={connector.id} onClick={() => connect({ connector })}>
				{isPending ? 'Connecting...' : isConnected ? formatAddress(address) : ` Connect with ${connector.name}`}
			</button>

			<button onClick={disconnect} disabled={!isConnected}>
				{isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
			</button>

			<h1>Welcome to our Balloting Project</h1>

			<button onClick={handleMemberRegistration}>
				{' '}
				{isRegistringMember ? 'Registering...' : 'Register a member'}
			</button>
			{memberRegistrationError?.name && <p>{memberRegistrationError?.name}</p>}
		</main>
	);
};

export default App;
