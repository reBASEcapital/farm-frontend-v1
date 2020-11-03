import React, { useCallback, useMemo, useState } from 'react'

import BigNumber from 'bignumber.js'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

import { getFullDisplayBalance } from '../../../utils/formatBalance'
import {default as iziToast} from "izitoast";
import { getSubtractEstimatedReward } from '../../../yamUtils'
import Spacer from '../../../components/Spacer'
import styled from 'styled-components'
import useEstimatedRewardBalance from '../../../hooks/useEstimatedRewardBalance'
import { Contract } from 'web3-eth-contract'
import { bigNumberify } from 'ethers/utils'

interface WithdrawModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
  poolContract: Contract,
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '', poolContract}) => {
  const [val, setVal] = useState('')
  const [valBigN, setValBigN] = useState(new BigNumber(0))
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const withdraw = useEstimatedRewardBalance(poolContract, new BigNumber((parseFloat(val) || 0)).multipliedBy(1000000000000000000)).div(1000000000)

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
    setValBigN(new BigNumber((parseFloat(e.currentTarget.value) || 0)).multipliedBy(1000000000000000000).div(1000000000));
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const requestUnstake = async () => {
    if(!val || !parseFloat(val)){
      return iziToast.error({
        message: 'Insert a value greater than 0',
        position: 'bottomLeft',
        displayMode: 2,
        closeOnClick: true
      });
    }
    setPendingTx(true)
    await onConfirm(val)
    setPendingTx(false)
    onDismiss()
  };

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
      />
      {!withdraw.isEqualTo(new BigNumber(0)) &&
        <StyledInfoCard>
          <StyledInfoCardContent>
            <InfoCardTitle>
              <div>{max.isGreaterThanOrEqualTo(valBigN) ? "Your Estimated Rewards" : "Cannot withdraw more than your deposit"}</div>
            </InfoCardTitle>
            <Spacer size="sm"/>
            {max.isGreaterThanOrEqualTo(valBigN) && <b>{withdraw.toNumber()} REBASE</b>}
          </StyledInfoCardContent>
        </StyledInfoCard>    
        }
      <ModalActions>
          <Button text="Cancel" variant="secondary" onClick={onDismiss} />
          <Button
              disabled={pendingTx || !max.isGreaterThanOrEqualTo(valBigN)}
              text={pendingTx ? '' : 'Confirm'}
              spinner={<span className="spinner-border"/>}
              onClick={requestUnstake}
          />
      </ModalActions>
    </Modal>
  )
}

const StyledInfoCard = styled.div`
display: flex;
background-color: ${props => props.theme.color.grey[900]};
border: 1px solid ${props => props.theme.color.grey[500]};
border-radius: 12px;
color: ${props => props.theme.color.grey[500]};
cursor: pointer;
flex: 1;
flex-direction: column;
justify-content: space-between;
border-radius: 12px;
margin: ${props => props.theme.spacing[4]}px;
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


export default WithdrawModal
