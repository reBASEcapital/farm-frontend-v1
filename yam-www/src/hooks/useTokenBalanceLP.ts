import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from "web3-eth-contract"

import { getBalance } from '../utils/erc20'

const useTokenBalanceLP = (tokenAddress: string, poolContract?: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string, ethereum: provider } = useWallet()

  const fetchPrice = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, poolContract.options.address)
    setBalance(new BigNumber(balance))
  }, [tokenAddress, ethereum, poolContract])

  useEffect(() => {
    if (account && ethereum) {
      fetchPrice()
      let refreshInterval = setInterval(fetchPrice, 10000000)
      return () => clearInterval(refreshInterval)
    }
  }, [tokenAddress, ethereum, setBalance, poolContract])

  return balance
}

export default useTokenBalanceLP
