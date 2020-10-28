import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from "web3-eth-contract"

import { getTotalSupply } from '../utils/erc20'

const useTotalSupply = (contract: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account, ethereum }: { account: string, ethereum: provider } = useWallet()

  const fetchTotalSupply = useCallback(async () => {
    const balance = await getTotalSupply(ethereum, contract.options.address)
    setBalance(new BigNumber(balance))
  }, [contract, ethereum])

  useEffect(() => {
    if (account && ethereum && contract) {
      fetchTotalSupply()
      let refreshInterval = setInterval(fetchTotalSupply, 10000)
      return () => clearInterval(refreshInterval)
    }
  }, [contract, ethereum, setBalance])

  return balance
}

export default useTotalSupply
