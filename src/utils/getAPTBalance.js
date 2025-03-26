import store from '../store'
import BigNumber from 'bignumber.js'
const getAPTBalance = async (coin) => {
  const address = store.state.wallet.address
  const aptos = require("aptos");
  const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.mainnet.aptoslabs.com";
  const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://fullnode.mainnet.aptoslabs.com";
  const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";
  const client = new aptos.AptosClient(NODE_URL);
  const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);
  let resources = await client.getAccountResources(address);
  let accountResource = resources.find((r) => r.type === aptosCoin);
  let balance = parseInt(accountResource.data.coin.value);
  balance = BigNumber(balance).div(10 ** 8).toString()
  return balance
}
export default getAPTBalance