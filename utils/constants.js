import path from 'node:path';
import fs from 'node:fs';
import { config } from 'dotenv';

config();

export const CWD = process.cwd();
export const CONTRACTNAME = process.argv[process.argv.length - 1];

const FILEEXTENSION = '.sol';
export const CONTRACTPATH = path.join(CWD, 'contracts', CONTRACTNAME + FILEEXTENSION);

const BUILDFOLDER = 'build/';
export const BUILDIR = path.join(CWD, BUILDFOLDER);
export const ABIPATH = path.join(BUILDIR + [CONTRACTNAME] + '.abi' + '.json');
export const BYTECODEPATH = path.join(BUILDIR + [CONTRACTNAME] + '.evm' + '.json');
export const PATHTOADDRESSES = path.join(CWD, './addresses.json');

export const ADDRESSES = JSON.parse(fs.readFileSync(PATHTOADDRESSES, 'utf-8'));

export const PROVIDER = process.env.PROVIDER;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;