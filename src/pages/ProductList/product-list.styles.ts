import { Theme, createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
  productList: {
    paddingLeft: 64
  },
  card: {
    width: 250,
  },
  media: {
    paddingTop: '80%'
  },
  price: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  productItem: {
    margin: 'auto',
    paddingTop: 16,
    paddingBottom: 16
  },
  fabExclude: {
    backgroundColor: 'grey',
    color: 'white'
  }
});
