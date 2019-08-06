import { Theme, createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  userList: {
    paddingLeft: 64
  },
  creationDate: {
    textAlign: 'right'
  },
  buttonLinkWrapper: {
    margin: 0,
    padding: 0,
    alignItems: 'center'
  }
});
