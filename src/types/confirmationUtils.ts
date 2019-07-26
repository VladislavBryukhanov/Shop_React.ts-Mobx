export interface ISnackbar {
  open: boolean;
  message: string;
  duration: number;
}

export interface IDialog {
  open: boolean;
  title: string;
  message: string;
}
