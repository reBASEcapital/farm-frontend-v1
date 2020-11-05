import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { Contract } from "web3-eth-contract"

import { getTotalStakingShares } from '../yamUtils'

const useTotalStakingShare = (poolContract: Contract) => {
    const [totalStakingShare, setTotalStakingShare] = useState(new BigNumber(0))

    const fetchTotalStaked = useCallback(async () => {
        const totalStakingShare = await getTotalStakingShares(poolContract)
        setTotalStakingShare(new BigNumber(totalStakingShare))
    }, [poolContract])

    useEffect(() => {
        if (poolContract) {
            fetchTotalStaked()
            let refreshInterval = setInterval(fetchTotalStaked, 10000)
            return () => clearInterval(refreshInterval)
        }
    }, [poolContract, setTotalStakingShare])

    return totalStakingShare
}

export default useTotalStakingShare
