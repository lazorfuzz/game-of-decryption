import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar'
import AccountIcon from '@material-ui/icons/AccountCircle';
import VPNKeyIcon from '@material-ui/icons/VpnKey';
import EmailIcon from '@material-ui/icons/Email';
import { MuiThemeProvider } from '@material-ui/core/styles';
import muiTheme from './mui-theme';
import './App.css';
import { BaseInput } from './components/Input';
import Hero from './components/Hero';
import Home from './components/Home';
import Footer from './components/Footer';
import { Title } from './components/Text';
import { login, signup } from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pathname: 'login',
      showSnack: false,
      snackbarText: 'Login failed.',
      username: '',
      password: '',
      email: '',
      creatingAccount: false
    };
  }

  handleSnackbarClose = () => this.setState({ showSnack: false });

  handleError = (err) => this.setState({ showSnack: true, snackbarText: err });

  handleLogin = () => {
    const { username, password } = this.state;
    login(username, password)
      .then((data) => {
        if (data.token) {
          this.setState({ pathname: 'home' });
        } else {
          this.setState({
            showSnack: true,
            snackbarText: 'Incorrect username or password!'
          });
        }
      })
      .catch((err) => {
        const error = JSON.parse(err.response.body);
        this.setState({ showSnack: true, snackbarText: error.message });
      });
  }

  handleSignUp = () => {
    const { username, password, email } = this.state;
    signup(username, email, password)
      .then((data) => {
        if (data.status && data.status === 'success') {
          this.setState({
            showSnack: true,
            snackbarText: 'Account successfully created!',
            creatingAccount: false
          });
          return;
        }
        this.setState({
          showSnack: true,
          snackbarText: 'Failed to create account.',
          creatingAccount: false
        });
      })
      .catch((err) => {
        const error = JSON.parse(err.response.body);
        this.setState({ showSnack: true, snackbarText: error.message });
      });
  }

  handleCreateAccountToggle = () => {
    const { creatingAccount } = this.state;
    this.setState({ creatingAccount: !creatingAccount });
  }

  render() {
    const { pathname, showSnack, snackbarText, username, password, email, creatingAccount } = this.state;
    return (
      <MuiThemeProvider theme={muiTheme}>
        {
          pathname === 'login' && (
            <Wrapper>
              <LoginContainer>
                <Hero>
                  <Title className="heroTitle">{creatingAccount ? 'Create My Account' : 'Login'}</Title>
                </Hero>
                <Form>
                  <InputContainer>
                    <AccountIcon className="loginIcon" />
                    <BaseInput
                      className="loginInput"
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(evt) => this.setState({ username: evt.target.value })}
                    />
                  </InputContainer>
                  {
                    creatingAccount && (
                      <InputContainer>
                        <EmailIcon className="loginIcon" />
                        <BaseInput
                          className="loginInput"
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(evt) => this.setState({ email: evt.target.value })}
                        />
                      </InputContainer>
                    )
                  }
                  <InputContainer>
                    <VPNKeyIcon className="loginIcon" />
                    <BaseInput
                      className="loginInput"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(evt) => this.setState({ password: evt.target.value })}
                      onKeyUp={(evt) => {
                        if (evt.keyCode === 13) this.handleLogin();
                      }}
                    />
                  </InputContainer>
                  <Actions>
                    <Button
                      className="loginButton"
                      variant="contained"
                      color="primary"
                      onClick={creatingAccount ? this.handleSignUp : this.handleLogin}
                    >
                      {creatingAccount ? 'Create My Account' : 'Login'}
                    </Button>
                    <Button
                      className="loginButton signupButton"
                      color="primary"
                      onClick={this.handleCreateAccountToggle}
                    >
                      {creatingAccount ? 'Login' : 'Create Account'}
                    </Button>
                  </Actions>
                </Form>
              </LoginContainer>
            </Wrapper>
          )
        }
        {
          pathname === 'home' && (
            <Home onError={this.handleError} />
          )
        }
        <Footer />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={showSnack}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackbarText}</span>}
        />
      </MuiThemeProvider>
    );
  }
}

export default App;

const Wrapper = styled.div`
  display: flex;
  padding-top: 3rem;
  align-items: center;
  flex-flow: column;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-flow: column;
  background: rgb(82, 94, 114);
  width: 450px;
  padding-bottom: 16px;
  max-width: 95%;
  max-height: 80%;
  border-radius: 4px;
  margin-bottom: 3rem;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
`;

const InputContainer = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 4px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin: 8px 0;
  background: rgba(30, 43, 49, 0.7);
  border-radius: 4px;
  padding: 8px;
  transition: 150ms ease-in;
  &:hover {
    background: rgba(30, 43, 49, 0.8);
  }
  &:active {
    background: rgba(30, 43, 49, 0.9);
  }
  width: 450px;
  max-width: 95%;
`;

const Form = styled.div`
  margin-top: 1em;
  width: 450px;
  max-width: 90%;
  padding: 0 16px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`;