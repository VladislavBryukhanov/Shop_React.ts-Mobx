import React from 'react';
import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  Paper,
  Grid,
  Button,
  Card,
  CardMedia,
  FormHelperText
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ProductsStore } from '../../../stores/productsStore';
import { CategoriesStore } from '../../../stores/categoriesStore';
import { observable } from 'mobx';
import { FileResources } from '../../../common/constants';
import { styles } from './product-builder.styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { RootStore } from '../../../stores/rootStore';
import { RouteComponentProps, withRouter } from 'react-router';
import { buildImagePath } from '../../../common/helpers/buildImagePath';
import _ from 'lodash';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { fieldValidator } from '../../../common/helpers/fieldValidator';

interface IValidationRules {
  [index: string]: Array<(fieldName: any) => any | void>
}

interface IProductForm {
  id?: string;
  CategoryId: string,
  attachedPhoto: Blob | string,
  name: string,
  description: string,
  price: string,
  [id: string]: string |  Blob | undefined;
}

interface IProductBuilderProps extends RouteComponentProps {
  productsStore?: ProductsStore;
  categoriesStore?: CategoriesStore;
  rootStore?: RootStore;
  classes: any;
  editMode?: boolean;
}

@inject('productsStore', 'categoriesStore', 'rootStore')
@observer
class ProductBuilderPage extends React.Component<IProductBuilderProps> {
  @observable.deep
  product: IProductForm = {
    attachedPhoto: '',
    CategoryId: '',
    name: '',
    description: '',
    price: '',
  };

  @observable.deep
  validationError = Object.assign({}, this.product);

  @observable
  photoPreview = FileResources.defaultPreview;

  componentDidMount() {
    const { state } = this.props.location;

    if (state) {
      const { id, previewPhoto, name, description, price, CategoryId } = state.editableProduct;
      this.product = {
        id,
        name,
        price: price.toString(),
        CategoryId: CategoryId.toString(),
        description,
        attachedPhoto: previewPhoto,
      };
      this.photoPreview = buildImagePath(previewPhoto, 'preview_photo', 'thumbnail');
    }
  }

  validationRules: IValidationRules = {
    name: [
      fieldValidator(
        (fn: string) => !!fn,
        'Name is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 1 && fn.length <= 64,
        'Name must be longer then 1 and less then 64 characters'
      ),
    ],
    description: [
      fieldValidator(
        (fn: string) => !!fn,
        'Description is required field'
      ),
      fieldValidator(
        (fn: string) => fn.length >= 1 && fn.length <= 512,
        'Description must be longer then 1 and less then 512 characters'
      ),
    ],
    price: [
      fieldValidator(
        (fn: string) => !!fn,
        'Price is required field'
      ),
      fieldValidator(
        (fn: string) => +fn > 0,
        'The price can not be less than 0'
      ),
    ],
    CategoryId: [
      fieldValidator(
        (fn: string) => !!fn,
        'Category is required field'
      )
    ],
  };

  validateField = (fieldName: string): void => {
    const value = this.product[fieldName];
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

    return _.chain(this.validationError)
      .pickBy(_.identity)
      .isEmpty()
      .value();
  };


  onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.product[name] = value;
    _.debounce(() => this.validateField(name), 250)();
  };

  onValueSelected = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value, name } = e.target;
    if (!name) {
      return;
    }
    this.product[name] = value as string;
    _.debounce(() => this.validateField(name), 250)();
  };

  onPhotoChange = (e: any) => {
    if (e.target.files) {
      const [ attachedPhoto ] = e.target.files;

      if (attachedPhoto.size > FileResources.IMAGE_MAX_SIZE) {
        this.props.rootStore!.openConfirmationDialog(
          'File maximal size exceeded',
          `Maximum image size is 5MB. You have exceeded this restriction.`
        );
        return;
      }

      const fileReader = new FileReader();
      this.product.attachedPhoto = attachedPhoto;

      fileReader.onload = () => {
        this.photoPreview = fileReader.result;
      };
      fileReader.readAsDataURL(attachedPhoto);
    }
  };

  onSave = async (e: any) => {
    e.preventDefault();

    if (!this.validateForm(this.product)) {
      return;
    }

    const productForm = new FormData();
    _.each(this.product, (value, key) => {
      if (value) {
        productForm.append(key, value);
      }
    });

    const { state } = this.props.location;
    if (state && state.editableProduct) {
      await this.props.productsStore!.updateProduct(productForm);
    } else {
      await this.props.productsStore!.createProduct(productForm);
    }
    this.props.history.goBack();
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xl={4} lg={4} md={3} sm={2} xs={2}/>
        <Grid item xl={3} lg={4} md={6} sm={8} xs={10}>
          <Paper elevation={6}>
            <Toolbar color="inherit">
              <IconButton edge="start" onClick={() => this.props.history.goBack()}>
                <Icon>arrow_back</Icon>
              </IconButton>
              <Typography variant="h6">
                Product manager
              </Typography>
            </Toolbar>

            <form onSubmit={this.onSave}>
              <Grid container>
                <Grid item sm={6} xs={12}>
                  <Card className={classes.card}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="text-button-file"
                      type="file"
                      onChange={this.onPhotoChange}
                    />
                    <label htmlFor="text-button-file">
                      <CardMedia
                        image={this.photoPreview}
                        className={classes.media}/>
                    </label>
                  </Card>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    className={classes.margin}
                    fullWidth={true}
                    onChange={this.onValueChanged}
                    value={this.product.name}
                    error={!!this.validationError.name}
                    helperText={this.validationError.name}
                    onBlur={() => this.validateField('name')}
                    name="name"
                    label="Product name"/>
                  <TextField
                    className={classes.margin}
                    fullWidth={true}
                    onChange={this.onValueChanged}
                    value={this.product.price}
                    error={!!this.validationError.price}
                    helperText={this.validationError.price}
                    onBlur={() => this.validateField('price')}
                    name="price"
                    label="Price"
                    type="number"/>
                  <FormControl
                    fullWidth={true}
                    className={classes.margin}
                    error={!!this.validationError.CategoryId}
                    onBlur={() => this.validateField('CategoryId')}
                  >
                    <InputLabel htmlFor="category">
                      Category
                    </InputLabel>
                    <Select
                      color="error"
                      onChange={this.onValueSelected}
                      value={this.product.CategoryId}
                      name="CategoryId"
                    >
                      {this.props.categoriesStore!.categories.map(category =>
                        <MenuItem
                          value={category.id.toString()}
                          key={category.name}
                        >
                          {category.name}
                        </MenuItem>
                      )}
                    </Select>
                    <FormHelperText>{this.validationError.CategoryId}</FormHelperText>
                  </FormControl>
                </Grid>
                <TextField
                  className={classes.margin}
                  fullWidth={true}
                  onChange={this.onValueChanged}
                  value={this.product.description}
                  error={!!this.validationError.description}
                  helperText={this.validationError.description}
                  onBlur={() => this.validateField('description')}
                  name="description"
                  label="Description"
                  multiline
                  rows="4"
                  variant="outlined"
                />
                <Button
                  className={classes.margin}
                  variant="outlined" color="inherit"
                  fullWidth={true}
                  type="submit"
                >
                  Save
                </Button>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withRouter(ProductBuilderPage)
);
