import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import { motion } from 'framer-motion';

class Chat extends Component {
  generateChats = () => {
    const { classes } = this.props;
    return this.props.messages.map((message) => (
      <ChatMessage>
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
      <Wrapper animate={isOpen ? 'open' : 'closed'} variants={variants}>
          <IconButton classes={{ root: classes.backButton }} onClick={this.props.onToggleChat}>
            <BackIcon />
          </IconButton>
          <ChatLog>
            {this.generateChats()}
          </ChatLog>
          <ChatInput
            ref={(chatInput) => this.chatInput = chatInput}
            onKeyUp={this.handleKeyUp}
            placeholder="Enter a message"
          />
      </Wrapper>
    );
  }
}

const variants = {
  open: { scale: 1, x: 0, width: 270},
  closed: { x: -100, scale: .01, width: 0 },
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
})

const Wrapper = styled(motion.div)`
  display: flex;
  flex-flow: column;
  width: 0px;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  padding-left: 110px;
  padding-top: 16px;
  background: rgb(47, 57, 74);
  z-index: 10;
  -webkit-box-shadow: 10px 0px 14px -10px rgba(0,0,0,1);
  -moz-box-shadow: 10px 0px 14px -10px rgba(0,0,0,1);
  box-shadow: 10px 0px 14px -10px rgba(0,0,0,1);
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
  height: calc(100% - 180px);
  overflow-y: auto;
  color: white;
  font-size: 16px;
`;

const ChatInput = styled.textarea`
  position: absolute;
  bottom: 24px;
  border: 1px solid rgba(255, 255, 255, .1);
  background-color: rgb(24, 28, 37);
  height: 80px;
  width: 250px;
  color: white;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  padding: 4px;
`;



export default withStyles(styles)(Chat);
