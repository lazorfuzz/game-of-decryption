import React, { Component } from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import { deepPurple } from '@material-ui/core/colors';
import { withStyles, withTheme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import StarIcon from '@material-ui/icons/Star';
import EmailIcon from '@material-ui/icons/Email';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Avatar from '@material-ui/core/Avatar';
import Card from '../../Card';
import { BaseInput, InputContainer } from '../../Input';
import Loading from '../../Loading';
import Text, { Title } from '../../Text';
import { currentUser, setUser } from '../../../api';
import './Organization.css';


/**
 * Organization page
 *
 * @class Organization
 * @extends {Component}
 */
class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      editingUsername: '',
      editingRole: '',
      editingOrganization: 0
    };
  }
  generateUsers = () => {
    const { organizations, classes } = this.props;
    const { users } = this.props.organization;
    const { editing, editingUsername, editingRole, editingOrganization } = this.state;
    // Sort by online
    const sortedUsers = users.map((user) => {
      const online = this.props.online.filter(p => p.nick === user.username).length > 0 || user.username === currentUser.username;
      return { ...user, online };
    }).sort((a, b) => b.online - a.online);
    return sortedUsers.map((user) => {
      const selectedOrganization = user.org_id;
      return (
        <React.Fragment key={user.username}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar classes={{ root: user.role === 'admin' ? classes.adminAvatar : classes.standardAvatar }}>
                {user.username.slice(0, 2).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            {
              editing === user.id ?
              <UserEditor>
                <InputContainer className="userEditInput">
                  <EmailIcon className="loginIcon" />
                  <BaseInput
                    className="loginInput"
                    type="text"
                    placeholder="Email"
                    value={editingUsername}
                    onChange={({ target }) => this.setState({ editingUsername: target.value })}
                  />
                </InputContainer>
                <InputContainer className="userEditInput">
                  <StarIcon className="loginIcon" />
                  <BaseInput
                    className="loginInput"
                    type="text"
                    placeholder="Role"
                    value={editingRole}
                    onChange={({ target }) => this.setState({ editingRole: target.value })}
                  />
                </InputContainer>
                <FormControl>
                  <InputLabel htmlFor="organization-native-simple" classes={{ root: classes.inputLabelRoot, focused: classes.inputLabelFocused }}>Organization</InputLabel>
                  <Select
                    classes={{ root: classes.orgSelectRoot }}
                    native
                    value={editingOrganization}
                    onChange={({ target }) => this.setState({ editingOrganization: target.value })}
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
              </UserEditor>
              :
              <ListItemText
                classes={{ primary: classes.upper, root: classes.listText }}
                primary={user.username}
                secondary={user.role}
              />
            }
            {
              currentUser.role === 'admin' &&
              <React.Fragment>
                <IconButton
                  classes={{ root: classes.userOptionButton }}
                  onClick={() => this.handleUserEdit(user.id, editing === user.id, user.username, user.role)}
                >
                  {
                    editing === user.id ? <DoneIcon /> : <EditIcon />
                  }
                </IconButton>
                {
                  editing !== user.id &&
                  <IconButton
                    classes={{ root: classes.userOptionButton }}
                    onClick={() => this.handleUserDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              </React.Fragment>
            }
            {
              editing !== user.id &&
              <OnlineIndicator online={user.online} />
            }
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      );
    });
  }

  handleUserDelete = (id) => {
    setUser(id, 'DELETE')
      .then(() => this.props.onOrganizationsRefresh())
      .catch(console.error);
  }

  handleUserEdit = (id, doneEditing = false, username, role) => {
    const { editingUsername, editingRole, editingOrganization } = this.state;
    if (doneEditing) {
      setUser(id, 'PUT', { username: editingUsername, role: editingRole, org_id: editingOrganization })
        .then(() => {
          this.setState({ editing: null });
          this.props.onOrganizationsRefresh();
        })
        .catch(console.error);
    } else {
      this.setState({
        editing: id,
        editingUsername: username,
        editingRole: role,
        editingOrganization: this.props.organization.id
      });
    }
  }

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
  },
  userOptionButton: {
    margin: 'auto 4px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  orgSelectRoot: {
    color: 'white',
    width: 100
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
  min-width: 12px;
  border-radius: 100rem;
  background: ${({online}) => online ? '#2dc469' : 'rgba(255, 255, 255, 0.5)'};
  margin: auto 0;
  margin-left: 24px;
`;

const UserEditor = styled.div`
  flex: auto;
  display: flex;
  overflow-x: auto;
`;

export default withTheme(withStyles(styles)(Organization));