import { Theme, createStyles } from "@material-ui/core";

export const styles = (theme: Theme) => createStyles({
  chatBody: {
    height: '70vh',
    padding: 0
  },
  messageList: {
    maxHeight: 'calc(100% - 112px)',
    overflow: 'auto',
    width: '100%',
    height: '100%',
    paddingRight: 20
  },
  messageInput: {
    width: '100%',
    padding: 0
  },
  toolbar: {
    backgroundColor: 'white',
    width: '100%'
  },

  message: {
    margin: 8,
    width: '100%',
    
    '& .content': {
      border: '1px solid #282828',
      padding: '4px 8px',
      color: 'white',
      borderRadius: 6,
      wordWrap: 'break-word',
    },
    '& .dateOfSend': {
      display: 'inline-block',
      color: '#aaa',
      margin: '0 5px',
      fontSize: '10px',
      verticalAlign: 'middle',
    },
    '& .arrow-left': {
      width: 0,
      height: 0,
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      borderRight:'10px solid #1A567B',
    },
  
    '& .incoming': {
      display: 'flex',
      flexDirection: 'row',
      '& .content': {
        backgroundColor: '#243443',
      }
    },
    '& .outcome': {
      display: 'flex',
      flexDirection: 'row-reverse',
      '& .content': {
        backgroundColor: '#1A567B',
      },
      '& .dateOfSend': {
        textAlign: 'right',
      }
    }
  }
})