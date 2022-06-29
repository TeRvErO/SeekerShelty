const rlp = require('rlp');
const keccak = require('keccak');
const ethWallet = require('ethereumjs-wallet');
let {Web3} = require("./help_balances.js");

function addressContract(deployer, nonce) {
	let input_arr = [deployer, Web3.utils.toHex(nonce)];
	let rlp_encoded = rlp.encode(input_arr);
	let contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

	let address = "0x" + contract_address_long.substring(24);
	return address;
}

function vanityAddress(prefix, suffix) {
	while (true) {
		let addressData = ethWallet.generate();
		var pkey = addressData.getPrivateKeyString();
		var address = addressData.getAddressString();
		if (address.slice(2, 42).startsWith(prefix) && address.slice(2, 42).endsWith(suffix))
			break;
	}
	console.log(`Private key: ${pkey}`);
	console.log(`Address: ${address}`);
}

module.exports = {addressContract, vanityAddress};