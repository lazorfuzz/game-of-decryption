import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
      decipheredText: ''
    };
  }

  handleReadProgress = (readProgress) => this.setState({ readProgress });

  previewImage = () => {
    this.setState({ showReadStatus: false, readPayload: '', decipheredText: '' });
    const file = this.fileSelector.files[0];
    if (!file) return;
    if (file.size > 3326850) {
      this.setState({ readProgress: 0, imageSrc: '', showReadStatus: false, readPayload: '', decipheredText: '' });
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
            readStatus: `OCR Result (${result.confidence}% Confidence)`
          }, () => this.previewText.focus());
        })
        .catch((err) => this.props.onError(err));
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleDecipher = () => {
    const { readPayload } = this.state;
    // Send OCR results to API backend for deciphering
    solveCipher(readPayload)
    .then((res) => this.setState({ decipheredText: res.result }))
    .catch((err) => {
      if (err.response) {
        const errMessage = JSON.parse(err.response.body).message;
        this.props.onError(`Deciphering Error - ${errMessage}`);
        this.setState({ decipheredText: errMessage});
      }
    })
    .finally(() => setTimeout(() => window.scroll({ top: 500, behavior: 'smooth' }), 50));
  }

  handleCipherTextChange = ({ target }) => this.setState({ readPayload: target.value });

  handleDecipheredTextChange = ({ target }) => this.setState({ decipheredText: target.value });

  handleCopyResult = () => {
    this.previewPre.select()
    document.execCommand('copy');
    document.querySelector('#root').select();
    this.props.onError('Copied to clipboard!');
  }

  render() {
    const { theme, classes } = this.props;
    const { imageSrc, showReadStatus, readStatus, readPayload, readProgress, decipheredText } = this.state;
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
                <React.Fragment>
                  <PreviewText ref={(pre) => this.previewText = pre} value={readPayload} onChange={this.handleCipherTextChange} />
                  <Button variant="contained" color="primary" classes={{ root: classes.submitButton }} onClick={this.handleDecipher}>Decipher</Button>
                </React.Fragment>
              )
            }
          </MainContainer>
        </Card>
        {
          decipheredText.length > 0 && (
            <ResultsContainer className="animated fadeInUp">
              <Title>Deciphered Text</Title>
              <Card>
                <MainContainer className="animated fadeIn">
                  <PreviewText ref={(pre) => this.previewPre = pre} value={decipheredText} onChange={this.handleCipherTextChange} />
                  <OptionsContainer>
                    <Button variant="contained" color="secondary" classes={{ root: classes.optionsButton, }} onClick={this.handleCopyResult}>Copy</Button>
                    <Button variant="contained" color="primary" classes={{ root: classes.optionsButton }}>Save</Button>
                  </OptionsContainer>
                </MainContainer>
              </Card>
            </ResultsContainer>
          )
        }
      </Container>
    );
  }
}

const styles = ({
  submitButton: {
    width: '30%',
    '@media (max-width: 768px)': {
      width: '100%'
    },
  },
  optionsButton: {
    width: '20%',
    '@media (max-width: 768px)': {
      width: '40%'
    },
  }
});

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const MainContainer = styled.div`
  padding: 8px 16px;
  display: flex;
  flex-flow: column;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ResultsContainer = styled.div`
  margin-top: 2em;
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

export default withStyles(styles)(withTheme(Decipher));