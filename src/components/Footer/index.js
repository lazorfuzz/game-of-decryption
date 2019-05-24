import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Text from '../Text';
import './Footer.css';

class Footer extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Text className="footerText">Made with <span role="img" aria-label="love">❤️</span> by IST440 Summer 2019 Team 3.</Text>
      </Wrapper>
    );
  }
}

export default Footer;

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  align-items: center;
  position: relative;
  bottom: 0;
`;