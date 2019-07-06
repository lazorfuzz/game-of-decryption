import styled from 'styled-components';

const TabletView = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
  @media (min-width: 800px) {
    display: none;
  }
`;

export default TabletView;