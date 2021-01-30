import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledLink href="https://www.rebase.capital">About</StyledLink>
      <StyledLink href="https://medium.com/rebase-capital">Newsroom</StyledLink>
      <StyledLink href="https://t.me/rebasechat">Telegram</StyledLink>
      <StyledLink href="https://github.com/reBASEcapital">&lt;&gt; Code</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.black};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.blue[500]};
    text-shadow: 0px 0px;
  }
`

export default Nav
