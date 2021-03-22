
import React from 'react'
import styled from 'styled-components';

interface Props {
    title: string,
    info: string | number,
    children?: React.ReactNode,
  }

const DashboardInfoCard: React.FC<Props> = ({
    title,
    info,
    children
}) => {

    return (
    <InfoCard>
        <InfoCardContent>
            <StyledCardContentInner>
                <StyledCardHeader>
                    {title}
                </StyledCardHeader>
                <StyledCardActions>
                    {info ? info : children}
                </StyledCardActions>
            </StyledCardContentInner>

        </InfoCardContent>
    </InfoCard> 
    );
}

const InfoCard = styled.div`
  background: ${props => props.theme.color.grey[50]};
  border: 2px solid ${props => props.theme.color.grey[250]};
  border-radius: 12px;
  width: 200px;
  box-shadow: inset 1px 1px 0px ${props => props.theme.color.grey[500]};
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 
`

const InfoCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 ${props => props.theme.spacing[4]}px ${props => props.theme.spacing[4]}px;
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing[2]}px;
  }
`

const StyledCardHeader = styled.div`

  align-items: center;
  display: flex;
  color: ${props => props.theme.color.blue[200]};
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.color.blue[100]};
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
color: ${props => props.theme.color.blue[100]};
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

const StyledDisclaimer = styled.div`
  color: ${props => props.theme.color.grey[100]};
  font-size: 0.6em;
`

export default DashboardInfoCard