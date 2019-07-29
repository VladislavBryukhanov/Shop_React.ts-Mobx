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
  CardMedia
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ProductsStore } from '../../../stores/productsStore';
import { CategoriesStore } from '../../../stores/categoriesStore';
import { observable } from 'mobx';
import { FileResources } from '../../../common/constants';
import { styles } from './product-builder.styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { RootStore } from '../../../stores/rootStore';

export interface IProductForm {
  CategoryId: string,
  attachedPhoto: Blob | null,
  name: string,
  description: string,
  price: string,
  [id: string]: string |  Blob | null;
}

interface IProductBuilderProps {
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
    attachedPhoto: null,
    CategoryId: '',
    name: '',
    description: '',
    price: '',
  };

  @observable.deep
  validationError = Object.assign({}, this.product);

  @observable
  photoPreview = FileResources.defaultPreview;

  //Todo get product by id

  onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    this.product[name] = value;

    // debounce(() => this.validateField(name), 250);
  };

  onValueSelected = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { value, name } = e.target;
    if (name) {
      this.product[name] = value as string;
    }
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

  onSave = async () => {
    const { product } = this;
    const productForm = new FormData();
    // product.price = Number(product.price);

    // if (!this.$refs.productBuilder.validate()) {
    //   return;
    // }

    for (const key in product) {
      const value = product[key];
      if (value) {
        productForm.append(key, value);
      }
    }

    if (this.props.editableProduct) {
      await this.props.productsStore!.createProduct(productForm);
    } else {
      await this.props.productsStore!.updateProduct(productForm);
    }
/*    if (this.editableProduct) {
      await this.updateProductAction(productForm)
    } else {
      await this.createProductAction(productForm)
    }
    this.$router.go(-1);*/
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xl={4} lg={3} md={3} sm={2} xs={2}/>
        <Grid item xl={4} lg={6} md={6} sm={8} xs={10}>
          <Paper elevation={6}>
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
                  name="name"
                  label="Product name"/>
                <TextField
                  className={classes.margin}
                  fullWidth={true}
                  onChange={this.onValueChanged}
                  name="price"
                  label="Price"
                  type="number"/>
                <FormControl
                  fullWidth={true}
                  className={classes.margin}
                >
                  <InputLabel htmlFor="category">
                    Category
                  </InputLabel>
                  <Select
                    onChange={this.onValueSelected}
                    name="CategoryId"
                    value={this.product.CategoryId}
                  >
                    {this.props.categoriesStore!.categories.map(category =>
                      <MenuItem
                        value={category.id}
                        key={category.name}
                      >
                        {category.name}
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <TextField
                className={classes.margin}
                fullWidth={true}
                name="description"
                label="Description"
                multiline
                rows="4"
                value={this.product.description}
                onChange={this.onValueChanged}
                variant="outlined"
              />
              <Button
                className={classes.margin}
                variant="outlined" color="inherit"
                fullWidth={true}
                onClick={this.onSave}
              >
                Save
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(ProductBuilderPage);