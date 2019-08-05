import { Theme } from '@material-ui/core/styles';
import { createStyles } from "@material-ui/core";

export const styles = (theme: Theme) => createStyles({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
});