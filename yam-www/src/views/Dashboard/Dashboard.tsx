import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import Spacer from '../../components/Spacer'
import { getLogs, getTimeNextRebase } from '../../services'
import { addHours, getCountDownInterval } from '../Home/utils'
import Chart from './components/Chart'
import DashboardChartCard from './components/DashboardChartCard'
import DashboardInfoCard from './components/DashboardInfoCard'
const Dashboard: React.FC = () => {

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetch = () => {
      getLogs().then(res => {
        if(res?.data){
          setData(res.data);
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
      const lastRebase = data.find(i => i.rebase_hash)
      if(lastRebase){
        getTimeNextRebase().then(response => {
          const lastRebaseDate = new Date(response.data.rebase)
          const days = Math.abs(lastRebaseDate.valueOf() - new Date().valueOf()) / (36e5*24);
          getCountDownInterval((addHours(lastRebaseDate, Math.ceil(days)*24)));
        });
      }

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
            <DashboardInfoCard title="Price Target" info="$1.00"/>
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
  @media (max-width: 768px) {
    width: 100%;
  }
`

export default Dashboard
