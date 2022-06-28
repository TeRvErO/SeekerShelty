const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');

function getWalletFromMnemonic(mnemonic, number) {
	const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
	for (let i = parseInt(number); i < parseInt(number) + 1; i++) {
		const path = `m/44'/60'/0'/0/${i}`;
		const wallet = hdwallet.derivePath(path).getWallet();
		const address = `0x${wallet.getAddress().toString('hex')}`;
		const pkey = `0x${wallet.getPrivateKey().toString('hex')}`;
		console.log(`Address: ${address}`);
		console.log(`Private key: ${pkey}`);
	}
}

function generateMnemonic() {
	const mnemonic = bip39.generateMnemonic();
	console.log(`Mnemonic: ${mnemonic}`);
}

function getCheckSummedMnemonic(mnemonic) {
	let indices = mnemonic.split(" ").map(word => bip39.wordlists.english.findIndex(i_word => i_word == word));
	const { Crypto } = require("@peculiar/webcrypto");
	const crypto = new Crypto();
	if (indices.length != 12) return console.log("ERROR: Need 12 words numbers as input")

	let binstr = (s, l = 8) => s.toString(2).padStart(l,'0')
	let tohex = (bytes) => bytes.map( x => x.toString(16).padStart(2,0) ).join('')
	let bytes = indices.map(x => binstr(x, 11)) // convert 0-index to binary
	 .join('').match(/.{1,8}/g) // split 8 bits 
	 .map(x => parseInt(x, 2)) // convert to UInt8
	if (bytes.length != 17) return console.log("ERROR: Something is wrong, check your input")
	bytes.pop() // remove wrong 17th byte of checksum
	//console.log("Entropy is :",tohex(bytes))
	crypto.subtle.digest("SHA-256", new Uint8Array(bytes).buffer).then( x => {
		if (x.byteLength != 32) return console.log("ERROR: Wrong SHA256")
		let hash = new Uint8Array(x)
		let cs = binstr(hash[0]).match(/.{1,4}/g)[0] // Thats our checksum
		// Take byte 15 for full 11 bits of our final word
		let bits = [binstr(bytes[15]),cs].join('')
		if (bits.length != 12) return console.log("ERROR: Wrong final word bits")
		//console.log(bits)
		let last_index = parseInt(bits.substr(1), 2);
		//console.log("Your 12th word index is: " + last_index);
		indices[11] = last_index;
		new_mnemonic = indices.map(index => bip39.wordlists.english[index]).join(" ");
		if (bip39.validateMnemonic(new_mnemonic)) console.log(`Checksummed mnemonic: ${new_mnemonic}`)
		else throw "Some error with mnemonic";
	 })
}


module.exports = {getWalletFromMnemonic, generateMnemonic, getCheckSummedMnemonic, bip39};
