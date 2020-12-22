import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Spacer from '../../components/Spacer'
import Environment from '../../Environment'
import { getLogs, getTimeNextRebase } from '../../services'
import { addHours, getCountDownInterval } from '../Home/utils'
import Chart from './components/Chart'
import DashboardChartCard from './components/DashboardChartCard'
import DashboardInfoCard from './components/DashboardInfoCard'
const Dashboard: React.FC = () => {

  const [data, setData] = useState([]);
  const [lastTx, setLastTx] = useState(null);
  useEffect(() => {
    const fetch = () => {
      getLogs().then(res => {
        if(res?.data){
          setData(res.data);
          const last = res.data.find(item => item.rebase_hash)
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
    }, 300000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if(data.length) {
      getTimeNextRebase().then(response => {
        const lastRebaseDate = new Date(response.data.rebase)
        const days = Math.abs(lastRebaseDate.valueOf() - new Date().valueOf()) / (36e5*24);
        getCountDownInterval((addHours(lastRebaseDate, Math.ceil(days)*24)));
      });
    }
  },[data]);

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
              <span id="dashboard_countdown"></span>
            </DashboardInfoCard>
          </StyledCardWrapper>
            <Spacer />
          <StyledCardWrapper>
            <DashboardInfoCard title="Current Supply" info={data?.length ? data[0].totalsupply_after : ""}/>
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledCardsWrapper>
        <StyledCardWrapper>
            <DashboardChartCard title="Supply History">
              <Chart
                chartKey="supply_history"
                data={data.reduce((total, current) => {
                  total.push({x: new Date(current.time), y: current.totalsupply_after})
                  return total
                },[])}
              />

            </DashboardChartCard>
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <DashboardChartCard title="Market Cap">
              <Chart
                chartKey="market_cap"
                data={data.reduce((total, current) => {
                  total.push({x: new Date(current.time), y: current.price * current.totalsupply_after})
                  return total
                },[])}
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
                data={data.reduce((total, current) => {
                  total.push({x: new Date(current.time), y: current.price})
                  return total
                },[])}/>
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
    align-items: flex-center;
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

export default Dashboard
