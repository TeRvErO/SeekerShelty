let Web3 = require('web3');
let Contract = require('web3-eth-contract');
let {chains} = require("./chains.js");

class Web3Helper {
	constructor(address, network) {
		this.address = address;
		this.wallet = {address: address};
		this.contract_addresses = chains[network].contracts !== undefined ? chains[network].contracts : [];
		this.chainId = chains[network].chainId;
		this.web3 = new Web3(chains[network].rpc);
		Contract.setProvider(chains[network].rpc);
		this.currency = chains[network].currency;
	}

	async balanceNative() {
		let balance = await this.web3.eth.getBalance(this.address);
		console.log(`${balance / 10**18} ${this.currency}`);
	}

	async balanceERC20(contract_address, erc721=false) {
		let ABI_token = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferWithFee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_i","type":"uint256"}],"name":"heapEntry","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelistTo","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setPauseMover","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"lastWinnerPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"whitelistFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"inited","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"heapTop","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DEFAULT_FEE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isTopHolder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"doLottery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_blacklisted","type":"bool"}],"name":"setBlacklistedLottery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_fee","type":"uint256"}],"name":"setFromAddressFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"topSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"fromAddressFees","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_cat","type":"uint256"}],"name":"getNonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFromWithFee","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"toAddressFees","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"heap","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_whitelisted","type":"bool"}],"name":"setWhitelistedTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"heapIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CALLER_REWARD_FEE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"blacklistLottery","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_fee","type":"uint256"}],"name":"setToAddressFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"periodSeconds","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodOffset","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"heapSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_whitelisted","type":"bool"}],"name":"setWhitelistedFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_addr","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Winner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"},{"indexed":false,"name":"_whitelisted","type":"bool"}],"name":"SetWhitelistedFrom","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"},{"indexed":false,"name":"_whitelisted","type":"bool"}],"name":"SetWhitelistedTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"},{"indexed":false,"name":"_whitelisted","type":"bool"}],"name":"SetBlacklistedLottery","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"},{"indexed":false,"name":"_fee","type":"uint256"}],"name":"SetFromAddressFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_addr","type":"address"},{"indexed":false,"name":"_fee","type":"uint256"}],"name":"SetToAddressFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"}],"name":"TransferOwnership","type":"event"}]
		let contract = new Contract(ABI_token, contract_address);

		let name = await contract.methods.name().call();
		let symbol = await contract.methods.symbol().call();
		let decimals = erc721 ? 0 : await contract.methods.decimals().call();
		if (symbol.length > 10 && symbol.slice(0, 2) == "0x")
			symbol = this.web3.utils.hexToAscii(symbol);
		let name_token = `${name} (${symbol})`;

		let balance = await contract.methods.balanceOf(this.address).call();
		console.log(`${balance / 10 ** decimals} ${name_token}`);
	}

	async getGasPrice() {
		return (await this.web3.eth.getGasPrice()) / 10**9;
	}

	async getBalances() {
		console.log("Balances:");
		console.log("Nonce: ", await this.web3.eth.getTransactionCount(this.address) )
		console.log(`Gas price: ${(await this.web3.eth.getGasPrice())/ 10**9} gwei`)
		this.balanceNative();
		for (let contract_address of this.contract_addresses)
			this.balanceERC20(contract_address);
			
	}

	async send_txEIP1559(account, value, goal, maxFeePerGas, maxPriorityFeePerGas, gas, data, chainId, nonce=-1) {
		if (nonce == -1) {
			nonce = await this.web3.eth.getTransactionCount(account.address);
		}
		let transaction = {
			value: this.web3.utils.toWei(value.toString()),
			to: this.web3.utils.toChecksumAddress(goal),
			maxFeePerGas: maxFeePerGas,
			maxPriorityFeePerGas: maxPriorityFeePerGas,
			gas: gas,
			data: data,
			chainId: chainId,
			nonce: nonce,
			type: 2,
		}
		let signed = await this.web3.eth.accounts.signTransaction(transaction, account.pkey);
		this.web3.eth.sendSignedTransaction(signed.rawTransaction);
	}
}


async function getGasPrices() {
	let gasPrices = {};
	for (let network in chains) {
		let web3Helper = new Web3Helper("", network);
		gasPrices[network] = await web3Helper.getGasPrice();
	}
	return gasPrices;
}

module.exports = {chains, Web3Helper, Web3, getGasPrices};
