let infura_id = "";

let chains = {
	"Ethereum": {
		rpc: `https://mainnet.infura.io/v3/${infura_id}`,
		currency: "ETH",
		chainId: 1,
		contracts: [
			"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //usdc
			"0xdAC17F958D2ee523a2206206994597C13D831ec7", //usdt
			"0x6B175474E89094C44Da98b954EedeAC495271d0F", //dai
		]
	},
	"Ropsten": {
		rpc: `https://ropsten.infura.io/v3/${infura_id}`,
		currency: "ETH",
		chainId: 3,
	},
	"Optimism": {
		rpc: `https://optimism-mainnet.infura.io/v3/${infura_id}`,
		currency: "OETH",
		chainId: 10,
	},
	"Polygon": {
		rpc: `https://polygon-mainnet.infura.io/v3/${infura_id}`,
		currency: "MATIC",
		chainId: 137,
	},
	"Arbitrum": {
		rpc: `https://arbitrum-mainnet.infura.io/v3/${infura_id}`,
		currency: "AETH",
		chainId: 42161,
	},
}

module.exports = {chains};