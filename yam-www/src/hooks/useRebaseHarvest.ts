import { useCallback } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from "web3-eth-contract"

import { rebaseHarvest } from '../yamUtils'

const useRebaseHarvest = (poolContract: Contract) => {
  const { account } = useWallet()

  const handleRebaseHarvest = useCallback(async (amount: string) => {
    const txHash = await rebaseHarvest(poolContract, amount, account)
    console.log(txHash)
  }, [account, poolContract])

  return { onRebaseHarvest: handleRebaseHarvest }
}

export default useRebaseHarvest
