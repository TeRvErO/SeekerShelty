const rlp = require('rlp');
const keccak = require('keccak');
const ethWallet = require('ethereumjs-wallet');
let Contract = require('web3-eth-contract');
let {chains, Web3Helper, Web3} = require("./help_balances.js");

const sleep = async (milliseconds) => {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}

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

class Playground {
	constructor(deployer_account, network) {
		this.deployer_account = deployer_account;
		this.chainId = chains[network].chainId;
		this.web3 = new Web3(chains[network].rpc);
		this.web3Helper = new Web3Helper(deployer_account.address, network);
		Contract.setProvider(chains[network].rpc);
	}

	getPlayAddress(address, number) {
		let binary = number.toString(2);
		let next_nonce = 1;
		let next_contract_address = address;
		let log = "";
		for (let i = 0; i < binary.length; i++) {
			var last_address = next_contract_address;
			next_contract_address = addressContract(next_contract_address, next_nonce);
			log += `Number: ${binary[i]}. Last address: ${last_address}. Next contract address with nonce ${next_nonce} is ${next_contract_address}\n`;
			if (parseInt(binary[i]) == 1) {
				next_contract_address = last_address;
				next_nonce++;
			}
			else {
				next_nonce = 1;
				last_address = next_contract_address;
				next_contract_address = addressContract(next_contract_address, next_nonce);
				log += `Enter horizontal. Last address: ${last_address}. Next contract address with nonce ${next_nonce} is ${next_contract_address}\n`;
			}
		}
		if (next_nonce > 1) {
			next_contract_address = addressContract(next_contract_address, next_nonce);
			log += `Last address: ${last_address}. Next contract address with nonce ${next_nonce} is ${next_contract_address}`;
		}
		console.log(log);
		return next_contract_address;
	}

	async deployNext(current_address, deployer_nonce, next_nonce, gasPrice) {
		let ABI_factory = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"clone","type":"address"}],"name":"Deployment","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"autoDeploy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"autoDeploy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"withdrawEther","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"recipient","type":"address"}],"name":"withdrawTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];
		let contract = new Contract(ABI_factory, current_address);

		let data_deploy = await contract.methods.autoDeploy().encodeABI();
		let gwei = 10**9;
		if (this.deploy) {
			this.web3Helper.send_txEIP1559(this.deployer_account, 0, current_address, gasPrice*gwei, gasPrice*gwei, 600000, data_deploy, this.chainId, deployer_nonce);
			console.log("Sent tx with nonce: ", deployer_nonce);
			await sleep(500);
		}
		
		return addressContract(current_address, next_nonce);
	}

	async checkFinalContract(factory, number, final_contract) {
		let expected_final_contract = await this.letsplay(factory, number, false, true);
		return expected_final_contract.toLowerCase() == final_contract.toLowerCase();
	}

	async letsplay(factory, number, deploy, gasPrice, prediction=true) {
		this.deploy = deploy;
		let binary = number.toString(2);
		let next_contract_address = factory;
		let deployer_nonce = await this.web3Helper.web3.eth.getTransactionCount(this.deployer_account.address);
		let next_nonce = await this.web3Helper.web3.eth.getTransactionCount(factory);
		let count = 1;
		if (!prediction && next_nonce == 0) {
			console.log(`Factory is not deployed!!!`);
			return -1;
		}
		if (!prediction && next_nonce > 1) {
			console.log(`Factory is already used!!!`);
			return -1;
		}
		let log = "";
		for (let i = 0; i < binary.length; i++) {
			var last_address = next_contract_address;
			next_contract_address = await this.deployNext(next_contract_address, deployer_nonce, next_nonce, gasPrice);
			deployer_nonce++;
			log += `${count}. Number: ${binary[i]}. Last address: ${last_address}. Next contract address with nonce ${next_nonce} is ${next_contract_address}\n`;
			count++;
			if (parseInt(binary[i]) == 1) {
				next_contract_address = last_address;
				next_nonce++;
			}
			else {
				next_nonce = 1;
				last_address = next_contract_address;
				next_contract_address = await this.deployNext(next_contract_address, deployer_nonce, next_nonce, gasPrice);
				deployer_nonce++;
				log += `${count}. Enter horizontal. Last address: ${last_address}. Next contract address with nonce ${next_nonce} is ${next_contract_address}\n`;
				count++;
			}
		}
		if (next_nonce > 1) {
			next_contract_address = await this.deployNext(next_contract_address, deployer_nonce, next_nonce, gasPrice);
			log += `${count}. Last address: ${last_address}. Next contract address with nonce ${next_nonce} is ${next_contract_address}\n`;
		}
		//console.log(log);
		console.log(`Final contract is ${next_contract_address} for number ${number}. It needs ${count} transactions`);
		return next_contract_address;
	}

}


module.exports = {addressContract, vanityAddress, Playground};
