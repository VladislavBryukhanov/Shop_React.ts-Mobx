import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { OrderStore } from '../../stores/orderStore';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  Grid,
  Paper,
  ListItem,
  ListItemText,
  Collapse,
  Avatar,
  Divider,
  List,
  Button,
  MuiThemeProvider,
  ListItemSecondaryAction,
  ListItemAvatar
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { IOrder } from '../../types/order';
import { IProduct } from '../../types/product';
import { styles } from './order-list.styles';
import { buildImagePathFilter } from '../../common/helpers/buildImagePathFilter';
import { currencyFilter } from '../../common/helpers/currencyFilter';
import { dateFormatFilter } from '../../common/helpers/dateFormatFilter';
import { lightTheme } from '../../assets/themas/light.theme';
import { RootStore } from '../../stores/rootStore';

interface IRouteParams {
  userId: string;
}
interface IOrderListProps extends RouteComponentProps<IRouteParams> {
  orderStore: OrderStore,
  rootStore: RootStore,
  classes: any
}
interface ICollapsable {
  [key: number]: boolean
}

@inject('orderStore', 'rootStore')
@observer
class OrderListPage extends React.Component<IOrderListProps> {
  @observable.deep
  collapse: ICollapsable = {};

  componentDidMount() {
    const { userId } = this.props.match.params;
    if (userId) {
      return this.props.orderStore!.fetchUsersOrder(+userId);
    }
    this.props.orderStore!.fetchPersonalOrders();
  }

  openCollapse(lineId: number) {
    this.collapse[lineId] = !this.collapse[lineId];
  }

  calculateTotalCost(order: IOrder) {
    let totalCost = 0;
    order.products.forEach(product => {
      totalCost+= product.price;
    });
    return currencyFilter(totalCost, 'USD');
  }

  async onCloseOrder(order: IOrder) {
    const confirm = await this.props.rootStore!.openConfirmationDialog(
      `Confirm order closing`,
      `Do you want to close this order with ${order.products.length} product(s)?`
    );

    if (confirm) {
      this.props.orderStore!.declineOrder(order.id);
    }
  }

  render() {
    const { classes } = this.props;
    const { orders } = this.props.orderStore!;

    return (
      <Grid container
            className={classes.orderList}
            justify="center"
            alignItems="center"
      >
        <Grid item xl={2} lg={2} md={1} />
        <Grid item xl={8} lg={8} md={10} sm={12} xs={12}>
          <Paper elevation={6}>
            <List>
              { orders.map((order: IOrder) => (
                <div key={order.id}>
                  <Divider/>
                  <ListItem button onClick={() => this.openCollapse(order.id)}>
                    <ListItemText 
                      primary={`Ordered ${order.products.length} product(s)`} 
                      secondary={`Total cost is ${this.calculateTotalCost(order)}`} />
                    <ListItemText
                      className={classes.orderDate}
                      secondary={dateFormatFilter(order.createdAt)} />
                    <ListItemSecondaryAction>
                      {this.collapse[order.id] ? <ExpandLess /> : <ExpandMore />} 
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Collapse in={this.collapse[order.id]} timeout="auto" unmountOnExit>
                    { order.products.map((product: IProduct) => (
                      <ListItem key={product.id} button>
                        <ListItemAvatar>
                          <Avatar src={
                            buildImagePathFilter(
                              product.previewPhoto,
                              'preview_photo',
                              'thumbnail'
                            )
                          }/>
                        </ListItemAvatar>

                        <ListItemText
                          primary={product.name}
                          secondary={`Category: ${product.Category.name}`}/>

                        <ListItemSecondaryAction>
                          <ListItemText secondary={currencyFilter(product.price, 'USD')} />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    <MuiThemeProvider theme={lightTheme}>
                      <Button
                        onClick={() => this.onCloseOrder(order)}
                        color="primary"
                        fullWidth={true}
                      >
                        Close
                      </Button>
                    </MuiThemeProvider>
                  </Collapse>
                </div>
            ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(
  withRouter(OrderListPage)
);