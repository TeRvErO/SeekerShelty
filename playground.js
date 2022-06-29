let inquirer = require('inquirer');
let {getWalletFromMnemonic, generateMnemonic, getCheckSummedMnemonic, bip39} = require("./help_mnemonic.js");
let {chains, Web3Helper, Web3} = require("./help_balances.js");

function addressContract(deployer, nonce) {
	const rlp = require('rlp');
	const keccak = require('keccak');

	let input_arr = [deployer, Web3.utils.toHex(nonce)];
	let rlp_encoded = rlp.encode(input_arr);
	let contract_address_long = keccak('keccak256').update(rlp_encoded).digest('hex');

	let address = "0x" + contract_address_long.substring(24);
	return address;
}

function vanityAddress(prefix, suffix) {
	const ethWallet = require('ethereumjs-wallet');
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

//let seed = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"
main_question_choices = [
	"Get future contract address",
	"Get wallet from mnemonic",
	"Generate mnemonic",
	"Checksum mnemonic",
	"Check balances",
	"Vanity address",
]

inquirer
  .prompt([
    {
		type: "list",
		name: "action",
		message: "What do you want to do:",
		choices: main_question_choices
    },
    {
		type: "input",
		name: "address",
		message: "Paste a deployer address:",
		validate: (address) => Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(address)),
		when: (answers) => answers.action == main_question_choices[0],
    },
    {
		type: "input",
		name: "nonce",
		message: "Nonce:",
		validate: (nonce) => nonce >= 0,
		when: (answers) => answers.action == main_question_choices[0],
    },
    {
		type: "input",
		name: "mnemonic",
		message: "Type a mnemonic:",
		validate: (seed) => {
			words = seed.split(" ");
			if (!(words.length >= 12 && words.length % 3 == 0)) throw "Length should be >= 12 and divide by 3";
			wrong_word = words.find(word => !bip39.wordlists.english.includes(word));
			if (wrong_word !== undefined) throw `Wrong word '${wrong_word}'`;
			return true; 
		},
		when: (answers) => answers.action == main_question_choices[1],
    },
    {
		type: "input",
		name: "number",
		message: "Type a number of wallet (starting with 0):",
		validate: (number) => number >= 0,
		when: (answers) => answers.action == main_question_choices[1],
    },
    {
		type: "input",
		name: "mnemonic",
		message: "Type any 12 words from mnemonic dictionary:",
		validate: (seed) => {
			words = seed.split(" ");
			if (words.length != 12) throw "Length should be 12";
			wrong_word = words.find(word => !bip39.wordlists.english.includes(word));
			if (wrong_word !== undefined) throw `Wrong word '${wrong_word}'`;
			return true; 
		},
		when: (answers) => answers.action == main_question_choices[3],
    },
    {
		type: "input",
		name: "address",
		message: "Paste an address:",
		validate: (address) => Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(address)),
		when: (answers) => answers.action == main_question_choices[4],
    },
    {
		type: "list",
		name: "network",
		message: "Choose a network:",
		choices: Object.keys(chains),
		when: (answers) => answers.action == main_question_choices[4],
    },
    {
		type: "input",
		name: "prefix",
		message: "Type a prefix:",
		validate: (prefix) => prefix.length == 0 || /[0-9A-Fa-f]/g.test(prefix),
		when: (answers) => answers.action == main_question_choices[5],
    },
    {
		type: "input",
		name: "suffix",
		message: "Type a suffix:",
		validate: (suffix) => suffix.length == 0 || /[0-9A-Fa-f]/g.test(suffix),
		when: (answers) => answers.action == main_question_choices[5],
    },
  ])
  .then((answers) => {
  	//console.log(answers);
  	if (answers.action == main_question_choices[0]) {
  		let futureContract = addressContract(answers.address, answers.nonce);
  		console.log(`Contract address: ${futureContract}`);
  	}
  	else if (answers.action == main_question_choices[1])
  		getWalletFromMnemonic(answers.mnemonic, answers.number);
  	else if (answers.action == main_question_choices[2])
  		generateMnemonic();
  	else if (answers.action == main_question_choices[3])
  		getCheckSummedMnemonic(answers.mnemonic);
  	else if (answers.action == main_question_choices[4]) {
  		let helper = new Web3Helper(answers.address, answers.network);
  		helper.getBalances();
  	}
  	else if (answers.action == main_question_choices[5])
  		vanityAddress(answers.prefix, answers.suffix);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Cannot render prompt");
    } else {
      console.log("Undefined error with prompt");
      console.log(error);
    }
  });
