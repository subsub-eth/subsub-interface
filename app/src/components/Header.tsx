import React, {useEffect, useState} from "react";
import {
  NavLink
} from "react-router-dom";
import styled from "styled-components";
import { Edit, ShoppingCart, LibraryBooks, Wc } from '@material-ui/icons';

import {HasWeb3Connection} from "./propTypes";
import {WalletButton, ConnectButton} from "./Wallet";
import { useRecoilValue } from "recoil";
import { isConnectedQuery } from "./web3State";

const navItems: Array<[string, JSX.Element, string]> = [
  ["/create", <Edit/>, "Create"],
  ["/farm", <Wc/>, "Farm"],
  ["/docs", <LibraryBooks/>, "Docs"],
  ["/buy", <ShoppingCart/>, "Buy"],
];

const HeaderStyle = styled.header`
  display: grid;
  grid-template-columns: 2fr 3fr 2fr;
  grid-template-areas: 'logo menu connect';
  margin: ${props => props.theme.gutter * 2}px ${props => props.theme.gutter}px 0;
  padding: 0 ${props => props.theme.gutter}px ${props => props.theme.gutter}px;
  border-bottom: 2px solid ${props => props.theme.secondary};
  max-width: 90%;
  ${props => props.theme.fontCopy}

  @media screen and (min-width: ${props => props.theme.minTablet}px) {
    grid-template-columns: 100px auto 0 120px;
    grid-template-areas: 'logo navbar wallet connect';
    margin: ${props => props.theme.gutter* 4}px ${props => props.theme.gutter * 3}px 0;
    padding: 0 ${props => props.theme.gutter * 2}px ${props => props.theme.gutter}px;
  }

  @media screen and (min-width: ${props => props.theme.minTablet}px) {
    grid-template-columns: 120px auto 50px 140px;
    grid-column-gap: ${props => props.theme.gutter * 2}px;
    margin: ${props => props.theme.gutter * 4}px auto 0;
    max-width: 80%;
  }
`;

const HeaderLogo = styled.div`
  grid-area: logo;
  align-self: center;
  text-shadow: 0 0 15px ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  font-size: 30px;
`;

function Logo() {
  return (
    <HeaderLogo>
      LOGO
    </HeaderLogo>
  );
}

const NavContainer = styled.nav`
  grid-area: navbar;
  align-self: center;
`;
const ItemsList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0;
  padding: 0;
  list-style-type: none;

  @media screen and (max-width: ${props => props.theme.maxMobile}px) {
    display: none;
    position: absolute;
    left: 0;
    flex-direction: column;
    margin-top: ${props => props.theme.gutter}px;
    border-bottom: 2px solid ${props => props.theme.secondary};
    background-color: ${props => props.theme.background};
    width: 100%;

    &.show {
      display: block;
    }
  }
  `;
const Item = styled.li`
  margin-right: 40px;

  @media screen and (max-width: ${props => props.theme.maxMobile}px) {
    display: grid;
    place-items: center;
    margin-right: 0;

    &:last-child {
      margin-bottom: 10px;
    }
  }
`;

const HeaderNavLink = styled(NavLink)`
  display: flex;
  text-decoration: none;
  color: ${props => props.theme.secondary};

  @media screen and (max-width: ${props => props.theme.maxMobile}px) {
    padding: 14px;
    font-size: 20px;
  }

  @media screen and (min-width: ${props => props.theme.minTablet}px) {
    flex-direction: column;
  }

  @media screen and (min-width: ${props => props.theme.minDesktop}px) {
    flex-direction: row;
  }

  svg {
    padding-right: 10px;

    @media screen and (min-width: ${props => props.theme.minTablet}px) {
      align-self: center;
      padding-bottom: 4px;
    }

    @media screen and (min-width: ${props => props.theme.minDesktop}px) {
      padding-right: 8px;
    }
  }
`;

function Navigation() {
  return (
    <NavContainer>
      <ItemsList >
        {navItems.map(([path, icon, name]) =>
          <Item key={path}>
            <HeaderNavLink to={path}>{icon}{name}</HeaderNavLink>
          </Item>
        )}
      </ItemsList >
    </NavContainer>
  );
}

const WalletBalance = styled.div`
  grid-area: wallet;
  align-self: center;
  display: none;

  @media screen and (min-width: ${props => props.theme.minDesktop}px) {
    display: block;
  }
`;


const BBurgerButton = ({ className }: {className?: string}) => {
  return (
    <button className={className}>Menu</button>
  );
};

const BurgerButton = styled(BBurgerButton)`
  ${props => props.theme.resetButton}
  grid-area: menu;
  justify-self: end;
  vertical-align: -20%;
  margin-right: 18px;
  text-shadow: 0 0 15px ${props => props.theme.secondary}
  font-size: 32px;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }

  @media screen and (min-width: ${props => props.theme.minTablet}px) {
    display: none;
  }
`;
/**
  * Header function
  */
export function Header() {
  const connected = useRecoilValue(isConnectedQuery);

  return (
    <HeaderStyle>
      <Logo />
      <BurgerButton/>
      <Navigation/>
      <WalletBalance>$ 100</WalletBalance>
      {connected
        ? <WalletButton />
        : <ConnectButton />}
    </HeaderStyle>
  );
}
