
interface EnvironmentModel {

};
const DEV: EnvironmentModel = {
  accountUrl: "https://ropsten.etherscan.io/address/",
  rpcUrl: "https://ropsten.infura.io/v3/442d79a8a4a9491e90ae8b324a366c2b",
  chainId: 3,
  UNIRebase: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493",
  yam: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
  yamv2: "0x6A65963d5233383749CFC258F169A50dEb0aD1E0",
  rebase_ropsten:"0x6A65963d5233383749CFC258F169A50dEb0aD1E0",
  usdc_ropsten:"0x08889E6127BFD9496967d90110ECA238E224d5c0",
  tokengeyser_ropsten:"0xBaF33566575EE7f19C55E6D26f60A563Beaba5c0",
  rebase_usd_lp_pair_ropsten: "0x1d9967FA5D1F54a547afAec3B0362046F67a3493"
};

const PROD: EnvironmentModel = {
  accountUrl: "https://etherscan.io/address/",
  rpcUrl: "https://mainnet.eth.aragon.network/",
  chainId: 1,
  uniRpebase: "0x373483108f1f0aeaf1b56a73796f9dfa9824963c",
  yam: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
  yamv2: "0x4208D8d500B1643DcA98dD27bA6C0060BcA311c5",
  rebase_ropsten: "0x4208D8d500B1643DcA98dD27bA6C0060BcA311c5",
  usdc_ropsten: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  tokengeyser_ropsten: "0x8b32227FAF96e80aE917f7e961cFc2F72Ed6b463",
  rebase_usd_lp_pair_ropsten: "0x373483108F1f0AEAf1B56A73796f9dFa9824963c"
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
    Environment = DEV;
}

export default Environment;
