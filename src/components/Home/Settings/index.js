import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import Card from '../../Card';
import Loading from '../../Loading';
import Text, { Title } from '../../Text';
import { currentUser, setUser } from '../../../api';


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDeleteAccount: false,
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

  render() {
    const { classes } = this.props;
    const { confirmDeleteAccount } = this.state;
    return (
      <Container className="main">
        <Title>Account</Title>
        <Card>
          <CardBody>
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
    color: '#ffffff',
    '&:hover': {
      background: '#ff5f5c'
    }
  },
  dialog: {
    background: 'rgb(82, 94, 114)',
    color: '#cecece',
    padding: '24px 32px 8px 32px'
  },
  dialogButton: {
    color: 'white',
    fontWeight: 'bold'
  }
});

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const CardBody = styled.div`
  padding: 8px 16px;
`;

export default withStyles(styles)(Settings);