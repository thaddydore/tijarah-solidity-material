export const formatAddress = address => {
	if (typeof address !== 'string' || address.length < 10) {
		throw new Error('Invalid address');
	}

	return `${address.slice(0, 10)}...${address.slice(-6)}`;
};
