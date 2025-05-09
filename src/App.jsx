import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useReadContract, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { formatAddress } from '../utils/formatAddress';
import abi from './assets/abi.json';
import { contractAddress } from '../utils/const';

const App = () => {
	const { address, isConnected } = useAccount();
	const { connectors, connect, isPending } = useConnect();
	const { disconnect, isDisconnecting } = useDisconnect();
	const [walletAddress, setWalletAddress] = useState('');
	const [vottingAddress, setVottingAddress] = useState('');

	const {
		writeContract: registerMember,
		error: memberRegistrationError,
		isPending: isRegistringMember,
	} = useWriteContract({});

	const {
		writeContract: nominateMember,
		error: nominationError,
		isPending: isNominationPending,
	} = useWriteContract({});

	const { writeContract: voteForMember, error: votingError, isPending: isVotingPending } = useWriteContract({});

	const { data: members = [] } = useReadContract({
		address: contractAddress,
		abi,
		functionName: 'getMembers',
		args: [],
		watch: true,
		query: {
			enabled: isConnected,
			refetchInterval: 5000,
			retry: true,
			retryDelay: 5000,
		},
	});

	const handleMemberRegistration = () => {
		registerMember({
			address: contractAddress,
			abi,
			functionName: 'registerMember',
			args: [address],
		});
	};

	const handleMemberNomination = e => {
		e.preventDefault();

		if (!walletAddress) {
			return alert('Please enter a wallet address');
		}

		nominateMember({
			address: contractAddress,
			abi,
			functionName: 'nominateMember',
			args: [walletAddress],
		});
		setWalletAddress('');
	};

	const handleVotingForMember = e => {
		e.preventDefault();

		if (!walletAddress) {
			return alert('Please enter a wallet address');
		}

		voteForMember({
			address: contractAddress,
			abi,
			functionName: 'vote',
			args: [vottingAddress],
		});
		setWalletAddress('');
	};

	const connector = connectors[0];

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

			<form onSubmit={handleMemberNomination}>
				<input name='walletAddress' value={walletAddress} onChange={e => setWalletAddress(e.target.value)} />
				<button disabled={isNominationPending}>
					{' '}
					{isNominationPending ? 'Nominating...' : 'Nominate a member'}
				</button>
				{nominationError?.shortMessage && (
					<p style={{ color: 'red', fontWeight: 600, fontSize: 14 }}>{nominationError?.shortMessage}</p>
				)}
			</form>
			<h2>Voting</h2>
			<form onSubmit={handleVotingForMember}>
				<input name='votingAddress' value={walletAddress} onChange={e => setVottingAddress(e.target.value)} />
				<button disabled={isVotingPending}> {isVotingPending ? 'Nominating...' : 'Nominate a member'}</button>
				{votingError?.shortMessage && (
					<p style={{ color: 'red', fontWeight: 600, fontSize: 14 }}>{votingError?.shortMessage}</p>
				)}
			</form>

			{memberRegistrationError?.shortMessage && (
				<p style={{ color: 'red', fontWeight: 600, fontSize: 14 }}>{memberRegistrationError?.shortMessage}</p>
			)}

			<h2>Registered Members</h2>
			<ul>
				{members?.map(member => (
					<li key={member}>{formatAddress(member)}</li>
				))}
			</ul>
		</main>
	);
};

export default App;
