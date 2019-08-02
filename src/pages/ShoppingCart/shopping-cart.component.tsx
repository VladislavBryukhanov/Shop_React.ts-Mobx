import React from 'react';
import { inject, observer } from 'mobx-react';
import { CartStore } from '../../stores/cartStore';
import { IProduct } from '../../types/product';
import { IPagingQuery } from '../../types/pagingQuery';
import {
  Badge, Button,
  Card, CardActions,
  CardContent,
  CardMedia, Fab,
  Grid,
  Icon, IconButton,
  MuiThemeProvider,
  Paper, Toolbar,
  Typography, withStyles
} from '@material-ui/core';
import PaginationComponent from '../../components/pagination/pagination.component';
import { toJS } from 'mobx';
import { lightTheme } from '../../assets/themas/light.theme';
import { buildImagePathFilter } from '../../common/helpers/buildImagePathFilter';
import { currencyFilter } from '../../common/helpers/currencyFilter';
import { AdapterLink } from '../../components/material-button-link/material-button-link.component';
import { RootStore } from '../../stores/rootStore';
import { styles } from '../ProductList/product-list.styles';
import { CART_ONE_PAGE_LIMIT, PRODUCTS_ONE_PAGE_LIMIT } from '../../common/constants';

interface ISoppingCartProps {
  cartStore?: CartStore;
  rootStore?: RootStore;
  classes: any;
}

@inject('cartStore', 'rootStore')
@observer
class ShoppingCartPage extends React.Component<ISoppingCartProps> {

  async deleteProduct(product: IProduct) {
    const confirmation = await this.props.rootStore!.openConfirmationDialog(
      'Are you sure?',
      `Do you want delete product "${product.name}"?`
    );

    if (confirmation) {

    }
  }

  fetchMethod = async (query: IPagingQuery) => {
      this.props.cartStore!.fetchCartProducts(query);
  };

  createOrderForCart = async() => {

  };

  async excludeCartProduct(product: IProduct) {
    await this.props.cartStore!.excludeCartProduct(product.id!);
    // this.fetchCartProducts({ currentPage, limit });
    //TODO improve
    // window.location.reload();
  }

  render() {
    const { classes } = this.props;
    const { products, productIds, productsCount, totalCost } = this.props.cartStore!;

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
            fetchingMethod={this.fetchMethod}
          />

          <Paper elevation={6}>
            <MuiThemeProvider theme={lightTheme}>
              <Toolbar color="default" className={classes.toolbar}>
                <Typography variant="h5" color="secondary">
                  Total cost: {currencyFilter(totalCost, 'USD')}
                </Typography>
                <Button onClick={this.createOrderForCart} color="primary">
                  Buy this products
                </Button>
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
                      <CardActions >
                        <Fab color="primary" onClick={() => this.excludeCartProduct(product)}>
                          <Icon>close</Icon>
                        </Fab>

                        <Fab color="secondary">
                          <Icon>attach_money</Icon>
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

export default withStyles(styles)(ShoppingCartPage);
