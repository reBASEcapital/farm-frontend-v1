import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { Contract } from "web3-eth-contract"

import { getUnstakeQuery } from '../yamUtils'
import { useWallet } from 'use-wallet'

const useEstimatedRewardBalance = (poolContract: Contract, balance: BigNumber) => {
    const [reward, setReward] = useState(new BigNumber(0))
    const { account }: { account: string } = useWallet()
    const fetchReward = useCallback(async () => {
        try{
            const reward = await getUnstakeQuery(poolContract, balance, account)
            setReward(new BigNumber(reward))
        }catch (e){
            console.log(e)
        }

    }, [account, poolContract, balance])

    useEffect(() => {
        if (account && poolContract) {
            fetchReward()
            let refreshInterval = setInterval(fetchReward, 10000)
            return () => clearInterval(refreshInterval)
        }
    }, [account, poolContract, balance])

    return balance.isEqualTo(new BigNumber(0)) ? new BigNumber(0) : reward;
}

export default useEstimatedRewardBalance
