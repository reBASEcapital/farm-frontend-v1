import React from 'react'
import farm from "../../assets/img/rebase-icon.png";

interface RebaseIconProps {
  size?: number,
  v1?: boolean,
  v2?: boolean,
  v3?: boolean
}

const RebaseIcon: React.FC<RebaseIconProps> = ({ size = 36, v1, v2, v3 }) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? 'saturate(0.5)' : undefined
    }}
  >
    <img src={farm} height="42" style={{ marginTop: -4 }} />
  </span>
)

export default RebaseIcon