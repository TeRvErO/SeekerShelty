let inquirer = require('inquirer');
let {getWalletFromMnemonic, generateMnemonic, getCheckSummedMnemonic, bip39} = require("./help_mnemonic.js");
let {chains, Web3Helper, Web3, getGasPrices} = require("./help_balances.js");
let {addressContract, vanityAddress, Playground} = require("./help_addresses.js");
let ethers = require('ethers');

main_question_choices = [
	"Get future contract address",
	"Get wallet from mnemonic",
	"Generate mnemonic",
	"Checksum mnemonic",
	"Check balances",
	"Vanity address",
]

var gasPrices = getGasPrices();

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
		type: "password",
		name: "password",
		message: "Type a passphrase:",
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
		validate: (prefix) => prefix.length == 0 || Web3.utils.isHex(prefix),
		when: (answers) => answers.action == main_question_choices[5],
    },
    {
		type: "input",
		name: "suffix",
		message: "Type a suffix:",
		validate: (suffix) => suffix.length == 0 || Web3.utils.isHex(suffix),
		when: (answers) => answers.action == main_question_choices[5],
    },
    {
		type: "input",
		name: "address",
		message: "Paste a deployer address:",
		validate: (address) => Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(address)),
		when: (answers) => answers.action == main_question_choices[6],
    },
    {
		type: "input",
		name: "nonce",
		message: "Nonce:",
		validate: (nonce) => nonce >= 0,
		when: (answers) => answers.action == main_question_choices[6],
    },
    {
		type: "input",
		name: "number",
		message: "Number:",
		validate: (number) => number >= 0,
		when: (answers) => answers.action == main_question_choices[6],
    },
    {
		type: "input",
		name: "pkey",
		message: "Paste a deployer private key:",
		validate: (pkey) => {
			var wallet = new ethers.Wallet(pkey);
			let address = wallet.address;
			return Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(address))
		},
		when: (answers) => answers.action == main_question_choices[7],
    },
    {
		type: "input",
		name: "factory",
		message: "Factory address:",
		validate: (address) => Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(address)),
		when: (answers) => answers.action == main_question_choices[7],
    },
    {
		type: "input",
		name: "number",
		message: "Number:",
		validate: (number) => number >= 0,
		when: (answers) => answers.action == main_question_choices[7],
    },
    {
		type: "input",
		name: "finalContract",
		message: "Expected final contract address:",
		validate: (address) => Web3.utils.checkAddressChecksum(Web3.utils.toChecksumAddress(address)),
		when: (answers) => answers.action == main_question_choices[7],
    },
    {
		type: "confirm",
		name: "deploy",
		message: "Deploy all contracts?",
		when: (answers) => answers.action == main_question_choices[7],
    },
    {
		type: "list",
		name: "network",
		message:  "Choose a network to deploy:",
		choices: Object.keys(chains),
		when: (answers) => answers.action == main_question_choices[7] && answers.deploy,
    },
    {
		type: "input",
		name: "gasPrice",
		message: async (answers) => `Current gas price is  ${(await gasPrices)[answers.network]} gwei. Enter gas price:`,
		validate: (gasPrice) => gasPrice >= 0,
		when: (answers) => answers.action == main_question_choices[7] && answers.deploy,
    },
  ])
  .then(async (answers) => {
  	//console.log(answers);
  	if (answers.action == main_question_choices[0]) {
  		let futureContract = addressContract(answers.address, answers.nonce);
  		console.log(`Contract address: ${futureContract}`);
  	}
  	else if (answers.action == main_question_choices[1])
  		getWalletFromMnemonic(answers.mnemonic, answers.password, answers.number);
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
  	else if (answers.action == main_question_choices[6]) {
		let playground = new Playground({address: answers.address, pkey: ""}, "Polygon");

  		let future_nonce = answers.nonce;
  		let current_nonce = await playground.web3Helper.web3.eth.getTransactionCount(answers.address);
  		if (current_nonce > future_nonce)
  			console.log(`Attention! Current nonce: ${current_nonce}`);
  		else {
  			let futureContract = addressContract(answers.address, future_nonce);
	  		console.log(`Factory address on nonce ${future_nonce}: ${futureContract}`);
	  		playground.letsplay(futureContract, parseInt(answers.number), false);
  		}
  		
  	}
  	else if (answers.action == main_question_choices[7]) {
  		let wallet = new ethers.Wallet(answers.pkey);
  		let deployer = {
			address: wallet.address, 
			pkey: answers.pkey
		};
		let playground = new Playground(deployer, answers.network !== undefined ? answers.network : "Polygon");
		let check = await playground.checkFinalContract(answers.factory, parseInt(answers.number), answers.finalContract);
		if (check)
			playground.letsplay(answers.factory, parseInt(answers.number), answers.deploy, parseFloat(answers.gasPrice), false);
		else 
			console.log(`Didn't deploy because couldn't get the final contract ${answers.finalContract}`);
  	}
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Cannot render prompt");
    } else {
      console.log("Undefined error with prompt");
      console.log(error);
    }
  });
