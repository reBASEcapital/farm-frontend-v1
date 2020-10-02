import React, { useCallback, useMemo, useState } from 'react'

import BigNumber from 'bignumber.js'

import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'

import { getFullDisplayBalance } from '../../../utils/formatBalance'
import {default as iziToast} from "izitoast";

interface WithdrawModalProps extends ModalProps {
  max: BigNumber,
  onConfirm: (amount: string) => void,
  tokenName?: string,
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVal(e.currentTarget.value)
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
      <ModalActions>
          <Button text="Cancel" variant="secondary" onClick={onDismiss} />
          <Button
              disabled={pendingTx}
              text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
              onClick={requestUnstake}
          />
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
