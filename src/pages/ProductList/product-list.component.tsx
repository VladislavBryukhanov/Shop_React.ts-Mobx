import React from 'react';
import {
  Grid,
  Paper,
  CardMedia,
  CardContent,
  MuiThemeProvider,
  Icon,
  CardActions,
  IconButton,
  Fab,
  Card,
  Typography
} from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import queryString from 'query-string';
import { ProductsStore } from '../../stores/productsStore';
import { PRODUCTS_ONE_PAGE_LIMIT } from '../../common/constants';
import { IProduct } from '../../types/product';
import { IPagingQuery } from '../../types/pagingQuery';
import { buildImagePath } from '../../common/helpers/buildImagePath';
import { styles } from './product-list.styles';
import { lightTheme } from '../../assets/themas/light.theme';

interface IRouterParams {
  category: string;
}
interface IProductListProps extends RouteComponentProps<IRouterParams> {
  productsStore?: ProductsStore;
  topProducts?: boolean;
  classes: any;
}
interface IProductListState {
  category: string;
  query: IPagingQuery;
}

@(withRouter as any)
@inject('productsStore')
@observer
class ProductListPage extends React.Component<IProductListProps, IProductListState> {
  constructor(props: IProductListProps) {
    super(props);
    const { page = 1 } = queryString.parse(this.props.history.location.search);

    this.state = {
      category: this.props.match.params.category,
      query: {
        currentPage: +page!,
        limit: PRODUCTS_ONE_PAGE_LIMIT,
        searchQuery: ''
      }
    };

  }

  componentDidMount() {
    this.fetchProducts(
      { ...this.state.query },
      this.state.category,
      this.props.topProducts
    );
  }

  componentWillReceiveProps(nextProps: IProductListProps) {
    if (this.props.topProducts !== nextProps.topProducts) {

    }

    if (this.props.match.params.category !== nextProps.match.params.category) {
      this.fetchProducts(
        this.state.query,
        nextProps.match.params.category,
        nextProps.topProducts
      );
    }

    if (this.props.history.location.search !== nextProps.history.location.search) {
      const { page = 1 } = queryString.parse(nextProps.history.location.search);
      this.fetchProducts( {
          ...this.state.query,
          currentPage: +page!
        }, this.state.category,
        nextProps.topProducts
      );
    }
  }

  fetchProducts(query: IPagingQuery, category: string, topProducts: boolean | undefined) {
    if (topProducts) {
      this.props.productsStore!.fetchTopProducts({ ...query });
    } else {
      this.props.productsStore!.fetchProducts({ ...query },  category);
    }
  }

  render() {
    const { classes } = this.props;

    const { rows: products } = this.props.productsStore!.products;
    return (
        <Grid container className={classes.productList}>
          <Grid item xl={2} lg={2} md={1} />
          <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
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
                        <Typography gutterBottom variant="h5" component="h2">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {product.description}
                        </Typography>
                      </CardContent>
                      <CardActions >
                        <Fab color="secondary">
                          <Icon>shopping_cart</Icon>
                        </Fab>

                        <IconButton>
                          <Icon>edit</Icon>
                        </IconButton>

                        <IconButton onClick={() => {
                          this.props.productsStore!.deleteProductById(product.id!)
                        }}>
                          <Icon color="primary">delete_forever</Icon>
                        </IconButton>

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

export default withStyles(styles)(ProductListPage);