import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import BackIcon from '@material-ui/icons/KeyboardBackspace';

class ChatPage extends Component {
  componentDidMount() {
    this.props.onResetUnseen();
    this.scrollDown();
  }

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    if (messages.length > prevProps.messages.length) {
      this.scrollDown();
      this.props.onResetUnseen();
    }
  }

  scrollDown = () => setTimeout(() => this.chatLog.scrollTop = this.chatLog.scrollHeight, 50);

  generateChats = () => {
    const { classes } = this.props;
    return this.props.messages.map((message) => (
      <ChatMessage key={message.timestamp}>
        <Avatar classes={{ root: message.sender.role === 'admin' ? classes.adminAvatar : classes.standardAvatar }}>
          {message.sender.username.slice(0, 2).toUpperCase()}
        </Avatar>
        <ChatBody>{message.message}</ChatBody>
      </ChatMessage>
    ));
  }

  handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      this.props.onSendChat(evt.target.value);
      this.chatInput.value = '';
    }
  }

  render() {
    const { isOpen, classes } = this.props;
    return (
      <Container className="main">
        <ChatLog ref={(chatLog) => this.chatLog = chatLog}>
          {this.generateChats()}
        </ChatLog>
        <ChatInput
          ref={(chatInput) => this.chatInput = chatInput}
          onKeyUp={this.handleKeyUp}
          placeholder="Enter a message"
        />
      </Container>
    );
  }
}

const styles = ({
  adminAvatar: {
    backgroundColor: deepPurple[500],
    margin: 'auto 4px'
  },
  standardAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 'auto 4px'
  },
  backButton: {
    width: 48,
    height: 48,
    color: 'white'
  }
});

const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  align-items: center;
`;

const ChatMessage = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 8px;
  display: flex;
`;

const ChatBody = styled.p`
  font-weight: 300;
  margin-left: 8px;
`;

const ChatLog = styled.div`
  width: 100%;
  height: calc(100vh - 240px);
  overflow-y: auto;
  color: white;
  font-size: 16px;
`;

const ChatInput = styled.textarea`
  position: fixed;
  bottom: 64px;
  border: 1px solid rgba(255, 255, 255, .1);
  background-color: rgb(24, 28, 37);
  height: 80px;
  width: 90%;
  color: white;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  padding: 4px;
`;



export default withStyles(styles)(ChatPage);
