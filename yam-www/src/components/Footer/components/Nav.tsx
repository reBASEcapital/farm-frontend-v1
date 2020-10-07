import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://t.me/rebaseofficial">Telegram</StyledLink>
      <StyledLink href="https://discord.com/invite/jBg5ZAz">Discord</StyledLink>
      <StyledLink href="https://github.com/reBASEcapital">Github</StyledLink>
      <StyledLink href="mailto:relay@rebase.capital">Email</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.white};
  text-shadow: 1px 1px ${props => props.theme.color.black};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.blue[500]};
    text-shadow: 0px 0px;
  }
`

export default Nav
