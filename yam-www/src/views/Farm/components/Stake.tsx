import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Contract } from 'web3-eth-contract'

import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import { AddIcon } from '../../../components/icons'
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
import useAPY from '../../../hooks/useAPY'

import { getDisplayBalance, getFullDisplayBalanceBigInt } from '../../../utils/formatBalance'


import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import useUpdateAccounting from '../../../hooks/useUpdateAccounting'
import useUnlockRate from '../../../hooks/useUnlockRate'
import useTotalStakingShare from '../../../hooks/useTotalStakingShare'
import useTotalStaked from '../../../hooks/useTotalStaked'

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
  const apy = useAPY(poolContract, tokenContract)
  const updateAccounting = useUpdateAccounting(poolContract);
  const unlockRate = useUnlockRate(poolContract, 2592000);
  const totalStakingShare = useTotalStakingShare(poolContract).toNumber();
  const totalStaked = useTotalStaked(poolContract).toNumber();
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      updateAccounting={updateAccounting}
      unlockRate={unlockRate}
      totalStakingShare={totalStakingShare}
      totalStaked={totalStaked}
      userStaked={stakedBalance.toNumber()}
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
      poolContract={poolContract}
      onConfirm={async (val: string) =>{
          await onUnstake(val);
          setTrigger((old) => !old);
        }}
      tokenName={tokenName}
    />
  )

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
            {!parseFloat(apy) && <Value value={`--.--%`} />}
            {!!parseFloat(apy) && <Value value={`${apy}%`} />}
            <Label text={`APY`} />
          </StyledCardHeader>
          <div>
            <StyledCardActions>
              {!allowance.toNumber() ? (
                <Button
                  disabled={requestedApproval}
                  onClick={handleApprove}
                  text={`Approve ${tokenName}`}
                />
              ) : (
                <>
                  <StyledActionSpacer />
                  <Button
                      text="Stake"
                      onClick={onPresentDeposit}
                  />
                  <StyledActionSpacer />
                  <Button
                      disabled={stakedBalance.eq(new BigNumber(0))}
                      text="Unstake"
                      onClick={onPresentWithdraw}
                  />
                </>
              )}
            </StyledCardActions>
            <StyledDisclaimer>APY is estimated for a new deposit over the next 60 days, and does not account for gains or
              losses from holding liquidity tokens</StyledDisclaimer>
          </div>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    word-break: break-all
  }
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

const StyledInfoCard = styled.div`
display: flex;
align-self: flex-start;
max-height: 90px;
width: 100%;
background-color: ${props => props.theme.color.grey[900]};
border: 1px solid ${props => props.theme.color.grey[500]};
border-radius: 12px;
color: ${props => props.theme.color.grey[500]};
cursor: pointer;
flex: 1;
flex-direction: column;
justify-content: space-between;
border-radius: 12px;
margin: ${props => props.theme.spacing[4]}px 0;
&:hover {
    background-color: ${props => props.theme.color.grey[800]};
  }
`

const StyledInfoCardContent =  styled.div`
display: flex;
flex: 1;
flex-direction: column;
color: ${props => props.theme.color.grey[100]};
padding: ${props => props.theme.spacing[1]}px ${props => props.theme.spacing[2]}px;
@media (max-width: 768px) {
    padding: ${props => props.theme.spacing[1]}px ${props => props.theme.spacing[1]}px;
  }
`

const InfoCardTitle =  styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  `

const Info = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.color.white};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
`
const StyledDisclaimer = styled.div`
  margin-top: 25px;
  color: ${props => props.theme.color.grey[100]};
  font-size: 0.6em;
`
export default Stake
