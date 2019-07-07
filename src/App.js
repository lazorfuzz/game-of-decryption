import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar'
import AccountIcon from '@material-ui/icons/AccountCircle';
import VPNKeyIcon from '@material-ui/icons/VpnKey';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import EmailIcon from '@material-ui/icons/Email';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import muiTheme from './mui-theme';
import './App.css';
import { BaseInput, InputContainer } from './components/Input';
import Hero from './components/Hero';
import Home from './components/Home';
import Footer from './components/Footer';
import { Title } from './components/Text';
import { login, signup, getOrganization } from './api';

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
      creatingAccount: false,
      selectedOrganization: 1,
      organizations: []
    };
  }

  componentDidMount() {
    getOrganization('all')
      .then(organizations => this.setState({ organizations }))
      .catch(console.error);
  }

  handleSnackbarClose = () => this.setState({ showSnack: false });

  handleError = (err) => {
    this.setState({ showSnack: true, snackbarText: err });
    if (err.includes('auth token')) {
      this.handleLogOut();
    }
  }

  handleLogin = () => {
    const { username, password } = this.state;
    if (!username || !password) {
      return;
    }
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
        if (!err.response) {
          this.setState({ showSnack: true, snackbarText: err.message });
          return;
        }
        const error = JSON.parse(err.response.body);
        this.setState({ showSnack: true, snackbarText: error.message });
      });
  }

  handleLogOut = () => this.setState({ pathname: 'login', username: '', password: '', email: '' });

  handleSignUp = () => {
    const { username, password, email, selectedOrganization } = this.state;
    if (!username || !password || !email) {
      return;
    }
    signup(username, email, password, selectedOrganization)
      .then((data) => {
        if (data.status && data.status === 'success') {
          this.setState({
            showSnack: true,
            snackbarText: 'Account successfully created!',
            creatingAccount: false,
            password: ''
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
    const { classes } = this.props;
    const { pathname, showSnack, snackbarText, username, password, email, creatingAccount, organizations, selectedOrganization } = this.state;
    return (
      <MuiThemeProvider theme={muiTheme}>
        {
          pathname === 'login' && (
            <Wrapper>
              <LoginContainer className="animated fadeIn">
                <Hero>
                  <Title className="heroTitle">{creatingAccount ? 'Create My Account' : 'Login'}</Title>
                </Hero>
                <Form>
                  <InputContainer>
                    <AccountIcon className="loginIcon" />
                    <BaseInput
                      className="loginInput"
                      type="text"
                      maxLength={80}
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
                          maxLength={80}
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
                      maxLength={80}
                      placeholder="Password"
                      value={password}
                      onChange={(evt) => this.setState({ password: evt.target.value })}
                      onKeyUp={(evt) => {
                        if (evt.keyCode === 13) creatingAccount ? this.handleSignUp() : this.handleLogin();
                      }}
                    />
                  </InputContainer>
                  {
                    creatingAccount && (
                      <FormControl>
                        <InputLabel htmlFor="organization-native-simple" classes={{ root: classes.inputLabelRoot, focused: classes.inputLabelFocused }}>Organization</InputLabel>
                        <Select
                          classes={{ root: classes.orgSelectRoot }}
                          native
                          value={selectedOrganization}
                          onChange={({ target }) => this.setState({ selectedOrganization: target.value })}
                          inputProps={{
                            name: 'organization',
                            id: 'organization-native-simple',
                          }}
                        >
                          {
                            organizations.map((org) => (
                              <option key={org.id} value={org.id}>{org.name}</option>
                            ))
                          }
                        </Select>
                      </FormControl>
                    )
                  }
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
            <Home onError={this.handleError} organizations={organizations} onLogOut={this.handleLogOut} />
          )
        }
        <Footer shifted={pathname === 'home'} />
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

const styles = ({
  inputLabelRoot: {
    color: '#cecece',
  },
  inputLabelFocused: {
    color: 'white !important',
  },
  orgSelectRoot: {
    color: 'white',
    width: 200
  }
});

const Wrapper = styled.div`
  display: flex;
  padding-top: 3rem;
  align-items: center;
  flex-flow: column;
  margin-bottom: 3rem;
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

const Form = styled.div`
  margin-top: 1em;
  width: 450px;
  max-width: 90%;
  padding: 0 16px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

export default withStyles(styles)(App);
