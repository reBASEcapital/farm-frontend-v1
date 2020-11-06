import React from 'react'

import styled from 'styled-components'

interface ValueProps {
  value: string | number,
}

const Value: React.FC<ValueProps> = ({ value }) => {
  return (
    <StyledValue>{value}</StyledValue>
  )
}

const StyledValue = styled.div`
  color: ${props => props.theme.color.grey[100]};
  font-size: 36px;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: ${props => props.theme.spacing[3]}px;
    word-break: break-word;
  }
`

export default Value