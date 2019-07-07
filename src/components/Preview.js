import styled from 'styled-components';

const PreviewImage = styled.img`
  max-height: 150px;
  max-width: 100%;
  align-self: center;
  margin-top: 1em;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
`;

const PreviewText = styled.textarea`
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 0;
  background: rgba(30, 43, 49, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 16px;
  min-height: 120px;
  margin-bottom: 1em;
  outline: none;
  transition: all 150ms ease-in;
  &:hover {
    background: rgba(30, 43, 49, 0.8);
  }
  &:active {
    background: rgba(30, 43, 49, 0.9);
  }
`;

const PreviewPre = styled.pre`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 0;
  background: #3d4d66;
  color: rgba(255, 255, 255, .8);
  font-size: 16px;
  min-height: 120px;
  margin-bottom: 1em;
  outline: none;
  overflow-x: auto;
`;

export { PreviewImage, PreviewText, PreviewPre };
