import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../components/Button'
import Page from '../../components/Page'
import Web3 from 'web3'
import { provider } from 'web3-core'
import BigNumber from 'bignumber.js'
import Spacer from '../../components/Spacer'
import Environment from '../../Environment'
import useYam from '../../hooks/useYam'
import { getLogs, getTimes } from '../../services'
import { alreadyRewarded, claimReward, currentBlockWinner, getAbiDecoder, getOrchestratorContract, getRebaseContract, rebase, runStimulus } from '../../yamUtils'
import { getCountDownInterval } from '../Home/utils'
import Chart from './components/Chart'
import DashboardChartCard from './components/DashboardChartCard'
import DashboardInfoCard from './components/DashboardInfoCard'
import useModal from '../../hooks/useModal'
import RewardModal from '../../components/RewardModal/RewardModal'

const Dashboard: React.FC = () => {

  const [data, setData] = useState([]);
  const [stimulusData, setStimulusData] = useState([]);
  const [lastTx, setLastTx] = useState(null);
  const [supplyHistoryData, setSupplyHistoryData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);
  const [rateHistoryData, setRateHistoryData] = useState([]);
  const [lastRebaseDate, setLastRebaseDate] = useState(0);
  const [nextRebaseDate, setNextRebaseDate] = useState(0);
  const { account, ethereum } = useWallet();
  const [lastStimulusDate, setLastStimulusDate] = useState(0);
  const [nextStimulusDate, setNextStimulusDate] = useState(0);
  const [rewardQuantity, setRewardQuantity] = useState(0);
  const [blockWinner, setBlockWinner] = useState('');
  const [isAlreadyRewarded, setIsAlreadyRewarded] = useState(true);
  const [onPresentRewardModal] = useModal(<RewardModal quantity={rewardQuantity}/>)
  const yam = useYam();

  useEffect(()=> {
    if(rewardQuantity){
      onPresentRewardModal()
    }
  },[rewardQuantity])

  useEffect(() => {
    const fetch = () => {
      getLogs().then(res => {
        if(res?.logs){
          setData(res.logs);
          setStimulusData(res.stimulus);
          setSupplyHistoryData(res.logs.reduce((total, current) => {
            total.push({x: new Date(current.time), y: current.totalsupply_after})
            return total
          },[]));
          
          setMarketCapData(res.logs.reduce((total, current) => {
            const bikiPrice = res.bikiPrices[current.time.slice(0,16)];
            const uniswapPrice = res.uniswapPrices[current.time.slice(0,16)];
            if(bikiPrice || uniswapPrice) {
              total.push({x: new Date(current.time), y: (((bikiPrice ? bikiPrice : 0) + (uniswapPrice ? uniswapPrice : 0)) / ( bikiPrice && uniswapPrice ? 2 : 1)) * current.totalsupply_after});
            }
            return total
          },[]));

          setRateHistoryData(res.logs.reduce((total, current) => {
            total.push({x: new Date(current.time), y: current.price})
            return total
          },[]));

          const last = res.logs.find(item => item.rebase_hash)
          if(last) {
            setLastTx(last.rebase_hash);
          }
        }
      })
    }
    window.scrollTo(0, 0)
    fetch()
    const intervalId = setInterval(() => {
      fetch()
    }, 120000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if(data.length || stimulusData.length) {
      getTimes().then(response => {
        setNextRebaseDate(response.data.rebase)
        setLastRebaseDate(response.data.prev_rebase)
        setLastStimulusDate(response.data.prev_stimulus)
        setNextStimulusDate(response.data.stimulus)
        const hasTx = data.find(i=> new Date(i.time) < new Date(response.data.rebase) && new Date(i.time) > new Date(response.data.prev_rebase) && i.rebase_hash);
        const hasStim = stimulusData.find(i=> new Date(i.time) < new Date(response.data.stimulus) && new Date(i.time) > new Date(response.data.prev_stimulus) && i.stimulus_hash);
        if(hasTx){
          getCountDownInterval(new Date(response.data.rebase),"rebase_dashboard_countdown");
        } else {
            document.getElementById("rebase_dashboard_countdown").innerHTML = "REBASE"
        }
        if(hasStim){
          getCountDownInterval(new Date(response.data.stimulus),"stimulus_dashboard_countdown");
        } else {
          document.getElementById("stimulus_dashboard_countdown").innerHTML = "STIMULUS"
        }
      });
    }
  },[data, stimulusData]);

  useEffect(()=> {
    const fetch = async () =>{
      const rebaseContract = await getRebaseContract(yam);
      const blockWinner = await currentBlockWinner(rebaseContract, account)
      const Rewarded = await alreadyRewarded(rebaseContract, account)
      setIsAlreadyRewarded(Rewarded)
      setBlockWinner(blockWinner);
  }
  if(account && yam){
    fetch(); 
  }
  },[account, yam]);

  const isRebaseButtonDisabled = (): boolean => {
    if(document.getElementById("rebase_dashboard_countdown")?.innerHTML !== "REBASE" || !account){
      return true;
    } else {
      const hasTx = data.find(i=> new Date(i.time) < new Date(nextRebaseDate) && new Date(i.time) > new Date(lastRebaseDate) && i.rebase_hash);
      return !!hasTx;
    }
  }
  const isStimulusButtonDisabled = (): boolean => {
    if(document.getElementById("stimulus_dashboard_countdown")?.innerHTML !== "STIMULUS" || !account){
      return true;
    } else {
      const hasTx = data.find(i=> new Date(i.time) < new Date(nextStimulusDate) && new Date(i.time) > new Date(lastStimulusDate) && i.rebase_hash);
      return !!hasTx;
    }
  }

  const doRebase = async () => {
    if(account){
      const orchestrator = await getOrchestratorContract(yam);
      const response = await rebase(orchestrator, account);
      if(response) {
        getTimes().then(timeResponse => {
          const lastRebaseDate = new Date(timeResponse.data.rebase);
          getCountDownInterval(lastRebaseDate, "rebase_dashboard_countdown");
        });
      }
    }
  }
  const doClaimReward = async () => {
    if(account){
      const orchestrator = await getOrchestratorContract(yam);
      const abiDecoder = await getAbiDecoder(yam);
      const res = await claimReward(orchestrator, account);
      if(res){
        const web3 = new Web3(ethereum as provider)
        let receipt = await web3.eth.getTransactionReceipt(res.transactionHash)
        const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
        if(decodedLogs.length > 1){
          setRewardQuantity(new BigNumber(decodedLogs[1].events[1].value).dividedBy("1000000000").toNumber());
        } else {
          setRewardQuantity(-1);
        }
      }
      setIsAlreadyRewarded(true);
    }
  }
  
  const doRunstimulus = async () => {
    if(account){
      const orchestrator = await getOrchestratorContract(yam);
      const response = await runStimulus(orchestrator, account);
      if(response) {
        getTimes().then(timeResponse => {
          const lastStimulusDate = new Date(timeResponse.data.stimulus);
          getCountDownInterval(lastStimulusDate, "stimulus_dashboard_countdown");
        });
      }
    }
  }

  return (
    <Page>
      <StyledDashboard>
        <p>&nbsp;</p>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <DashboardInfoCard title="Oracle Rate" info={data?.length ? '$'+ data[0].price.toFixed(6) : ""}/>
          </StyledCardWrapper>
            <Spacer />
          <StyledCardWrapper>
            <DashboardInfoCard title="Price Target" info={data?.length ? "$" + data[0].target : ""}/>
          </StyledCardWrapper>
            <Spacer />
          <StyledCardWrapper>
            <DashboardInfoCard title="Next Rebase" info="">
            <Button disabled={isRebaseButtonDisabled()} onClick={doRebase}>
              <StyledCountdown id="rebase_dashboard_countdown"></StyledCountdown>
            </Button>
            </DashboardInfoCard>
          </StyledCardWrapper>
            <Spacer />
          <StyledCardWrapper>
            <DashboardInfoCard title="Current Supply" info={data?.length ? data[0].totalsupply_after : ""}/>
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="md" />
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <DashboardInfoCard title="Next Stimulus" info="">
            <Button onClick={doRunstimulus} disabled={isStimulusButtonDisabled()}>
              <StyledCountdown id="stimulus_dashboard_countdown"></StyledCountdown>
            </Button>
            </DashboardInfoCard>
          </StyledCardWrapper>
            <Spacer />
          <StyledCardWrapper>
          <DashboardInfoCard title="Claim Stimulus" info="">
            <Button disabled={isAlreadyRewarded || !(account && blockWinner && blockWinner.slice(-2) === account.slice(-2))} onClick={doClaimReward}>
              {`#${!!blockWinner ? blockWinner.slice(-2) : "--"}`}
            </Button>
            </DashboardInfoCard>
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledCardsWrapper>
        <StyledCardWrapper>
            <DashboardChartCard title="Supply History">
              <Chart
                chartKey="supply_history"
                data={supplyHistoryData}
              />

            </DashboardChartCard>
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <DashboardChartCard title="Market Cap">
              <Chart
                chartKey="market_cap"
                data={marketCapData}
              />
            </DashboardChartCard>
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <DashboardChartCard title="Rate History">
              <Chart
                chartKey="rate_history"
                data={rateHistoryData}/>
            </DashboardChartCard>
          </StyledCardWrapper>
          <Spacer />
          <StyledLinkCardWrapper>
            <DashboardChartCard title="Verification 🛡">
              <StyledList>
                <StyledListItem>✅ Latest rebase transaction ID:<br/><StyledLink href={Environment.transactionsUrl+lastTx} target="_blank">{lastTx}</StyledLink></StyledListItem>
                <StyledListItem>✅ Market Policy:<br/><StyledLink href={Environment.accountUrl + Environment.market_oracle_address} target="_blank">{Environment.market_oracle_address}</StyledLink></StyledListItem>
                <StyledListItem>✅ CPI Oracle:<br/><StyledLink href={Environment.accountUrl + Environment.cpi_oracle_address} target="_blank">{Environment.cpi_oracle_address}</StyledLink></StyledListItem>
                <StyledListItem>✅ Orchestrator:<br/><StyledLink href={Environment.accountUrl + Environment.orchestrator_address} target="_blank">{Environment.orchestrator_address}</StyledLink></StyledListItem>
              </StyledList>
            </DashboardChartCard>
          </StyledLinkCardWrapper>
        </StyledCardsWrapper>
      </StyledDashboard>
    </Page>
  )
}

const StyledDashboard = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 98vw;
    align-items: center;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  max-width: 80vw;
  align-self: start;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 90vw;
    align-self: center;
    flex-wrap: wrap;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  max-height: 260px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLinkCardWrapper = styled.div`
display: flex;
flex: 1;
flex-direction: row;
@media (max-width: 768px) {
  width: 100%;
}
`

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
  width: 100%;
  margin-top: ${props => props.theme.spacing[1]}px;
  list-style-type: none;
`
const StyledListItem = styled.li`
  margin-top: ${props => props.theme.spacing[1]}px;
  font-size: 0.8em;
`

const StyledLink = styled.a`
  overflow-wrap: break-word;
  color: ${props => props.theme.color.white};
  text-decoration: underline;
  &:hover {
    color: ${props => props.theme.color.blue[500]};
    text-shadow: 0px 0px;
  }
`
const StyledCountdown = styled.span`
  color: ${props => props.theme.color.white};
`

export default Dashboard
