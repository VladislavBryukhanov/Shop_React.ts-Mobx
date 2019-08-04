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
  Typography,
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { RootStore } from '../../stores/rootStore';
import { ProductsStore } from '../../stores/productsStore';
import { IProduct } from '../../types/product';
import { IPagingQuery } from '../../types/pagingQuery';
import { buildImagePathFilter } from '../../common/helpers/buildImagePathFilter';
import { styles } from './product-list.styles';
import PaginationComponent from '../../components/pagination/pagination.component';
import { lightTheme } from '../../assets/themas/light.theme';
import { AdapterLink } from '../../components/material-button-link/material-button-link.component';
import { toJS } from 'mobx';
import { currencyFilter } from '../../common/helpers/currencyFilter';
import { CartStore } from '../../stores/cartStore';
import { PRODUCTS_ONE_PAGE_LIMIT } from '../../common/constants';
import Box from '@material-ui/core/Box';
import { withPagingQuery } from '../../components/pagination/withPagingQuery';

interface IProductListProps {
  productsStore?: ProductsStore;
  rootStore?: RootStore;
  cartStore?: CartStore;
  topProducts?: boolean;
  query: IPagingQuery;
  category?: string;
  classes: any;
}

@inject('productsStore', 'rootStore', 'cartStore')
@observer
class ProductListPage extends React.Component<IProductListProps> {

  isInCart(prodId: number) {
    return this.props.cartStore!.productIds.includes(prodId);
  }

  async deleteProduct(product: IProduct) {
    const confirmation = await this.props.rootStore!.openConfirmationDialog(
      'Are you sure?',
      `Do you want delete product "${product.name}"?`
    );

    if (confirmation) {
      await this.props.productsStore!.deleteProductById(product.id!);
      this.fetchProducts({
        ...this.props.query,
        limit: PRODUCTS_ONE_PAGE_LIMIT
      }, this.props.category);
    }
  }

  fetchProducts = async (query: IPagingQuery, category?: string) => {
    if (this.props.topProducts) {
      this.props.productsStore!.fetchTopProducts(query);
    } else {
      this.props.productsStore!.fetchProducts(query, category!);
    }
  };

  render() {
    const { classes } = this.props;
    const { rows: products, count } = this.props.productsStore!.products;

    return (
      <Grid container
            className={classes.productList}
            justify="center"
            alignItems="center"
      >
        <Grid item xl={2} lg={2} md={1} />
        <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
          <PaginationComponent
            count={toJS(count)}
            limit={PRODUCTS_ONE_PAGE_LIMIT}
            withSearch={true}
            fetchingMethod={this.fetchProducts}
          />

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
                        image={buildImagePathFilter(product.previewPhoto, 'preview_photo', 'thumbnail')}/>
                      <CardContent>
                        <Typography gutterBottom variant="h5" color="secondary">
                          {product.name}
                        </Typography>
                        <Typography variant="body2">
                          {product.description}
                        </Typography>
                        <Typography variant="h5" color="primary" className={classes.price}>
                          {currencyFilter(product.price, 'USD')}
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

                        <Box width="100%">
                          { this.isInCart(product.id!) ? (
                              <Fab
                                className={classes.fabExclude}
                                onClick={() => this.props.cartStore!.excludeCartProduct(product.id!)}
                              >
                                <Icon>remove_shopping_cart</Icon>
                              </Fab>
                            ) : (
                              <Fab
                                color="secondary"
                                onClick={() => this.props.cartStore!.insertCartProduct(product.id!)}
                              >
                                <Icon>shopping_cart</Icon>
                              </Fab>
                            )
                          }
                        </Box>

                        <Box flexShrink={0}>
                          <Fab
                            component={AdapterLink}
                            to={{
                              pathname: '/product_manager',
                              state: { editableProduct: toJS(product) }
                            }}
                          >
                            <Icon>edit</Icon>
                          </Fab>

                          <Fab color="primary" onClick={() => this.deleteProduct(product)}>
                            <Icon>delete_forever</Icon>
                          </Fab>
                        </Box>

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
  withPagingQuery(ProductListPage)
);
