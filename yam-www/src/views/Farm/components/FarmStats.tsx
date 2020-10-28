
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Contract } from 'web3-eth-contract'

import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'

import useTokenBalance from '../../../hooks/useTokenBalance'
import useTokenBalanceLP from '../../../hooks/useTokenBalanceLP'
import useAPY from '../../../hooks/useAPY'
import getTotalSupply from '../../../hooks/useTotalSupply'

import getTotalStaked from '../../../hooks/useTotalStaked'
import { getDisplayBalance } from '../../../utils/formatBalance'
import {getPrice, getTotalStakedValue} from  '../../../utils/formatPrice'
import {getTotalValue} from  '../../../utils/formatTotalValue'

import farm from "../../../assets/img/rebase-icon.png";
import Environment from "../../../Environment";
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import Label from '../../../components/Label'
import { getUnlockRate } from '../../../yamUtils'
import ReactTooltip from 'react-tooltip'
import { currencyMap } from '../../../utils'

interface StakeProps {
  poolContract: Contract,
  tokenContract: Contract,
}

const FarmStats: React.FC<StakeProps> = ({
  poolContract,
  tokenContract,
}) => {

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

  // Get the unlock rate

  const apy = useAPY(poolContract, tokenContract);


  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
            <StyledCardHeader>
                <CardIcon><span><img src={farm} height="42" style={{ marginTop: -4 }} /></span></CardIcon>
                <Value value={getDisplayBalance(rebaseBalance,9)} />
                <Label text="reB∆SE Balance" />
                <Value value={rebasePriceDisplay && "$ " + rebasePriceDisplay} />
                <Label text="reB∆SE Price" />
                <Value value={totalStakedValue && `${currencyMap[poolContract.options.address]} ${totalStakedValue}`} />
                <Label text="Total Staked Value" />
            </StyledCardHeader>
          <StyledCardActions>
            <StyledInfoCard>
              <StyledInfoCardContent>
                <InfoCardTitle>
                    <div>APY</div>
                    <div>
                        <a data-for="tooltip1" data-tip data-iscapture="true">
                            <Info >
                                i
                            </Info>
                        </a>
                        <ReactTooltip id="tooltip1" place="top" effect="solid">
                            <div>
                            APY is estimated for a new deposit over the next <br />
                            60 days, and does not account for gains or losses <br />
                            from holding liquidity tokens
                            </div>
                        </ReactTooltip>
                    </div>
                </InfoCardTitle>
                <Spacer size="sm"/>
                <b>{apy && apy + " %"}</b>
              </StyledInfoCardContent>
            </StyledInfoCard>
            <StyledActionSpacer />
            <StyledInfoCard>
              <StyledInfoCardContent>
              <InfoCardTitle>
                    <div>Reward Multiplier</div>
                    <div>
                        <a data-for="tooltip2" data-tip data-iscapture="true">
                            <Info >
                                i
                            </Info>
                        </a>
                        <ReactTooltip id="tooltip2" place="top" effect="solid">
                            <div>
                            Deposit liquidity tokens for 60 days to achieve  <br />
                            a 3x reward multiplier. 
                            </div>
                        </ReactTooltip>
                    </div>
                </InfoCardTitle>
                <Spacer size="sm"/>
                <b>1.0x</b>
              </StyledInfoCardContent>
            </StyledInfoCard>
          </StyledCardActions>
        <StyledActionSpacer/>
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
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[2]}px;
    flex-direction: column
  }
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
background-color: ${props => props.theme.color.grey[900]};
border: 1px solid ${props => props.theme.color.grey[500]};
border-radius: 12px;
color: ${props => props.theme.color.grey[500]};
cursor: pointer;
flex: 1;
flex-direction: column;
justify-content: space-between;
border-radius: 12px;
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

export default FarmStats