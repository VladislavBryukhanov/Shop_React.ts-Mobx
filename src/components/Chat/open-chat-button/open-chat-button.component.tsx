import React, { useState } from 'react';
import { Dialog, Fab, Icon, withStyles } from '@material-ui/core';
import { styles } from './open-chat-button.styles';
import Chat from '../../../pages/Chat/chat.component';

interface IOpeneChatButtonProps {
  classes: any
}
const OpenChatButton: React.FC<IOpeneChatButtonProps> = (props: IOpeneChatButtonProps) => {
  const [ open, changeDialogState ] = useState(false);

  return (
    <>
      <Fab 
        color="secondary"
        className={props.classes.fab}
        onClick={() => changeDialogState(true)}
      >
        <Icon>chat</Icon>
      </Fab>

      <Dialog 
        fullWidth
        maxWidth={'xs'}
        open={open}
        onClose={() => changeDialogState(false)}
      >
        <Chat/>
      </Dialog>
    </>
  )
};

export default withStyles(styles)(OpenChatButton);