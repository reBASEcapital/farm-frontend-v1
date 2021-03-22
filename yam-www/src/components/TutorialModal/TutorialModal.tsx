import React, { useCallback, useState, useMemo } from 'react'

import Button from '../Button'
import CardIcon from '../CardIcon'
import Modal, { ModalProps } from '..//Modal'
import ModalActions from '..//ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'

interface TutorialModal extends ModalProps {
  onConfirm: () => void
}

const TutorialModal: React.FC<TutorialModal> = ({ onConfirm, onDismiss }) => {

  const [step, setStep] = useState('tutorial')

  const handleConfirm = useCallback(() => {
    onConfirm()
    onDismiss()
  }, [onConfirm, onDismiss])

  const modalContent = useMemo(() => {
      return (
        <div>
          <p>Yield farming basics!</p>
          <p>"Add liquidity" to a supported pool, such as the REBASE-BNB pool on Pancakeswap. This action creates a special
          token called a liquidity pool (LP) share. Once you have an LP share, come back to the farm and you can stake it in
          the associated plot and watch your earnings grow!</p>
            <p>👨🏽‍🌾 This makes you a farmer! Farmers earn additional REBASE that goes straight to their account.</p>
          <p>You can always use the earned REBASE to add even more liquidity, receiving more LP shares, which you can stake to earn more REBASE faster!</p>
            <p>The longer you stake, the more you earn and the earning rate increases after a period of time, currently set to 7 weeks for additional bonus earnings!</p>
        </div>
      )
  }, [step])

  const button = useMemo(() => {
      return (
        <Button text="I understand" onClick={handleConfirm} />
      )
  }, [setStep, step, handleConfirm])

  return (
    <Modal>
      <ModalTitle text={`How to farm!`} />
      <CardIcon>🌾🚜</CardIcon>
      <ModalContent>
        {modalContent}
      </ModalContent>
      <ModalActions>
        {button}
      </ModalActions>
    </Modal>
  )
}


export default TutorialModal
