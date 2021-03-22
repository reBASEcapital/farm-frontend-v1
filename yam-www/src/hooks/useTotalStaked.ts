import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from "web3-eth-contract"

import { totalStaked } from '../yamUtils'

const useTotalStaked = (poolContract: Contract) => {
  const [balance, setBalance] = useState(new BigNumber(0))

  const fetchTotalStaked = useCallback(async () => {
    const balance = await totalStaked(poolContract)
    setBalance(new BigNumber(balance))
  }, [poolContract])

  useEffect(() => {
    if (poolContract) {
      fetchTotalStaked()
      let refreshInterval = setInterval(fetchTotalStaked, 10000)
      return () => clearInterval(refreshInterval)
    }
  }, [poolContract, setBalance])

  return balance
}

export default useTotalStaked
