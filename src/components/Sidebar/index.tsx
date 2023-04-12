import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GRAY, REACT_GRAY, PURPLE, WHITE, DARK_GRAY } from '../../constants';
import logo from '../../assets/LogoPanda.png';
import { hexToRGB } from '../../utils';

import Button from '../Button';
import { ConnectedMethods, Web3Provider } from '../../types';
import { BigNumber } from 'ethers';

// =============================================================================
// Styled Components
// =============================================================================

const Main = styled.main`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  background-color: ${REACT_GRAY};
  > * {
    margin-bottom: 10px;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin-bottom: 15px;
  }
`;

const Link = styled.a.attrs({
  href: 'https://phantom.app/',
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-decoration: none;
  margin-bottom: 30px;
  padding: 5px;
  &:focus-visible {
    outline: 2px solid ${hexToRGB(GRAY, 0.5)};
    border-radius: 6px;
  }
`;

const Subtitle = styled.h5`
  color: ${GRAY};
  font-weight: 400;
`;

const Pre = styled.pre`
  margin-bottom: 5px;
`;

const Badge = styled.div`
  margin: 0;
  padding: 10px;
  width: 100%;
  color: ${PURPLE};
  background-color: ${hexToRGB(PURPLE, 0.2)};
  font-size: 14px;
  border-radius: 6px;
  @media (max-width: 400px) {
    width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 320px) {
    width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ::selection {
    color: ${WHITE};
    background-color: ${hexToRGB(PURPLE, 0.5)};
  }
  ::-moz-selection {
    color: ${WHITE};
    background-color: ${hexToRGB(PURPLE, 0.5)};
  }
`;

const Divider = styled.div`
  border: 1px solid ${DARK_GRAY};
  height: 1px;
  margin: 20px 0;
`;

const Tag = styled.p`
  text-align: center;
  color: ${GRAY};
  a {
    color: ${PURPLE};
    text-decoration: none;
    ::selection {
      color: ${WHITE};
      background-color: ${hexToRGB(PURPLE, 0.5)};
    }
    ::-moz-selection {
      color: ${WHITE};
      background-color: ${hexToRGB(PURPLE, 0.5)};
    }
  }
  @media (max-width: 320px) {
    font-size: 14px;
  }
  ::selection {
    color: ${WHITE};
    background-color: ${hexToRGB(PURPLE, 0.5)};
  }
  ::-moz-selection {
    color: ${WHITE};
    background-color: ${hexToRGB(PURPLE, 0.5)};
  }
`;

// =============================================================================
// Typedefs
// =============================================================================

interface Props {
  address?: string;
  connectedMethods: ConnectedMethods[];
  connect: () => Promise<void>;
  balance: string;
}

// =============================================================================
// Main Component
// =============================================================================

const Sidebar = React.memo((props: Props) => {
  const { address, connectedMethods, connect, balance } = props;

  return (
    <Main>
      <Body>
        <Link>
          <img src={logo} alt="logo" width="100" />
          <Subtitle>Panda Wallet</Subtitle>
        </Link>
        {address ? (
          // connected
          <>
            <div>
              <Pre>Connected as</Pre>
              <Badge>{address}</Badge>
              <div>Balance {balance} BNB</div>
              <Divider />
            </div>
            {connectedMethods.map((method, i) => (
              <Button key={`${method.name}-${i}`} onClick={method.onClick}>
                {method.name}
              </Button>
            ))}
          </>
        ) : (
          // not connected
          <Button onClick={connect}>Connect to Phantom</Button>
        )}
      </Body>
      {/* 😊 💕  */}
      <Tag>
         <span role="img" aria-label="Red Heart Emoji">
          ❤️
        </span>
        Dapp
      </Tag>
    </Main>
  );
});

export default Sidebar;
