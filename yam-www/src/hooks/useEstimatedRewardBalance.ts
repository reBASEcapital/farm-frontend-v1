import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { Contract } from "web3-eth-contract"

import { getUnstakeQuery } from '../yamUtils'

const useEstimatedRewardBalance = (poolContract: Contract, balance: BigNumber) => {
    const [reward, setReward] = useState(new BigNumber(0))

    const fetchReward = useCallback(async () => {
        const reward = await getUnstakeQuery(poolContract, balance)
        setReward(new BigNumber(reward))
    }, [poolContract, balance, setReward])

    useEffect(() => {
        if (poolContract) {
            fetchReward()
            let refreshInterval = setInterval(fetchReward, 10000)
            return () => clearInterval(refreshInterval)
        }
    }, [poolContract, fetchReward])

    return balance.isEqualTo(new BigNumber(0)) ? new BigNumber(0) : reward;
}

export default useEstimatedRewardBalance
