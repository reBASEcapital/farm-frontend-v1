import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from "web3-eth-contract"

import { getUnstakeQuery } from '../yamUtils'

const useEstimatedRewardBalance = (poolContract: Contract, balance: number) => {
    const [reward, setReward] = useState(new BigNumber(0))

    const fetchReward = useCallback(async () => {
        const reward = await getUnstakeQuery(poolContract, balance)
        setReward(new BigNumber(reward))
    }, [poolContract, balance])

    useEffect(() => {
        if (poolContract) {
            fetchReward()
            let refreshInterval = setInterval(fetchReward, 10000)
            return () => clearInterval(refreshInterval)
        }
    }, [poolContract, balance,  setReward])

    return reward
}

export default useEstimatedRewardBalance
