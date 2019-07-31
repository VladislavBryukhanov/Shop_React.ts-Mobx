import { Theme, createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  card: {
    maxWidth: 260,
    padding: 20,
    background: "white",
    margin: "auto",
  },
  media: {
    cursor: "pointer",
    paddingTop: '100%'
  },
  input: {
    display: 'none',
  },
});
