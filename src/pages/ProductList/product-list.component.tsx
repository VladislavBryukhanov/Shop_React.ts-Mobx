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
import { computed, observable, toJS } from 'mobx';
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

  changePage = (page: number) => {
    this.query.currentPage = page;
    this.props.history.push({
      ...this.props.history,
      search: `page=${this.query.currentPage}`
    })
  };

  @computed
  get pageCount() {
    let pageCount = (this.props.productsStore!.products.count / this.query.limit);
    if (pageCount > Math.floor(pageCount)) {
      pageCount = Math.floor(pageCount) + 1;
    }
    return pageCount || 1;
  }

  renderPageNumbers = (displayedNumbers: number = 8) => {
    const { currentPage } = this.query;
    const pageButtons = [];

    let initNumber = Math.floor(currentPage - displayedNumbers / 2) + 1;
    let endNumber = Math.floor(currentPage + displayedNumbers / 2) + 1;

    if (endNumber > this.pageCount) {
      endNumber = this.pageCount;
      initNumber = this.pageCount - displayedNumbers;
    }

    if (initNumber <= 0) {
      initNumber = 1;
      endNumber = initNumber + displayedNumbers;
    }

    if (displayedNumbers > this.pageCount) {
      initNumber = initNumber > 0 ? initNumber : 1;
      endNumber = this.pageCount + 1;
    }

    for (let i = initNumber; i < endNumber ; i++) {
      pageButtons.push(
        <IconButton
          key={i}
          disabled={this.query.currentPage === i}
          onClick={() => this.changePage(i)}
        >
          {i}
        </IconButton>
      )
    }
    return (
      <div>
        {pageButtons.map(btn => btn)}
      </div>
    )
  };

  searchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.query.searchQuery = e.target.value;
    this.query.currentPage = 1;

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
      <Grid container
            className={classes.productList}
            justify="center"
            alignItems="center"
      >
        <Grid item xl={2} lg={2} md={1} />
        <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
          {/*<PaginationComponent/>*/}

          <Grid item xs={10} className={classes.pagination}>
            <Paper elevation={6}>
                <TextField
                  fullWidth={true}
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

              <Grid container
                    justify="center"
                    alignItems="center"
              >
                <IconButton
                  onClick={() => this.changePage(this.query.currentPage - 1)}
                  disabled={this.query.currentPage === 1}
                >
                  <Icon>arrow_back_ios</Icon>
                </IconButton>
                {this.renderPageNumbers()}
                <IconButton
                  onClick={() => this.changePage(this.query.currentPage + 1)}
                  disabled={this.query.currentPage === this.pageCount}
                >
                  <Icon>arrow_forward_ios</Icon>
                </IconButton>
              </Grid>
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