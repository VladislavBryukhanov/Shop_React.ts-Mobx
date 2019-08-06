import React from 'react';
import { inject, observer } from 'mobx-react';
import { IContactInfo, IUser } from '../../types/user';
import Paper from '@material-ui/core/Paper';
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
import { AuthStore } from '../../stores/authStore';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getUnixTime } from 'date-fns';
import { AdapterLink } from '../../components/material-button-link/material-button-link.component';
import _ from 'lodash';
import { fieldValidator } from '../../common/helpers/fieldValidator'

interface IValidationRules {
  [index: string]: Array<(fieldName: any) => any | void>
}

interface IAuthProps {
  isSignUp: boolean;
  authStore?: AuthStore;
}

interface IAuthForm extends IUser, IContactInfo {}

@inject('authStore')
@observer
export class AuthPage extends React.Component<IAuthProps> {
  @observable.deep
  user: IAuthForm = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthday: null,

    phone: '',
    address: '',
  };

  @observable.deep
  validationError = Object.assign({}, this.user);

  public genderList = [
    {
      name: 'Male',
      value: 'true',
    },
    {
      name: 'Female',
      value: 'false',
    },
  ];

  // TODO replace validation to component wrapper
  validationRules: IValidationRules = {
    email: [
      fieldValidator(
        (fn: string) => !!fn,
        'Email is required field'
      ),
      fieldValidator(
        (fn: string) => /\S+@\S+\.\S+/.test(fn),
        'E-mail must be valid'
      )
    ],
    password: [
      fieldValidator(
        (fn: string) => !!fn,
        'Password is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 8 && fn.length <= 32,
        'Password must be longer then 8 and less then 32 characters'
      ),
    ],
    firstName: [
      fieldValidator(
        (fn: string) => !!fn,
        'First name is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 1 && fn.length <= 20,
        'First name must be longer then 1 and less then 20 characters'
      ),
    ],
    lastName: [
      fieldValidator(
        (fn: string) => !!fn,
        'Last name is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 1 && fn.length <= 20,
        'Last name must be longer then 1 and less then 20 characters'
      ),
    ],

    address: [
      fieldValidator(
        (fn: string) => !!fn,
        'Address is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 4 && fn.length <= 64,
        'Please enter a valid address'
      ),
    ],
    phone: [
      fieldValidator(
        (fn: string) => !!fn,
        'Phone is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 4 && fn.length <= 12,
        'Please enter a valid phone number'
      ),
    ],
  };

  validateField = (fieldName: string): void => {
    const value = this.user[fieldName];
    try {
      if (!this.validationRules[fieldName]) {
        return;
      }

      this.validationRules[fieldName].forEach(
        (validate: (value: any) => any) => validate(value));
      if (this.validationError[fieldName]) {
        this.validationError[fieldName] = '';
      }
    } catch (err) {
      this.validationError[fieldName] = err.message;
    }
  };

  validateForm = (formData: object) => {
    Object.keys(formData).forEach(key => {
      this.validateField(key);
    });

    return _.chain(this.validationRules)
      .pickBy(_.identity)
      .isEmpty()
      .value();
  };

  onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.user[name] = value;

    _.debounce(() => this.validateField(name), 250)();
  };

  onValueSelected = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value, name } = e.target;
    if (name) {
      this.user[name] = value as string;
    }
  };

  onDateChanged = (date: Date | null) => {
    if (date) {
      this.user.birthday = getUnixTime(date);
    } else {
      this.user.birthday = null;
    }
  };

  onSignUp = async (e: any) => {
    e.preventDefault();

    if (!this.validateForm(this.user)) {
      return;
    }

    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      birthday,
      phone,
      address,
    } = this.user;

    await this.props.authStore!.signUp(
      { email, password, firstName, lastName, gender, birthday },
      { phone, address }
    )
  };

  onSignIn = async (e: any) => {
    e.preventDefault();
    await this.props.authStore!.signIn(this.user);
  };

  public render() {
    return (
      <Grid container className="AuthPage">
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
                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="email"
                        label="Email"
                        error={!!this.validationError.email}
                        helperText={this.validationError.email}
                        onBlur={() => this.validateField('email')}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        type="password"
                        name="password"
                        label="Password"
                        error={!!this.validationError.password}
                        helperText={this.validationError.password}
                        onBlur={() => this.validateField('password')}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="firstName"
                        label="First name"
                        error={!!this.validationError.firstName}
                        helperText={this.validationError.firstName}
                        onBlur={() => this.validateField('firstName')}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="lastName"
                        label="Last name"
                        error={!!this.validationError.lastName}
                        helperText={this.validationError.lastName}
                        onBlur={() => this.validateField('lastName')}/>
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
                            this.genderList.map(gender =>
                              <MenuItem value={gender.value} key={gender.name}>
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
                        error={!!this.validationError.address}
                        helperText={this.validationError.address}
                        onBlur={() => this.validateField('address')}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="number"
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="phone"
                        label="Phone"
                        error={!!this.validationError.phone}
                        helperText={this.validationError.phone}
                        onBlur={() => this.validateField('phone')}/>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth={true}
                      variant="contained"
                      type="submit"
                    >
                      Sign up
                    </Button>
                  </Grid>

                </form>
              ) : (
                <form onSubmit={this.onSignIn}>
                  <Toolbar>
                    <Typography variant="h6">
                      Sign in
                    </Typography>
                  </Toolbar>

                  <Grid container>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="email"
                        label="Email"/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth={true}
                        onChange={this.onValueChanged}
                        name="password"
                        label="Password"
                        type="password"/>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        type="submit"
                        variant="contained"
                      >
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
