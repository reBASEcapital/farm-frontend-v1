import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import { yam as yamAddress } from '../../constants/tokenAddresses'
import { rebase_ropsten, rebase_usd_lp_pair_ropsten } from '../../constants/tokenAddresses'

import useYam from '../../hooks/useYam'

import { bnToDec } from '../../utils'
import { getPoolContracts, getEarned } from '../../yamUtils'

import Context from './context'
import { Farm } from './types'

//TODO:Super Hack got rid of all pools except for Ampl. We will use Ampl for Rebase
const NAME_FOR_POOL: { [key: string]: string } = {
  rebase_pool: 'REBASE-USDC'
}

const ICON_FOR_POOL: { [key: string]: string } = {
  rebase_pool: '🎖'
}

const SORT_FOR_POOL: { [key: string]: number } = {
  rebase_pool: 1
}

const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const [unharvested, setUnharvested] = useState(0)

  const yam = useYam()
  const { account } = useWallet()

  const fetchPools = useCallback(async () => {
    const pools: { [key: string]: Contract} = await getPoolContracts(yam)
    const farmsArr: Farm[] = []
    const poolKeys = Object.keys(pools)

    for (let i = 0; i < poolKeys.length; i++) {
      const poolKey = poolKeys[i]
      const pool = pools[poolKey]
      let tokenKey = poolKey.replace('_pool', '')
      if (tokenKey === 'eth') {
        tokenKey = 'weth'
      /*
      } else if (tokenKey === 'ampl') {
        tokenKey = 'ampl_eth_uni_lp'
      }
      */
      } else if (tokenKey === 'rebase') {
        tokenKey = 'rebase_usdc_uni_v2_lp'
      }
      else if (tokenKey === 'ycrv') {
        tokenKey = 'ycrv_yam_uni_lp'
      }

      const method = pool.methods[tokenKey]
      try {
        let tokenAddress = ''
        if (method) {
          tokenAddress = await method().call()
        } else if (tokenKey === 'ycrv_yam_uni_lp') {
          tokenAddress = '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8'
        } else if ( tokenKey == 'rebase_usdc_uni_v2_lp') {
          tokenAddress = rebase_usd_lp_pair_ropsten
        }
        farmsArr.push({
          contract: pool,
          name: NAME_FOR_POOL[poolKey],
          depositToken: tokenKey,
          depositTokenAddress: tokenAddress,
          earnToken: 'REBASE',
          earnTokenAddress: rebase_ropsten,
          icon: ICON_FOR_POOL[poolKey],
          id: tokenKey,
          sort: SORT_FOR_POOL[poolKey]
        })
      } catch (e) {
        console.log(e)
      }
    }
    farmsArr.sort((a, b) => a.sort < b.sort ? 1 : -1)
    setFarms(farmsArr)
  }, [yam, setFarms])

  useEffect(() => {
    if (yam) {
      fetchPools()
    }
  }, [yam, fetchPools])

  useEffect(() => {
    /*
    async function fetchUnharvested () {
      const unharvestedBalances = await Promise.all(farms.map(async (farm: Farm) => {
        const earnings = await getEarned(yam, farm.contract, account)
        return bnToDec(earnings)
      }))
      const totalBal = unharvestedBalances.reduce((acc, val) => acc + val)
      setUnharvested(totalBal)
    }
    if (account && farms.length && yam) {
      fetchUnharvested()
    }
    */
  }, [account, farms, setUnharvested, yam])

  return (
    <Context.Provider value={{
      farms,
      unharvested,
    }}>
      {children}
    </Context.Provider>
  )
}

export default Farms
