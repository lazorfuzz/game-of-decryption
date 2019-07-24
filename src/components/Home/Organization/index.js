import React, { Component } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import { deepPurple } from '@material-ui/core/colors';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Card from '../../Card';
import Loading from '../../Loading';
import Text, { Title } from '../../Text';
import { currentUser } from '../../../api';


class Organization extends Component {
  generateUsers = () => this.props.organization.users.map((user) => (
    <React.Fragment key={user.username}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar classes={{ root: user.role === 'admin' ? this.props.classes.adminAvatar : this.props.classes.standardAvatar }}>
            {user.username.slice(0, 2).toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          classes={{ primary: this.props.classes.upper, root: this.props.classes.listText }}
          primary={user.username}
          secondary={user.role}
        />
        <OnlineIndicator online={this.props.online.filter(p => p.nick === user.username).length > 0 || user.username === currentUser.username} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  ))

  render() {
    const { online, onlineCount, organization } = this.props;
    return (
      <Container className="main">
        <Title>My Organization</Title>
        <Text>{`${currentUser.organization} Members Online: ${onlineCount}`}</Text>
        <Card>
          <CardBody className="animated fadeIn">
            {
              this.props.organization !== null &&
              <List>{this.generateUsers()}</List>
            }
          </CardBody>
        </Card>
      </Container>
    );
  }
}

const styles = ({
  adminAvatar: {
    backgroundColor: deepPurple[500],
  },
  standardAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  upper: {
    textTransform: 'capitalize'
  },
  listText: {
    flex: 'auto'
  }
});

const Container = styled.div`
  display: flex;
  flex-flow: column;
`;

const CardBody = styled.div`
  padding: 8px 16px;
`;

const OnlineIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100rem;
  background: ${({online}) => online ? '#2dc469' : 'rgba(255, 255, 255, 0.5)'};
  margin: auto 0;
`;

export default withTheme(withStyles(styles)(Organization));