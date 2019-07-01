import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Text from '../Text';
import './Footer.css';

class Footer extends PureComponent {
  render() {
    return (
      <Wrapper shifted={this.props.shifted}>
        <Text className="footerText">Made with <span role="img" aria-label="love">❤️</span> by IST440 Summer 2019 Team 2.</Text>
        <Text className="footerText">View this project on <FooterLink target="_blank" href="https://github.com/lazorfuzz/game-of-decryption">GitHub.</FooterLink></Text>
      </Wrapper>
    );
  }
}

export default Footer;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  position: relative;
  bottom: 0;
  padding-bottom: 16px;
  margin-left: ${({ shifted }) => shifted ? '96px' : '0'};
  @media (max-width: 768px) {
    bottom: 56px;
    margin: auto;
  }
`;

const FooterLink = styled.a`
  color: white;
`;