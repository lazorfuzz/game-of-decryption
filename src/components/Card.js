import styled from 'styled-components';

const Card = styled.div`
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
  background: rgb(82, 94, 114);
  min-width: 100px;
  max-width: 100%;
`;

const HR = styled.div`
  border-bottom: 2px rgb(62, 77, 102) solid;
  margin: 16px -16px;
`;

export { HR };

export default Card;
