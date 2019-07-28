import React, { Component } from 'react';
import styled from 'styled-components';
import LioWebRTC from 'liowebrtc';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MessageIcon from '@material-ui/icons/Message';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import PanoIcon from '@material-ui/icons/Photo';
import OrgIcon from '@material-ui/icons/People';
import MemberArea from './MemberArea';
import ChatPage from './ChatPage';
import Decipher from './Decipher';
import Organization from './Organization';
import Settings from './Settings';
import Chat from './Chat';
import { getOrganization, currentUser } from '../../api';
import './Home.css';

/**
 * The root component of our logged-in app tree.
 *
 * @class Home
 * @extends {Component}
 */
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: window.location.hash || '#home',
      organization: null,
      online: [],
      onlineCount: 1,
      messages: [],
      openChat: false,
      unseenMessages: 0
    };
  }

  componentDidMount() {
    // Fetch info about organization
    getOrganization(currentUser.organization)
      .then(organization => this.setState({ organization }))
      .catch(console.error);
    // Initialize LioWebRTC and make ourselves 'online'
    this.webrtc = new LioWebRTC({
      debug: true,
      dataOnly: true,
      nick: currentUser.username
    });
    // Create event handlers for WebRTC
    this.webrtc.on('ready', this.joinRoom);
    this.webrtc.on('createdPeer', this.handlePeerChange);
    this.webrtc.on('removedPeer', this.handlePeerChange)
    this.webrtc.on('receivedPeerData', this.handleReceivedPeerData);
  }

  componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;
    if (prevState.page !== page && page === '#organization') {
      getOrganization(currentUser.organization)
      .then(organization => this.setState({ organization }))
      .catch(console.error);
    }
  }

  componentWillUnmount() {
    this.webrtc.quit();
  }

  joinRoom = ()  => {
    const { organization } = currentUser;
    this.webrtc.joinRoom(`game-of-decryption-${organization}`);
  }

  handlePeerChange = (peer) => {
    const peers = this.webrtc.getPeers();
    this.setState({ online: peers });
    setTimeout(() => this.setState({ onlineCount: peers.length + 1}), 1000);
  }

  handleReceivedPeerData = (type, payload, peer) => {
    switch (type) {
      case 'chat':
        const { messages, page, openChat, unseenMessages } = this.state;
        const { sender, timestamp, message } = payload;
        this.setState({ messages: [...messages, { sender, timestamp, message }] });
        if (page === '#messages' || openChat) return;
        this.setState({ unseenMessages: unseenMessages + 1 });
      break;
      default: break;
    }
  }

  handleUpdatedSettings = () => {
    getOrganization(currentUser.organization)
      .then(organization => this.setState({ organization }))
      .catch(console.error);
  }

  changePage = (page) => {
    // Where the magic happens in our self-rolled hash routing system
    this.setState({ page });
    window.location.hash = page;
  }

  handleToggleChat = () => {
    const { openChat } = this.state;
    this.setState({ openChat: !openChat, unseenMessages: 0 });
  }

  handleSendChat = (message) => {
    const { messages } = this.state;
    const payload = {
      sender: {
        username: currentUser.username,
        role: currentUser.role
      },
      message,
      timestamp: new Date()
    };
    if (message.length > 1) {
      this.webrtc.shout('chat', payload);
      this.setState({ messages: [...messages, payload]});
    }
  }

  handleResetUnseen = () => this.setState({ unseenMessages: 0 });

  render() {
    const { classes } = this.props;
    const { page, organization, online, onlineCount, openChat, messages, unseenMessages } = this.state;
    return (
      <Wrapper>
        <OptionsBar>
          <Option>
            <Tooltip title="Home">
              <IconButton onClick={() => this.changePage('#home')} classes={{ root: page === '#home' ? classes.optionButtonSelected : classes.optionButton }}>
                <HomeIcon />
              </IconButton>
            </Tooltip>
          </Option>
          <Option>
            <Tooltip title="Decipher">
              <IconButton onClick={() => this.changePage('#decipher')} classes={{ root: page === '#decipher' ? classes.optionButtonSelected : classes.optionButton }}>
                <PanoIcon />
              </IconButton>
            </Tooltip>
          </Option>
          <Option>
            <Tooltip title="Organization">
              <IconButton onClick={() => this.changePage('#organization')} classes={{ root: page === '#organization' ? classes.optionButtonSelected : classes.optionButton }}>
                <OrgIcon />
              </IconButton>
            </Tooltip>
          </Option>
          <Option>
            <Tooltip title="Messages">
              <Badge classes={{ badge: classes.badge }} color="primary" badgeContent={unseenMessages}>
                <IconButton onClick={() => window.innerWidth < 786 ? this.changePage('#messages') : this.handleToggleChat()} classes={{ root: page === '#messages' ? classes.optionButtonSelected : classes.optionButton }}>
                  <MessageIcon />
                </IconButton>
              </Badge>
            </Tooltip>
          </Option>
        </OptionsBar>
        <Chat
          isOpen={openChat}
          messages={messages}
          onToggleChat={this.handleToggleChat}
          onSendChat={this.handleSendChat}
        />
        {
          page === '#home' && <MemberArea onChangePage={this.changePage} />
        }
        {
          page === '#decipher' && <Decipher onError={this.props.onError} />
        }
        {
          page === '#organization' &&
          <Organization
            organization={organization}
            organizations={this.props.organizations}
            online={online}
            onlineCount={onlineCount}
            onOrganizationsRefresh={this.handleUpdatedSettings}
          />
        }
        {
          page === '#settings' && 
          <Settings
            changePage={this.changePage}
            organizations={this.props.organizations}
            onChangeSettings={this.handleUpdatedSettings}
            onLogOut={this.props.onLogOut}
            onError={this.props.onError}
          />
        }
        {
          page === '#messages' &&
          <ChatPage
            isOpen
            messages={messages}
            onToggleChat={this.handleToggleChat}
            onSendChat={this.handleSendChat}
            onResetUnseen={this.handleResetUnseen}
          />
        }
      </Wrapper>
    );
  }
}

const styles = ({
  optionButtonSelected: {
    color: 'white'
  },
  optionButton: {
    color: 'rgba(0, 0, 0, .4)'
  },
  badge: {
    top: 8,
    right: 8
  }
})

const Wrapper = styled.div`
  display: flex;
  padding-top: 3rem;
  align-items: center;
  flex-flow: column;
  margin-bottom: 3rem;
  margin-left: 96px;
  transition: all 150ms ease-in;
  @media (max-width: 960px) {
    width: calc(100% - 96px);
  }
  @media (max-width: 768px) {
    margin: auto;
    width: 100%;
    margin-bottom: 96px;
    padding-top: 1em;
  }
`;

const OptionsBar = styled.div`
  display: flex;
  z-index: 15;
  transition: width 150ms ease-in;
  flex-flow: column;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 96px;
  background: rgb(82, 94, 114);
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
  @media (max-width: 768px) {
    top: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 56px;
    flex-flow: row;
    justify-content: space-around;
  }
`;

const Option = styled.div`
margin: 24px 0;
@media (max-width: 768px) {
  margin: 0 18px;
}
`;

export default withStyles(styles)(Home);
