import React from 'react';
import {
  Grid,
  Paper,
  CardMedia,
  CardContent,
  MuiThemeProvider,
  Icon,
  CardActions,
  Badge,
  Fab,
  Card,
  Typography, IconButton
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { RootStore } from '../../stores/rootStore';
import { ProductsStore } from '../../stores/productsStore';
import { PRODUCTS_ONE_PAGE_LIMIT } from '../../common/constants';
import { IProduct } from '../../types/product';
import { IPagingQuery } from '../../types/pagingQuery';
import { buildImagePath } from '../../common/helpers/buildImagePath';
import { styles } from './product-list.styles';
// import PaginationComponent from '../../components/pagination/pagination.component';
import { lightTheme } from '../../assets/themas/light.theme';
import { AdapterLink } from '../../components/material-button-link/material-button-link.component';
import { observable, toJS } from 'mobx';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import _ from 'lodash';

interface IRouterParams {
  category: string;
}
interface IProductListProps extends RouteComponentProps<IRouterParams> {
  productsStore?: ProductsStore;
  rootStore?: RootStore;
  topProducts?: boolean;
  classes: any;
}

@inject('productsStore', 'rootStore')
@observer
class ProductListPage extends React.Component<IProductListProps> {
  @observable
  query: IPagingQuery;
  @observable
  category: string;
  @observable
  loading: boolean;

  constructor(props: IProductListProps) {
    super(props);
    const { page = 1 } = queryString.parse(this.props.history.location.search);
    this.query = {
      currentPage: +page!,
      limit: PRODUCTS_ONE_PAGE_LIMIT,
      searchQuery: ''
    };
    this.category = this.props.match.params.category;
    this.loading = false;
  }

  componentDidMount() {
    this.fetchProducts();
  }

  componentDidUpdate(prevProps: IProductListProps) {
    console.error(prevProps)
    console.error(this.props)
    if (this.props.location !== prevProps.location) {
      const { page = 1 } = queryString.parse(this.props.history.location.search);
      this.query.currentPage = +page!;

      this.fetchProducts();
    }
  }

/*  pageCount() {
    let pageCount = (this.props.productsStore!.products.count / this.query.limit);
    if (pageCount > parseInt(pageCount)) {
      pageCount = parseInt(pageCount) + 1;
    }
    return pageCount || 1;
  }*/

  fetchProducts() {
    if (this.props.topProducts) {
      this.props.productsStore!.fetchTopProducts({ ...this.query });
    } else {
      this.props.productsStore!.fetchProducts({ ...this.query },  this.category);
    }
  }

  async deleteProduct(product: IProduct) {
    const confirmation = await this.props.rootStore!.openConfirmationDialog(
      'Are you sure?',
      `Do you want delete product "${product.name}"?`
    );

    if (confirmation) {
      await this.props.productsStore!.deleteProductById(product.id!);
      this.fetchProducts();
    }
  }

  nextPage = () => {
    this.query.currentPage++;
    this.props.history.push({
      ...this.props.history,
      search: `page=${this.query.currentPage}`
    })
  };

  previousPage = () => {
    this.query.currentPage--;
    this.props.history.push({
      ...this.props.history,
      search: `page=${this.query.currentPage}`
    })
  };

  searchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.query.searchQuery = e.target.value;

    _.debounce(() => {
      this.fetchProducts();
    }, 300)();
  };

  clearSearchFilter = () => {
    this.query.searchQuery = '';
    this.fetchProducts();
  };

  render() {
    const { classes } = this.props;
    const { rows: products } = this.props.productsStore!.products;

    return (
      <Grid container className={classes.productList}>
        <Grid item xl={2} lg={2} md={1} />
        <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
          {/*<PaginationComponent/>*/}

          <Grid container
                justify="center"
                alignItems="center">
            <Paper elevation={6}>
              <TextField
                variant="filled"
                label="Category"
                onChange={this.searchFilter}
                value={this.query.searchQuery}
                InputProps={{
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.clearSearchFilter}
                        >
                          <Icon>close</Icon>
                        </IconButton>
                      </InputAdornment>

                      <InputAdornment position="end">
                          <Icon color="primary">search</Icon>
                      </InputAdornment>
                    </>
                  ),
                }}
              />

              <IconButton onClick={this.previousPage}>
                <Icon>arrow_back_ios</Icon>
              </IconButton>
              <IconButton>
                {this.query.currentPage}
              </IconButton>
              <IconButton onClick={this.nextPage}>
                <Icon>arrow_forward_ios</Icon>
              </IconButton>
            </Paper>
          </Grid>

          <Paper elevation={6}>
            <Grid container
                  justify="center"
                  className="Page"
                  alignItems="center">
              {products.map((product: IProduct) => (
                <Grid key={product.id} item className={classes.productItem}>
                  <MuiThemeProvider theme={lightTheme}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.media}
                        image={buildImagePath(product.previewPhoto, 'preview_photo', 'thumbnail')}/>
                      <CardContent>
                        <Typography gutterBottom variant="h5" color="secondary">
                          {product.name}
                        </Typography>
                        <Typography variant="body2">
                          {product.description}
                        </Typography>
                        <Typography variant="h5" color="primary" className={classes.price}>
                          {`${product.price}$`}
                        </Typography>
                        { !!product.OrderCount && (
                          <Typography variant="subtitle2" color="textSecondary">
                            Number of purchases:
                            <Badge badgeContent={product.OrderCount} color="secondary">
                              <Icon>add_shopping_cart</Icon>
                            </Badge>
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions >
                        <Fab color="secondary">
                          <Icon>shopping_cart</Icon>
                        </Fab>

                        <Fab
                          component={AdapterLink}
                          to={{
                            pathname: '/product_manager',
                            state: {
                              editableProduct: toJS(product)
                            }
                          }}
                        >
                          <Icon>edit</Icon>
                        </Fab>

                        <Fab color="primary" onClick={() => this.deleteProduct(product)}>
                          <Icon>delete_forever</Icon>
                        </Fab>

                      </CardActions>
                    </Card>
                  </MuiThemeProvider>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withRouter(ProductListPage)
);