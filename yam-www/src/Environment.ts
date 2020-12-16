
interface EnvironmentModel {

};
const DEV: EnvironmentModel = {
  accountUrl: "https://ropsten.etherscan.io/address/",
  rpcUrl: "https://ropsten.infura.io/v3/442d79a8a4a9491e90ae8b324a366c2b",
  dashboardEndpoint: "http://52.33.23.161:3000/api",
  chainId: 3,
  yam: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
  yamv2: "0x6A65963d5233383749CFC258F169A50dEb0aD1E0",
  rebase:"0x6A65963d5233383749CFC258F169A50dEb0aD1E0",
  usdc:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  eth:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  dai:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  tokengeyser_rebase_usd:"0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  tokengeyser_rebase_eth: "0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  tokengeyser_rebase_dai: "0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  rebase_usd_lp_pair: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493",
  rebase_eth_lp_pair: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493",
  rebase_dai_lp_pair: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493"
};

const PROD: EnvironmentModel = {
  accountUrl: "https://etherscan.io/address/",
  rpcUrl: "https://mainnet.eth.aragon.network/",
  dashboardEndpoint: "https://api.rebase.capital/api",
  chainId: 1,
  yam: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
  yamv2: "0x4208D8d500B1643DcA98dD27bA6C0060BcA311c5",
  rebase: "0x4208D8d500B1643DcA98dD27bA6C0060BcA311c5",
  usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  eth: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  dai: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  tokengeyser_rebase_usd: "0x8b32227FAF96e80aE917f7e961cFc2F72Ed6b463",
  tokengeyser_rebase_eth: "0x3Bc331875F585b6C9059b61f22704d50c932616B",
  //tokengeyser_rebase_dai: "0xa0ac0ce7cd592fd9df7ceb10da773d0dd0525164"
  rebase_usd_lp_pair: "0x373483108F1f0AEAf1B56A73796f9dFa9824963c",
  rebase_eth_lp_pair: "0x885752b533e06eab14699ffcc91bc850db7aa5ad"
  //rebase_dai_lp_pair: "0xf7ef59bfc46f3870da994373f5fb32654b9518dd"
};

let Environment: any;
switch (process.env.REACT_APP_ENVIRONMENT) {
  case 'DEV':
    Environment = DEV;
    break;
  case 'PROD':
    Environment = PROD;
    break;
  default:
    Environment = PROD;
}

export default Environment;
