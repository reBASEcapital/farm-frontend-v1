import React, { useMemo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import Countdown, { CountdownRenderProps} from 'react-countdown'
import { useWallet } from 'use-wallet'
import numeral from 'numeral'
import { provider } from 'web3-core'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'

import useFarms from '../../../hooks/useFarms'
import useYam from '../../../hooks/useYam'

import { Farm } from '../../../contexts/Farms'

import { bnToDec } from '../../../utils'
import { getEarned, getPoolStartTime } from '../../../yamUtils'
import { KECCAK256_NULL_S } from 'ethereumjs-util'
import useAPY from '../../../hooks/useAPY'
import { getContract } from '../../../utils/erc20'

const FarmCards: React.FC = () => {
  const [farms] = useFarms()
  const { account, ethereum } = useWallet()
  const [rows, setRows] = useState<Array<Array<Farm|any>>>([[]]);
  useEffect(() => {
    if(farms){
      setRows(farms.reduce<Farm[][]>((farmRows, farm) => {
        const newFarmRows = [...farmRows]
        if (newFarmRows[newFarmRows.length - 1].length === 2) {
          newFarmRows.push([farm])
        } else {
          newFarmRows[newFarmRows.length - 1].push(farm)
        }
        return newFarmRows
      }, [[]]));
      setRows((prev)=> {
        while(!prev[prev.length-1][prev[prev.length-1].length -1]?.dummy || 
          prev[prev.length-1][prev[prev.length-1].length -1].dummy < 2){
          if(prev[prev.length-1].length < 3){
            prev[prev.length-1].push({dummy: prev[prev.length-1][prev[prev.length-1].length -1]?.dummy + 1 || 1});
          } else {
            prev.push([{dummy: prev[prev.length-1][prev[prev.length-1].length -1].dummy + 1 || 1}]);
          }
        }
        return prev
      });
    }
  }, [farms]);

  return (
    <StyledCards>
      {!!rows[0]?.length ? rows.map((farmRow, i) => (
        <StyledRow key={i}>
          {farmRow.map((farm, j) => (
            <React.Fragment key={j}>
              <FarmCard farm={farm} ethereum={ethereum as provider}/>
              {<StyledSpacer />}
            </React.Fragment>
          ))}
        </StyledRow>
      )) : (
          <StyledLoadingWrapper>
            <Loader text="Loading farms" />
          </StyledLoadingWrapper>
        )}
    </StyledCards>
  )
}

interface FarmCardProps {
  farm: Farm|any,
  ethereum: provider
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, ethereum }) => {
  const [startTime, setStartTime] = useState(0)
  const [harvestable, setHarvestable] = useState(0)

  const { account } = useWallet()
  const yam = useYam()
  const tokenContract = useMemo(() => {
    return getContract(ethereum as provider, farm?.depositTokenAddress)
  }, [ethereum, farm.depositTokenAddress]);
  const apy = useAPY(farm?.contract, tokenContract)
  const getStartTime = useCallback(async () => {
    const startTime = await getPoolStartTime(farm.contract)
    setStartTime(startTime)
  }, [farm, setStartTime])

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
      <span style={{ width: '100%' }}>{paddedHours}:{paddedMinutes}:{paddedSeconds}</span>
    )
  }

  useEffect(() => {
    if (farm && farm.id === 'ycrv_yam_uni_lp') {
      getStartTime()
    }
  }, [farm, getStartTime])

  /*
  useEffect(() => {
    async function fetchEarned () {
      const earned = await getEarned(yam, contract, account)
      setHarvestable(bnToDec(earned))
    }
    if (yam && account) {
      fetchEarned()
    }
  }, [yam, contract, account, setHarvestable])
*/
  const poolActive = startTime * 1000 - Date.now() <= 0
  const dummyEmojis = ["🌱","🌾","🌻"]
  return (
    <StyledCardWrapper>
      {farm?.id && farm.id === 'ycrv_yam_uni_lp' && (
        <StyledCardAccent />
      )}
      <Card>
        <CardContent>
          <StyledContent>
            <CardIcon>{farm?.icon || dummyEmojis[farm?.dummy]}</CardIcon>
            <StyledTitle>{farm?.name || "COMING SOON"}</StyledTitle>
            {farm && 
            <StyledDetails>
              <StyledDetail>{farm?.depositToken && `Deposit ${farm.depositToken.toUpperCase()}`}</StyledDetail>
              <StyledDetail>{farm?.earnToken && `Earn ${farm.earnToken.toUpperCase()}`}</StyledDetail>
              <StyledDetail>{apy && `APY: ${apy}%`}</StyledDetail>
            </StyledDetails>
            }
            <Spacer />
            <StyledHarvestable>
              {harvestable ? `${numeral(harvestable).format('0.00a')} YAMs ready to harvest.` : undefined}
            </StyledHarvestable>
            {farm?.id &&
              <Button
                disabled={!poolActive}
                text={poolActive ? 'Select' : undefined}
                to={`/farms/${farm.id}`}
              >
                {!poolActive && <Countdown date={new Date(startTime * 1000)} renderer={renderer} />}
              </Button>
            }
          </StyledContent>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  )
}

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  border-radius: 12px;
  filter: blur(4px);
  position: absolute;
  top: -2px; right: -2px; bottom: -2px; left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${props => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${props => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${props => props.theme.color.grey[100]};
  font-size: 24px;
  font-weight: 700;
  margin: ${props => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${props => props.theme.spacing[4]}px;
  width: ${props => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${props => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetail = styled.div`
  color: ${props => props.theme.color.grey[300]};
`

const StyledHarvestable = styled.div`
  color: ${props => props.theme.color.secondary.main};
  font-size: 16px;
  height: 48px;
  text-align: center;
`

export default FarmCards
