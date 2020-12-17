import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import Environment from '../../Environment'

import useYam from '../../hooks/useYam'

import { bnToDec } from '../../utils'
import { getPoolContracts, getEarned } from '../../yamUtils'

import Context from './context'
import { Farm } from './types'

const NAME_FOR_POOL: { [key: string]: string } = {
  "rebase_usdc_uni_v2_lp": "REBASE-USDC",
  "rebase_eth_uni_v2_lp": "REBASE-ETH"
  //"rebase_dai_uni_v2_lp": "DAI"
}

const ICON_FOR_POOL: { [key: string]: string } = {
  rebase_usdc_uni_v2_lp: '🌱',
  rebase_eth_uni_v2_lp: '🌾'
  //rebase_dai_uni_v2_lp: '🌻'
}

const SORT_FOR_POOL: { [key: string]: number } = {
  rebase_usdc_uni_v2_lp: 2,
  rebase_eth_uni_v2_lp: 1
  //rebase_dai_uni_v2_lp: 3
}

const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const [unharvested, setUnharvested] = useState(0)

  const yam = useYam()
  const { account } = useWallet()

  const fetchPools = useCallback(async () => {
    const pools: Array<{ [key: string]: Contract | string}> = await getPoolContracts(yam)
    const farmsArr: Farm[] = []
    const poolKeys = Object.keys(pools)

    pools.forEach( async pool => {
      try {
        farmsArr.push({
          contract: pool.tokenContract as Contract,
          name: NAME_FOR_POOL[pool.uniToken as string],
          depositToken: pool.uniToken as string,
          depositTokenAddress: pool.uniAddr as string,
          earnToken: 'REBASE',
          tokenAddress: pool.tokenAddr as string,
          earnTokenAddress: Environment.rebase,
          icon: ICON_FOR_POOL[pool.uniToken as string],
          id: pool.uniToken as string,
          sort: SORT_FOR_POOL[pool.uniToken as string],
          provider: 'Uniswap'
        })
      } catch (e) {
        console.log(e)
      }
    });
    farmsArr.sort((a, b) => a.sort - b.sort)
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
