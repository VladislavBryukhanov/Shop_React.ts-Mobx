import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { inject, observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import { RootStore } from '../../stores/rootStore';

interface ISnackbarProps {
  rootStore?: RootStore
}

@inject('rootStore')
@observer
export default class SnackbarFeedback extends React.Component<ISnackbarProps> {
  render() {
    const { snackbar, hideSnackbar } = this.props.rootStore!;

    return (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        message={snackbar.message}
        action={
          <Button color="secondary" size="small" onClick={hideSnackbar}>
            Close
          </Button>
        }
        onClose={hideSnackbar}
      />
    )
  }
}
