import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { Contract } from "web3-eth-contract"

import { getUpdateAccounting } from '../yamUtils'

const useUpdateAccounting = (poolContract: Contract) => {
    const [accounting, setAccounting] = useState([])

    const fetchUpdateAccount = useCallback(async () => {
        setAccounting( await getUpdateAccounting(poolContract) )
    }, [poolContract])

    useEffect(() => {
        if (poolContract) {
            fetchUpdateAccount()
            let refreshInterval = setInterval(fetchUpdateAccount, 10000)
            return () => clearInterval(refreshInterval)
        }
    }, [poolContract, setAccounting])

    return accounting
}

export default useUpdateAccounting
