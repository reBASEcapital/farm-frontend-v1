import React from 'react'
import styled from 'styled-components'

import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'

import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <Page>
      <PageHeader
        icon="🗣"
        subtitle="Check out our farms."
        title="reB∆SE is live."
      />
      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
        <div style={{
          margin: '0 auto'
        }}>
          <Button
            size="sm"
            text="View V1 Farms"
            to="/farms"
            variant="secondary"
           />
        </div>
    </Page>
  )
}

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledSpacer = styled.div`
  height: ${props => props.theme.spacing[4]}px;
  width: ${props => props.theme.spacing[4]}px;
`

const StyledLink = styled.a`
  font-weight: 700l
  text-decoration: none;
  color: ${props => props.theme.color.primary.main};
`

export default Home
