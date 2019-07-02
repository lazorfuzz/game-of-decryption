import React, { Component } from 'react';
import styled from 'styled-components';
import Card from '../../Card';
import Loading from '../../Loading';
import Text, { Title } from '../../Text';
import { currentUser } from '../../../api';


class Organization extends Component {
  render() {
    return (
      <Container className="main">
        <Title>My Organization</Title>
        <Card>
          <CardBody>
            <Text>{currentUser.organization}</Text>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const CardBody = styled.div`
  padding: 8px 16px;
`;

export default Organization;