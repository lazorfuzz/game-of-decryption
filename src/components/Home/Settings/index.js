import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import EmailIcon from '@material-ui/icons/Email';
import AccountIcon from '@material-ui/icons/AccountCircle';
import StarIcon from '@material-ui/icons/Stars';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import Card, { HR } from '../../Card';
import { BaseInput, InputContainer } from '../../Input';
import Text, { Title } from '../../Text';
import { currentUser, setUser } from '../../../api';


/**
 * Settings page
 *
 * @class Settings
 * @extends {Component}
 */
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDeleteAccount: false,
      accountEmail: currentUser.email,
      accountRole: currentUser.role,
      accountUsername: currentUser.username,
      selectedOrganization: currentUser.org_id
    };
  }

  handleDeleteAccount = () => {
    setUser(currentUser.id, 'DELETE')
      .then(() => {
        this.props.onLogOut();
      })
      .catch(console.error);
  }

  handleDialogClose = () => this.setState({ confirmDeleteAccount: false });

  handleChangeEmail = (evt) => this.setState({ accountEmail: evt.target.value });

  handleChangeRole = (evt) => this.setState({ accountRole: evt.target.value });

  handleChangeUsername = (evt) => this.setState({ accountUsername: evt.target.value });

  handleSettingsSubmit = () => {
    const { accountEmail, accountRole, accountUsername, selectedOrganization } = this.state;
    setUser(currentUser.id, 'PUT', {
      username: accountUsername,
      role: accountRole,
      email: accountEmail,
      org_id: selectedOrganization
    })
      .then((res) => {
        this.props.changePage('#home');
        this.props.onChangeSettings();
      })
      .catch((err) => {
        console.error(err);
        const error = JSON.parse(err.response.body);
        this.props.onError(error);
      });
  }

  render() {
    const { classes, organizations } = this.props;
    const { confirmDeleteAccount, accountEmail, selectedOrganization, accountRole, accountUsername } = this.state;
    return (
      <Container className="main">
        <Title>Account</Title>
        <Card>
          <CardBody className="animated fadeIn">
            <SettingsRow>
              <SettingsLabel>
                <Text>My Email</Text>
              </SettingsLabel>
              <SettingsField>
                <InputContainer>
                  <EmailIcon className="loginIcon" />
                  <BaseInput
                    className="loginInput"
                    type="email"
                    placeholder="Email"
                    value={accountEmail}
                    onChange={this.handleChangeEmail}
                  />
                </InputContainer>
              </SettingsField>
            </SettingsRow>
            <SettingsRow>
              <SettingsLabel>
                <Text>My Username</Text>
              </SettingsLabel>
              <SettingsField>
                <InputContainer>
                  <AccountIcon className="loginIcon" />
                  <BaseInput
                    className="loginInput"
                    type="text"
                    placeholder="Username"
                    value={accountUsername}
                    onChange={this.handleChangeUsername}
                  />
                </InputContainer>
              </SettingsField>
            </SettingsRow>
            <SettingsRow>
              <SettingsLabel>
                <Text>My Role</Text>
              </SettingsLabel>
              <SettingsField>
                <InputContainer>
                  <StarIcon className="loginIcon" />
                  <BaseInput
                    className="loginInput"
                    type="email"
                    disabled={currentUser.role !== 'admin'}
                    value={accountRole}
                    onChange={this.handleChangeRole}
                  />
                </InputContainer>
              </SettingsField>
            </SettingsRow>
            <SettingsRow>
              <SettingsLabel>
                <Text>My Organization</Text>
              </SettingsLabel>
              <SettingsField>
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
              </SettingsField>
            </SettingsRow>
            <Button onClick={this.handleSettingsSubmit} variant="contained" classes={{ root: classes.saveButton }} color="primary">Save Changes</Button>
            <HR />
            <Button onClick={() => this.setState({ confirmDeleteAccount: true })} variant="contained" classes={{ root: classes.deleteButton }}>Delete My Account</Button>
          </CardBody>
        </Card>
        <Dialog classes={{ paper: classes.dialog }} open={confirmDeleteAccount} onClose={this.handleDialogClose}>
          Are you sure you want to delete your account?
          <DialogActions>
            <Button onClick={this.handleDeleteAccount} classes={{ root: classes.dialogButton }}>Yes</Button>
            <Button onClick={this.handleDialogClose} classes={{ root: classes.dialogButton }}>No</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

const styles = ({
  deleteButton: {
    background: '#ff514d',
    width: 200,
    color: '#ffffff',
    marginBottom: 16,
    '&:hover': {
      background: '#c13d3a'
    }
  },
  saveButton: {
    marginTop: 32,
  },
  dialog: {
    background: 'rgb(82, 94, 114)',
    color: '#cecece',
    padding: '24px 32px 8px 32px'
  },
  dialogButton: {
    color: 'white',
    fontWeight: 'bold'
  },
  orgSelectRoot: {
    color: 'white',
    width: 250
  }
});

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const CardBody = styled.div`
  padding: 8px 16px;
`;

const SettingsRow = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-flow: column;
  }
`;

const SettingsLabel = styled.div`
  min-width: 15%;
  margin-right: 16px;
  @media (max-width: 768px) {
    margin-bottom: -8px;
  }
`;

const SettingsField = styled.div`
  max-width: 65%;
  min-width: 180px;
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export default withStyles(styles)(Settings);