import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import { default as iziToast } from 'izitoast';
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { getEstimatedReward } from '../../../yamUtils'
import Spacer from '../../../components/Spacer'

interface DepositModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
  updateAccounting?: Array<number>,
  unlockRate?: number,
  totalStakingShare?: number,
  totalStaked?: number,
  userStaked?: number
}

const DepositModal: React.FC<DepositModalProps> = ({ max, onConfirm, onDismiss, tokenName = '', updateAccounting, unlockRate, totalStakingShare, totalStaked, userStaked }) => {
  const [val, setVal] = useState('');
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const estimatedReward = useMemo(() => {
    if(parseFloat(val) && unlockRate){
      return getEstimatedReward(2592000,parseFloat(val), totalStakingShare, totalStaked, updateAccounting, unlockRate, userStaked)
    } else {
      return 0;
    }
  }, [val])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
  }, [setVal])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const requestStake = async () => {
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
      <ModalTitle text={`Deposit ${tokenName}`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      {estimatedReward &&
      <StyledInfoCard>
      <StyledInfoCardContent>
        <InfoCardTitle>
            <div>Your Estimated Rewards</div>
        </InfoCardTitle>
        <Spacer size="sm"/>
        <b>{estimatedReward} REBASE / Month</b>
      </StyledInfoCardContent>
    </StyledInfoCard>    
      }
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
          <Button
              disabled={pendingTx}
              text={pendingTx ? '' : 'Confirm'}
              spinner={<span className="spinner-border"/>}
              onClick={requestStake}
          />
      </ModalActions>
    </Modal>
  )
}

const StyledMaxText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.blue[200]};
  display: flex;
  margin-right: ${props => props.theme.spacing[4]}px;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`

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

export default DepositModal
