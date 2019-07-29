import React from 'react';
import {
  Grid,
  Paper,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ProductsStore } from '../../../stores/productsStore';

interface IProductBuilderProps {
  productsStore?: ProductsStore;
}

@inject('productsStore')
@observer
export class ProductBuilderPage extends React.Component<IProductBuilderProps> {

  render() {
    return (
      <Grid container>
        <Grid item xl={2} lg={2} md={1} />
        <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
          <Paper elevation={6}>
            <Grid container
                  justify="center"
                  className="Page"
                  alignItems="center">

            {/*  <TextField
                fullWidth={true}
                onChange={this.onValueChanged}
                name="firstName"
                label="First name"
                error={!!this.validationError.firstName}
                helperText={this.validationError.firstName}
                onBlur={() => this.validateField('firstName')}
                required/>
              <TextField
                fullWidth={true}
                onChange={this.onValueChanged}
                name="firstName"
                label="First name"
                error={!!this.validationError.firstName}
                helperText={this.validationError.firstName}
                onBlur={() => this.validateField('firstName')}
                required/>
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
              <TextField
                id="filled-multiline-flexible"
                label="Multiline"
                multiline
                rowsMax="4"
                value={values.multiline}
                onChange={handleChange('multiline')}
                className={classes.textField}
                margin="normal"
                helperText="hello"
                variant=*/}"filled"
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}