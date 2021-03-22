import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { getBalance } from '../utils/erc20'

const useTokenBalance = (tokenAddress: string, stakedBalance: BigNumber= new BigNumber(0)) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string, ethereum: provider } = useWallet()

  const fetchBalance = useCallback(async () => {
    const balance = await getBalance(ethereum, tokenAddress, account)
    setBalance(new BigNumber(balance))
  }, [account, ethereum, tokenAddress])

  useEffect(() => {
    if (account && ethereum) {
      fetchBalance()
      let refreshInterval = setInterval(fetchBalance, 10000000)
      return () => clearInterval(refreshInterval)
    }
  }, [account, ethereum, setBalance, tokenAddress, stakedBalance])

  return balance
}

export default useTokenBalance
