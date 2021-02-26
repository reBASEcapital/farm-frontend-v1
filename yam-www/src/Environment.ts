
interface EnvironmentModel {

};
const DEV: EnvironmentModel = {
  accountUrl: "https://ropsten.etherscan.io/address/",
  transactionsUrl: "https://ropsten.etherscan.io/tx/",
  rpcUrl: "https://ropsten.infura.io/v3/442d79a8a4a9491e90ae8b324a366c2b",
  dashboardEndpoint: "http://52.33.23.161:3000/api",
  chainId: 3,
  yam: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
  yamv2: "0x6a65963d5233383749cfc258f169a50deb0ad1e0",
  rebase:"0x6a65963d5233383749cfc258f169a50deb0ad1e0",
  usdc:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  eth:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  dai:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  usdc_decimals:"6",
  eth_decimals:"18",
  tokengeyser_rebase_usd:"0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  tokengeyser_rebase_eth: "0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  tokengeyser_rebase_dai: "0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  rebase_usd_lp_pair: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493",
  rebase_eth_lp_pair: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493",
  rebase_dai_lp_pair: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493",
  orchestrator_address: "0x0667465F8d3dAB4Ef72dCAa2AcBFc4E5B73fBd98",
  cpi_oracle_address: "0x3d84C09B5B791c27615352423E050d7Aa6e4b414",
  market_oracle_address: "0x0bdd588933F37bB629601B3572Ea2c757581454D"
};

const PROD: EnvironmentModel = {
  accountUrl: "https://etherscan.io/address/",
  transactionsUrl: "https://etherscan.io/tx/",
  rpcUrl: "https://mainnet.eth.aragon.network/",
  dashboardEndpoint: "https://api.rebase.capital/api",
  chainId: 1,
  yam: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
  yamv2: "0xab7e91a32F4fE4c6b8BE7603D4Cc10c8D6FdF3F4",
  rebase: "0xab7e91a32F4fE4c6b8BE7603D4Cc10c8D6FdF3F4",
  usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  eth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  dai: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  usdc_decimals:"6",
  eth_decimals:"18",
  tokengeyser_rebase_usd: "0x8b32227FAF96e80aE917f7e961cFc2F72Ed6b463",
  tokengeyser_rebase_eth: "0x3Bc331875F585b6C9059b61f22704d50c932616B",
  //tokengeyser_rebase_dai: "0xa0ac0ce7cd592fd9df7ceb10da773d0dd0525164"
  rebase_usd_lp_pair: "0x373483108F1f0AEAf1B56A73796f9dFa9824963c",
  rebase_eth_lp_pair: "0x885752b533e06eab14699ffcc91bc850db7aa5ad",
  //rebase_dai_lp_pair: "0xf7ef59bfc46f3870da994373f5fb32654b9518dd"
  orchestrator_address: "0xD429a707c81bAFd44e3648c606AF3D061F5EE19C",
  cpi_oracle_address: "0x1F5e752BC3Cab5e0773712675faC1433dd181088",
  market_oracle_address: "0x49A46815BC73592438917f6eda1a436cD6ec3C66"
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
