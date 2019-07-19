import React, { Component } from 'react';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { BaseInput } from '../../Input';
import Card from '../../Card';
import Text, { Title } from '../../Text';
import { PreviewImage, PreviewText } from '../../Preview';
import Solution, { Table, TH, TR, TD, TBody, SolutionOptions } from '../../Solution';
import Loading from '../../Loading';
import { readImage } from '../read-image';
import { solveCipher, getSavedSolutions, addSavedSolution, setSavedSolution } from '../../../api';

class Decipher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decipheringNewImage: false,
      savedSolutions: false,
      imageSrc: '',
      showReadStatus: false,
      readStatus: '',
      readProgress: 0,
      readPayload: '',
      decipheredText: '',
      decipheredLang: ''
    };
  }

  componentDidMount() {
    getSavedSolutions()
      .then((savedSolutions) => this.setState({ savedSolutions: savedSolutions.length ? savedSolutions : null }))
      .catch((err) => {
        this.setState({ savedSolutions: null });
        if (err.response) {
          this.props.onError(JSON.parse(err.response.body).message);
        }
      });
  }

  handleStartDecipher = () => this.fileSelector.click();

  handleReadProgress = (readStatus, readProgress) => {
    if (readStatus === 'recognizing text') {
      this.setState({ readStatus, readProgress });
      return;
    }
    this.setState({ readStatus });
  }

  previewImage = () => {
    this.setState({ showReadStatus: false, readPayload: '', decipheredText: '' });
    const file = this.fileSelector.files[0];
    if (!file) return;
    if (file.size > 3326850) {
      this.setState({ decipheringNewImage: false, readProgress: 0, imageSrc: '', showReadStatus: false, readPayload: '', decipheredText: '' });
      this.props.onError('Image size too large. Max image size is 3.3 MB. Did you crop out everything but the text?');
      return;
    }
    this.setState({ decipheringNewImage: true });
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
    .then((res) => this.setState({ decipheredText: res.result, decipheredLang: res.lang }))
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
    document.querySelector('#root').focus();
    this.props.onError('Copied to clipboard!');
  }

  handleSave = () => {
    const { readPayload, decipheredText, decipheredLang } = this.state;
    addSavedSolution(readPayload, decipheredLang, decipheredText)
      .then(() => this.props.onError('Solution saved! You can access it later.'))
      .catch((err) => {
        if (err.response) {
          this.props.onError(JSON.parse(err.response.body).message);
        }
      })
  }

  handleDeleteSavedSolution = (id) => {
    setSavedSolution(id, 'DELETE')
      .then(() => {
        const { savedSolutions } = this.state;
        // Get new savedSolutions array and set to null if it's empty
        const newSaved = savedSolutions.filter(s => s.id !== id);
        this.setState({ savedSolutions: newSaved.length ? newSaved : null });
      })
      .catch((err) => {
        if (err.response) {
          this.props.onError(JSON.parse(err.response.body).message);
        }
      })
  }

  generateSavedSolutions = () => this.state.savedSolutions.map((solution) => (
    <Solution key={solution.id}>
      <Card className="animated fadeIn">
        <Table>
          <TBody>
            <TR>
              <TH>Cipher</TH>
              <TH>Solution</TH>
              <TH small>Lang</TH>
            </TR>
            <TR bodyRow>
              <TD>{solution.cipher}</TD>
              <TD>{solution.solution}</TD>
              <TD>{solution.lang}</TD>
            </TR>
          </TBody>
        </Table>
        <SolutionOptions>
          <IconButton
            classes={{ root: this.props.classes.solutionOptionButton }}
            onClick={() => this.handleDeleteSavedSolution(solution.id)}
          >
            <DeleteIcon />
          </IconButton>
        </SolutionOptions>
      </Card>
    </Solution>
  ));

  render() {
    const { theme, classes } = this.props;
    const { decipheringNewImage, savedSolutions, imageSrc, showReadStatus, readStatus, readPayload, readProgress, decipheredText } = this.state;
    return (
      <Container className="main">
        <DecipherContainer visible={decipheringNewImage}>
          <React.Fragment>
            <Title>Image Decipher</Title>
            <Card>
              <MainContainer className="animated fadeIn">
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
                    <Text className="capitalize">{readStatus}</Text>
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
                        <Button variant="contained" color="primary" classes={{ root: classes.optionsButton }} onClick={this.handleSave}>Save</Button>
                      </OptionsContainer>
                    </MainContainer>
                  </Card>
                </ResultsContainer>
              )
            }
          </React.Fragment>
        </DecipherContainer>
        {
          !decipheringNewImage &&
          <React.Fragment>
            {
              !savedSolutions &&
              <MainContainer className="animated fadeIn">
                {
                  savedSolutions === false &&
                  <Loading loadingText="Loading Saved Solutions" />
                }
                {
                  savedSolutions === null &&
                  <Text className="fadedText">You have no saved solutions.</Text>
                }
              </MainContainer>
            }
            {
              savedSolutions !== null && savedSolutions.length > 0 &&
              <React.Fragment>
                <Title>Saved Solutions</Title>
                {this.generateSavedSolutions()}
              </React.Fragment>
            }
            <NewButtonContainer>
              <Tooltip title="Decipher an Image">
                <Fab color="secondary" onClick={this.handleStartDecipher}><AddIcon /></Fab>
              </Tooltip>
            </NewButtonContainer>
          </React.Fragment>
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
  },
  solutionOptionButton: {
    color: 'rgba(255, 255, 255, 0.4)',
    marginLeft: 8,
    padding: 0,
    width: 36,
    height: 36
  }
});

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const DecipherContainer = styled.div`
  display: ${({ visible }) => visible ? 'block' : 'none'};
`;

const MainContainer = styled.div`
  padding: 16px;
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

const NewButtonContainer = styled.div`
  position: absolute;
  bottom: 100px;
  right: 100px;
  @media (max-width: 768px) {
    bottom: 96px;
    right: 48px;
  }
`;

export default withStyles(styles)(withTheme(Decipher));