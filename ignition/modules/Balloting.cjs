const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('BallotingModule', m => {
	const lock = m.contract('Balloting');

	return { lock };
});
