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


interface IAuthState {
  user: IUser
}

interface IAuthProps {
  isSignUp: boolean;
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
  @observable user: IUser = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: null,
    birthday: null,
    contactInfo: {
      phone: '',
      address: '',
    }
  };

  onValueChanged = (e: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = e.currentTarget;

    this.user[name as keyof IUser] = value;
  };

  onSignUp = (e: any) => {
    e.preventDefault();
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
                  <Toolbar>
                    <IconButton>
                      <Icon>arrow_back</Icon>
                    </IconButton>
                    <Typography variant="h6">
                      Sign up
                    </Typography>
                  </Toolbar>

                  <Grid container>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="email"
                        label="Email"
                        required/>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="password"
                        label="Password"
                        type="password"
                        required/>
                    </Grid>

                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="firstName"
                        label="First name"
                        required/>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="lastName"
                        label="Last name"
                        required/>
                    </Grid>

                    {/*<Grid item xl={6} lg={6} md={6} sm={6} xs={6}>*/}
                      {/*<FormControl fullWidth={true}>*/}
                        {/*<InputLabel htmlFor="gender">*/}
                          {/*Gender*/}
                        {/*</InputLabel>*/}
                        {/*<Select*/}
                          {/*name="gender"*/}
                          {/*inputProps={{id: 'gender'}}*/}
                        {/*>*/}
                          {/*{*/}
                            {/*genderList.map(gender =>*/}
                              {/*<MenuItem*/}
                                {/*value={gender.value}*/}
                                {/*key={gender.name}*/}
                              {/*>*/}
                                {/*{gender.name}*/}
                              {/*</MenuItem>*/}
                            {/*)*/}
                          {/*}*/}
                        {/*</Select>*/}
                      {/*</FormControl>*/}
                      {/*/!*<KeyboardDatePicker*!/*/}
                      {/*/!*label="Birthday"*!/*/}
                      {/*/!*required/>*!/*/}
                    {/*</Grid>*/}

                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="address"
                        label="Address"
                        required/>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="phone"
                        label="Phone"
                        type="number"
                        required/>
                    </Grid>
                  </Grid>
                  <Button variant="contained" >
                    Sign up
                  </Button>
                </form>
              ) : (
                <div>Sign in</div>
              )
            }
          </Paper>
        </Grid>
      </Grid>
    )
  }
}