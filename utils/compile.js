import fs from 'node:fs';
import solc from 'solc';
import { CONTRACTPATH, CONTRACTNAME, BUILDIR, ABIPATH, BYTECODEPATH } from './constants.js';

function compile() {
	const content = fs.readFileSync(CONTRACTPATH, { encoding: 'utf-8' });

	const config = {
		language: 'Solidity',
		sources: {
			[CONTRACTNAME]: {
				content,
			},
		},
		settings: {
			outputSelection: {
				'*': {
					'*': ['*'], 
				},
			},
		},
	};

	const compiledContract = JSON.parse(solc.compile(JSON.stringify(config)));

	const abi = compiledContract.contracts[CONTRACTNAME][CONTRACTNAME].abi;
	const bytecode = compiledContract.contracts[CONTRACTNAME][CONTRACTNAME].evm.bytecode.object;

	if (!fs.existsSync(BUILDIR)) {
		fs.mkdirSync(BUILDIR);
	}

	fs.writeFileSync(ABIPATH, JSON.stringify(abi));
	fs.writeFileSync(BYTECODEPATH, JSON.stringify({ bytecode }));
}

compile();
