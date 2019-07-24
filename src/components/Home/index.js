import React, { Component } from 'react';
import styled from 'styled-components';
import LioWebRTC from 'liowebrtc';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import PanoIcon from '@material-ui/icons/Photo';
import OrgIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import MemberArea from './MemberArea';
import Decipher from './Decipher';
import Organization from './Organization';
import Settings from './Settings';
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
      messages: []
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
    this.webrtc.on('createdPeer', this.handleCreatedPeer);
    this.webrtc.on('receivedPeerData', this.handleReceivedPeerData);
  }

  componentWillUnmount() {
    this.webrtc.quit();
  }

  joinRoom = ()  => {
    const { organization } = currentUser;
    this.webrtc.joinRoom(`game-of-decryption-${organization}`);
  }

  handleCreatedPeer = (peer) => {
    const peers = this.webrtc.getPeers();
    this.setState({ online: peers });
    setTimeout(() => this.setState({ onlineCount: peers.length + 1}), 1000);
  }

  handleReceivedPeerData = (type, paylaod, peer) => {

  }

  changePage = (page) => {
    // Where the magic happens in our self-rolled hash routing system
    this.setState({ page });
    window.location.hash = page;
  }

  render() {
    const { classes } = this.props;
    const { page, organization, online, onlineCount } = this.state;
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
            <Tooltip title="Settings">
              <IconButton onClick={() => this.changePage('#settings')} classes={{ root: page === '#settings' ? classes.optionButtonSelected : classes.optionButton }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Option>
        </OptionsBar>
        {
          page === '#home' && <MemberArea />
        }
        {
          page === '#decipher' && <Decipher onError={this.props.onError} />
        }
        {
          page === '#organization' &&
          <Organization
            organization={organization}
            online={online}
            onlineCount={onlineCount}
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
      </Wrapper>
    );
  }
}

const styles = theme => ({
  optionButtonSelected: {
    color: 'white'
  },
  optionButton: {
    color: 'rgba(0, 0, 0, .4)'
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
  z-index: 5;
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
