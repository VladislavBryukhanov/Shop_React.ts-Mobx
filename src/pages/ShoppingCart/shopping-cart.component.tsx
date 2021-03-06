import React from 'react';
import { inject, observer } from 'mobx-react';
import { CartStore } from '../../stores/cartStore';
import { IProduct } from '../../types/product';
import { IPagingQuery } from '../../types/pagingQuery';
import {
  Button,
  Card, CardActions,
  CardContent,
  CardMedia, Fab,
  Grid,
  Icon,
  MuiThemeProvider,
  Paper, Toolbar,
  Typography,
  Box,
  withStyles
} from '@material-ui/core';
import PaginationComponent from '../../components/pagination/pagination.component';
import { toJS } from 'mobx';
import { lightTheme } from '../../assets/themas/light.theme';
import { buildImagePathFilter } from '../../common/helpers/buildImagePathFilter';
import { currencyFilter } from '../../common/helpers/currencyFilter';
import { RootStore } from '../../stores/rootStore';
import { styles } from './shopping-cart.styles';
import { CART_ONE_PAGE_LIMIT } from '../../common/constants';
import { withPagingQuery } from '../../components/pagination/withPagingQuery';
import { OrderStore } from '../../stores/orderStore';
import { RouteComponentProps } from 'react-router';

interface ISoppingCartProps extends RouteComponentProps {
  cartStore?: CartStore;
  orderStore?: OrderStore;
  rootStore?: RootStore;
  query: IPagingQuery;
  classes: any;
}

@inject('cartStore', 'orderStore', 'rootStore')
@observer
class ShoppingCartPage extends React.Component<ISoppingCartProps> {

  fetchCartProducts = async (query: IPagingQuery) => {
      this.props.cartStore!.fetchCartProducts(query);
  };

  createOrderForCart = async(product?: IProduct) => {
    let { productIds, productsCount, totalCost } = this.props.cartStore!;
    let totalCostFormatted = currencyFilter(totalCost, 'USD');
    let warningDescription = `Do you want to make order with ${productsCount} product, total cost is ${totalCostFormatted}?`;;

    if (product) {
      productIds = [product!.id!];
      totalCostFormatted = currencyFilter(product.price, 'USD');
      warningDescription = `Do you want to make order for one product: ${product.name}, total cost is ${totalCostFormatted}?`;
    }

    const confirm = await this.props.rootStore!.openConfirmationDialog(
      'Confirm transaction',
      warningDescription
    );

    if (confirm) {
      await this.props.orderStore!.createPersonalOrder(productIds);
      this.props.cartStore!.fetchShoppingCart();
      this.props.history.push('/orders');
    }
  };

  async excludeCartProduct(product: IProduct) {
    await this.props.cartStore!.excludeCartProduct(product.id!);
    this.fetchCartProducts({
      ...this.props.query,
      limit: CART_ONE_PAGE_LIMIT
    });
  }

  render() {
    const { classes } = this.props;
    const { products, productsCount, totalCost } = this.props.cartStore!;

    return (
      <Grid container
            className={classes.shoppingCart}
            justify="center"
            alignItems="center"
      >
        <Grid item xl={2} lg={2} md={1} />
        <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
          <PaginationComponent
            limit={CART_ONE_PAGE_LIMIT}
            count={toJS(productsCount)}
            fetchingMethod={this.fetchCartProducts}
          />

          <Paper elevation={6}>
            <MuiThemeProvider theme={lightTheme}>
              <Toolbar className={classes.toolbar}>
                <Box width="100%">
                  <Typography variant="h5" color="secondary">
                    Total cost: {currencyFilter(totalCost, 'USD')}
                  </Typography>
                </Box>
                <Box flexShrink={0}>
                  <Button onClick={() => this.createOrderForCart()} color="primary">
                    Buy this products
                  </Button>
                </Box>
              </Toolbar>
            </MuiThemeProvider>

            <Grid container
                  justify="center"
                  className="Page"
                  alignItems="center">
              { products.map((product: IProduct) => (
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
                      </CardContent>
                      <CardActions>
                        <Box width="100%">
                          <Fab
                            color="secondary"
                            onClick={() => this.createOrderForCart(product)}
                          >
                            <Icon>attach_money</Icon>
                          </Fab>
                        </Box>
                        <Box flexShrink={0}>
                          <Fab
                            color="primary"
                            onClick={() => this.excludeCartProduct(product)}
                          >
                            <Icon>close</Icon>
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
  withPagingQuery(ShoppingCartPage)
);
