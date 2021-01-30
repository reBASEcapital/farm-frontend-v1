import React from 'react'
import styled from 'styled-components'
import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'

interface RewardModalProps extends ModalProps {
    quantity: number,
  }

const RewardModal: React.FC<RewardModalProps> = ({ onDismiss, quantity }) => {
  return (
    <Modal>
        <ModalTitle text="Stimulus reward" />
        <ModalContent>
            <Spacer />

            <StyledText>
            {quantity > 0 ? `Quantity rewarded: ${quantity} REBASE`: "No reward available."}
            </StyledText>

            <Spacer />
            
        </ModalContent>
        <ModalActions>
            <Button onClick={onDismiss} text="Close" />
        </ModalActions>
    </Modal>
  )
}

const StyledText = styled.div`
  align-items: center;
  color: ${props => props.theme.color.blue[200]};
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 44px;
`


export default RewardModal
