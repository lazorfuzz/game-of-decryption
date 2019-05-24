import styled from 'styled-components';

const PreviewImage = styled.img`
  max-height: 100px;
  max-width: 100%;
  align-self: center;
  margin-top: 1em;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
`;

const PreviewText = styled.pre`
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 0;
  background: #31465a;
  overflow-x: scroll;
`;

export { PreviewImage, PreviewText };
