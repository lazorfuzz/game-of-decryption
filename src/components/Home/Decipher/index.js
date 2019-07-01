import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { BaseInput } from '../../Input';
import Card from '../../Card';
import Text, { Title } from '../../Text';
import { PreviewImage, PreviewText } from '../../Preview';
import { readImage } from '../read-image';
import { solveCipher } from '../../../api';

class Decipher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: '',
      showReadStatus: false,
      readStatus: 'Reading image... Please wait.',
      readProgress: 0,
      readPayload: '',
    };
  }

  handleReadProgress = (readProgress) => this.setState({ readProgress });

  previewImage = () => {
    this.setState({ showReadStatus: false, readPayload: '' });
    const file = this.fileSelector.files[0];
    if (!file) return;
    if (file.size > 3326850) {
      this.setState({ readProgress: 0, imageSrc: '', showReadStatus: false, readPayload: '' });
      this.props.onError('Image size too large. Max image size is 3.3 MB. Did you crop out everything but the text?');
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
      // Send image to OCR engine
      readImage(image, this.handleReadProgress)
        .then((result) => {
          this.setState({
            readPayload: result.text,
            readStatus: `Result (${result.confidence}% Confidence)`
          });
          // Send OCR results to API backend for deciphering
          solveCipher(result.text)
            .then(console.log)
            .catch(console.error);
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
      <Container className="main">
        <Title>Image Decipher</Title>
        <Card>
          <MainContainer className="animated fadeIn">
            <Text>Select an image to begin.</Text>
            <BaseInput
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
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
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

export default withTheme(Decipher);