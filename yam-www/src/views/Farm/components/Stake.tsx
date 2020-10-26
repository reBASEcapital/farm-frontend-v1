import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Contract } from 'web3-eth-contract'

import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import { AddIcon, RemoveIcon } from '../../../components/icons'
import IconButton from '../../../components/IconButton'
import Label from '../../../components/Label'
import Value from '../../../components/Value'

import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import useRebaseHarvest from '../../../hooks/useRebaseHarvest'
import useTokenBalanceLP from '../../../hooks/useTokenBalanceLP'
import getTotalSupply from '../../../hooks/useTotalSupply'


import getTotalStaked from '../../../hooks/useTotalStaked'
import { getDisplayBalance, getFullDisplayBalanceBigInt } from '../../../utils/formatBalance'
import {getPrice, getTotalStakedValue} from  '../../../utils/formatPrice'
import {getTotalValue} from  '../../../utils/formatTotalValue'


import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import farm from "../../../assets/img/rebase-icon.png";
import Environment from "../../../Environment";

interface StakeProps {
  poolContract: Contract,
  tokenContract: Contract,
  tokenName: string
}

const Stake: React.FC<StakeProps> = ({
  poolContract,
  tokenContract,
  tokenName,
}) => {

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [trigger, setTrigger] = useState(true);
  const allowance = useAllowance(tokenContract, poolContract)
  const { onApprove } = useApprove(tokenContract, poolContract)

  const tokenBalance = useTokenBalance(tokenContract.options.address)
  const stakedBalance = useStakedBalance(poolContract, trigger)

  const { onStake } = useStake(poolContract, tokenName);
  const { onUnstake } = useUnstake(poolContract)
  const { onRebaseHarvest } = useRebaseHarvest(poolContract)
  const rebaseBalance = useTokenBalance(Environment.yamv2)

  //acquiring the total amount of rebase in a the uniswap liquidity pool on UniSwap. This is not the Geyser.
  const rebaseUniswapPairBalance = useTokenBalanceLP(Environment.yamv2, tokenContract)

  //acquiring the total amount of usdc in a the uniswap liquidity pool on UniSwap. This is not the Geyser.
  const usdcUniswapPairBalance = useTokenBalanceLP(Environment.usdc_ropsten, tokenContract)

  //values obtained from the rebase uniswap pool is not formatted correctly. use 9 decimails
  const rebaseUniswapPairBalanceDisplay= getDisplayBalance( rebaseUniswapPairBalance, 9)

  //values obtained from the usdc uniswap pool is not formatted correctly. use 6 decimails
  const usdcUniswapPairBalanceDisplay= getDisplayBalance( usdcUniswapPairBalance, 6)

  //generate the price from Uniswap.
  const rebasePriceDisplay = getPrice (usdcUniswapPairBalanceDisplay,rebaseUniswapPairBalanceDisplay )

  //get the total value using the amount of rebase and usdc in the uniswap liquidity pool and times by the price
  const totalValueLP = getTotalValue( rebaseUniswapPairBalanceDisplay, usdcUniswapPairBalanceDisplay, rebasePriceDisplay)

  //get the Total Supply of Uniswap tokens
  const uniswapTotalSupply = getTotalSupply(tokenContract )

  //get the total supply of uniswap tokens in the geyser
  const geyserTotalSupply = getTotalStaked(poolContract )

  //get the total staked value by taking the total value and multiplying by the ratio of geyser over uniwsap total
  const totalStakedValue = getTotalStakedValue( totalValueLP, uniswapTotalSupply, geyserTotalSupply)
  //const rebaseGeyserBalance = useTokenBalanceLP(Environment.yamv2, tokenContract)
  //const usdcUniswapPairBalance = useTokenBalanceLP(Environment.usdc_ropsten, tokenContract)

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={async (val: string) =>{
        await onStake(val);
        setTrigger((old) => !old);
      }}
      tokenName={tokenName}
    />
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={async (val: string) =>{
          await onUnstake(val);
          setTrigger((old) => !old);
        }}
      tokenName={tokenName}
    />
  )

  const handleRebaseHarvest = useCallback(async ( val: BigNumber) => {
    try {
      const newVal = getFullDisplayBalanceBigInt(val)
      const amount = newVal.toFixed()
      //const newVal = getFullDisplayBalanceBigInt(val).multipliedBy(.01)
      //const amount = newVal.toFixed()
      const txHash = await onRebaseHarvest(amount)
      setTrigger((old) => !old);
    } catch (e) {
      console.log(e)
    }
  }, [onRebaseHarvest])

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>🌱</CardIcon>
            <Value value={getDisplayBalance(stakedBalance)} />
            <Label text={`${tokenName} Staked`} />
          </StyledCardHeader>
          <StyledCardActions>
            {!allowance.toNumber() ? (
              <Button
                disabled={requestedApproval}
                onClick={handleApprove}
                text={`Approve ${tokenName}`}
              />
            ) : (
              <>
                <Button onClick={() => handleRebaseHarvest(stakedBalance)} text="Harvest" disabled={stakedBalance.eq(new BigNumber(0))} />
                <StyledActionSpacer />
                <Button
                    disabled={stakedBalance.eq(new BigNumber(0))}
                    text="Unstake"
                    onClick={onPresentWithdraw}
                />
                <StyledActionSpacer />
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon />
                  </IconButton>
              </>
            )}
          </StyledCardActions>
          <StyledActionSpacer/>
          <StyledCardHeader>
            <CardIcon><span><img src={farm} height="42" style={{ marginTop: -4 }} /></span></CardIcon>
            <Value value={getDisplayBalance(rebaseBalance,9)} />
            <Label text="reB∆SE Balance" />
            <Value value={rebasePriceDisplay} />
            <Label text="reB∆SE Price" />
            <Value value={totalStakedValue} />
            <Label text="Total Staked Value" />


          </StyledCardHeader>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${props => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: ${props => props.theme.spacing[4]}px;
  width: ${props => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Stake
