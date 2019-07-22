import React, { SyntheticEvent } from 'react';
import { inject, observer } from 'mobx-react';
import { IUser } from '../../types/user';
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import { observable } from 'mobx';
import { Link, LinkProps } from 'react-router-dom';
import { AuthStore } from '../../stores/authStore';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getMilliseconds } from 'date-fns';

interface IAuthState {
  user: IUser
}

interface IAuthProps {
  isSignUp: boolean;
  authStore?: AuthStore;
}

const genderList = [
  {
    name: 'Male',
    value: 'true',
  },
  {
    name: 'Female',
    value: 'false',
  },
];

@inject('authStore')
@observer
export default class Auth extends React.Component<IAuthProps> {
  @observable.deep
  user: IUser = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthday: null,
    contactInfo: {
      phone: '',
      address: '',
    }
  };

  onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.user[name] = value;
  };

  onValueSelected = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value, name } = e.target;
    if (name) {
      this.user[name] = value as string;
    }
  };

  onDateChanged = (date: Date | null) => {
    this.user.birthday = getMilliseconds(date!);
    console.error(this.user.birthday)
  };

  onSignUp = async (e: any) => {
    e.preventDefault();
    await this.props.authStore!.signUp(this.user);
  };

  public render() {
    return (
      <Grid container>
        <Grid item xl={4} lg={4} md={3} sm={2} xs={1}/>
        <Grid item xl={4} lg={4} md={6} sm={8} xs={10}>
          <Paper elevation={6}>
            {
              this.props.isSignUp ? (
                <form onSubmit={this.onSignUp}>
                  <Toolbar color="inherit">
                    <IconButton edge="start" component={AdapterLink} to="/">
                      <Icon>arrow_back</Icon>
                    </IconButton>
                    <Typography variant="h6">
                      Sign up
                    </Typography>
                  </Toolbar>

                  <Grid container>
                    <Credentials onValueChanged={this.onValueChanged} size={6}/>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="firstName"
                        label="First name"
                        required/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="lastName"
                        label="Last name"
                        required/>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth={true}>
                        <InputLabel htmlFor="gender">
                          Gender
                        </InputLabel>
                        <Select
                          onChange={this.onValueSelected}
                          name="gender"
                          value={this.user.gender}
                        >
                          {
                            genderList.map(gender =>
                              <MenuItem
                                value={gender.value}
                                key={gender.name}
                              >
                                {gender.name}
                              </MenuItem>
                            )
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          fullWidth={true}
                          margin="normal"
                          id="mui-pickers-date"
                          label="Date picker"
                          value={this.user.birthday}
                          onChange={this.onDateChanged}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="address"
                        label="Address"
                        required/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="phone"
                        label="Phone"
                        type="number"
                        required/>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" type="submit">
                      Sign up
                    </Button>
                  </Grid>
                </form>
              ) : (
                <form onSubmit={this.onSignUp}>
                  <Toolbar>
                    <Typography variant="h6">
                      Sign in
                    </Typography>
                  </Toolbar>

                  <Grid container>
                    <Credentials onValueChanged={this.onValueChanged} size={12}/>

                    <Grid item xs={6}>
                      <Button variant="contained" >
                        Sign in
                      </Button>
                      <Button component={AdapterLink} to="/sign_up">
                        Sign up
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )
            }
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

interface ICredentialsProps {
  onValueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size: boolean | "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
}
const Credentials: React.FC<ICredentialsProps> = (props: ICredentialsProps) => {
  return (
    <>
      <Grid item xs={props.size}>
        <TextField
          fullWidth={true}
          onChange={props.onValueChanged}
          name="email"
          label="Email"
          required/>
      </Grid>
      <Grid item xs={props.size}>
        <TextField
          fullWidth={true}
          onChange={props.onValueChanged}
          name="password"
          label="Password"
          type="password"
          required/>
      </Grid>
    </>
  )
};

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref as any} {...props}/>
));
