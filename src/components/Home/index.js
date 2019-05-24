import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import Input from '../Input';
import Card from '../Card';
import Hero from '../Hero';
import Text, { Title } from '../Text';
import { readImage } from './read-image';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: '',
      showReadStatus: false,
      readStatus: 'Reading image... Please wait.',
      readProgress: 0,
      readPayload: ''
    };
  }

  handleReadProgress = (readProgress) => this.setState({ readProgress });

  previewImage = (evt) => {
    this.setState({ showReadStatus: false, readPayload: '' });
    const file = this.fileSelector.files[0];
    if (file.size > 2621440) {
      this.props.onError('Image size too large. Max image size is 2.5 MB. Did you remember to crop out everything but the text?');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.setState({
        imageSrc: reader.result,
        showReadStatus: true,
        readStatus: 'Reading image... Please wait.',
        readProgress: 0,
      });
      const image = new Image();
      image.src = reader.result;
      readImage(image, this.handleReadProgress)
        .then((result) => {
          this.setState({
            readPayload: result.text,
            readStatus: `Result (${result.confidence}% Confidence)`
          });
        })
        .catch((err) => console.log('ERROR', err));
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  render() {
    const { theme } = this.props;
    const { imageSrc, showReadStatus, readStatus, readPayload, readProgress } = this.state;
    return (
      <Wrapper>
        <Card className="main">
          <Hero>
            <Title className="heroTitle">Image Deciphering Tool</Title>
          </Hero>
          <MainContainer>
            <Text>Select an image to begin.</Text>
            <Input
              className="imageInput"
              type="file"
              accept="image/x-png,image/jpeg"
              onChange={this.previewImage}
              ref={(input) => this.fileSelector = input}
            />
            {
              imageSrc.length > 0 && (
                <React.Fragment>
                  <PreviewImage src={imageSrc} />
                  <ProgressContainer>
                    <Progress progress={readProgress} progressColor={theme.palette.primary.light} />
                  </ProgressContainer>
                </React.Fragment>
              )
            }
            {
              showReadStatus && (
                <Text>{readStatus}</Text>
              )
            }
            {
              readPayload.length > 0 && (
                <PreviewText>{readPayload}</PreviewText>
              )
            }
          </MainContainer>
        </Card>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  padding-top: 3rem;
  align-items: center;
  flex-flow: column;
  margin-bottom: 3rem;
`;

const MainContainer = styled.div`
  padding: 8px 16px;
  display: flex;
  flex-flow: column;
`;

const ProgressContainer = styled.div`
  margin-left: -16px;
  margin-top: 1.5em;
  background: rgb(62, 77, 102);
  height: 1px;
  width: calc(100% + 32px);
`;

const Progress = styled.div`
  width: ${({ progress }) => `calc(${progress * 100}%)`};
  background: ${({ progressColor }) => progressColor};
  height: 1px;
  transition: 150ms ease-in;
`;

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

export default withTheme(Home);
