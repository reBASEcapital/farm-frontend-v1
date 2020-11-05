import { useCallback, useEffect, useState } from 'react'


import { Contract } from "web3-eth-contract"
import { getUnlockRate } from '../yamUtils'

const useUnlockRate = (poolContract: Contract, seconds: number) => {
    const [unlockRate, setUnlockRate] = useState<number>(0);

    const fetchUnlockRate = useCallback(async () => {
            const unlockRate = await getUnlockRate(poolContract, seconds);
            setUnlockRate(unlockRate);

    }, [poolContract,seconds])

    useEffect(() => {
        if (poolContract) {
            fetchUnlockRate()
            let refreshInterval = setInterval(fetchUnlockRate, 10000)
            return () => clearInterval(refreshInterval)
        }
    }, [poolContract, setUnlockRate, seconds])

    return unlockRate
}

export default useUnlockRate
