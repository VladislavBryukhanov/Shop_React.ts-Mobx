import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { computed, observable } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { IPagingQuery } from '../../types/pagingQuery';
import { PRODUCTS_ONE_PAGE_LIMIT } from '../../common/constants';
import queryString from 'query-string';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './pagination.styles';
import Icon from '@material-ui/core/Icon';
import _ from 'lodash';
import { observer } from 'mobx-react';

interface IRouterParams {
  category: string;
}

interface IPaginationProps extends RouteComponentProps<IRouterParams> {
  fetchingMethod: (query: IPagingQuery, category?: string) => Promise<void>;
  count: number;
  limit: number;
  withSearch?: boolean;
  classes: any;
}

@observer
class PaginationComponent extends React.Component<IPaginationProps> {
  @observable
  query: IPagingQuery;
  @computed
  get category() {
    return this.props.match.params.category;
  }

  @computed
  get pageCount() {
    let pageCount = (this.props.count / this.query.limit);
    if (pageCount > Math.floor(pageCount)) {
      pageCount = Math.floor(pageCount) + 1;
    }
    return pageCount || 1;
  }

  constructor(props: IPaginationProps) {
    super(props);
    const { page = 1 } = queryString.parse(this.props.history.location.search);

    this.query = {
      currentPage: +page!,
      limit: this.props.limit,
      searchQuery: ''
    };
  }

  componentDidMount() {
    this.props.fetchingMethod({ ...this.query }, this.category);
  }

  componentDidUpdate(prevProps: IPaginationProps) {
    if (this.props.location !== prevProps.location) {
      const { page = 1 } = queryString.parse(this.props.history.location.search);
      this.query.currentPage = +page!;

      this.props.fetchingMethod({ ...this.query }, this.category);
    }
  }

  changePage = (page: number) => {
    this.query.currentPage = page;
    this.props.history.push({
      ...this.props.history,
      search: `page=${this.query.currentPage}`
    })
  };

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

    _.debounce(() => {
      this.props.fetchingMethod({ ...this.query, currentPage: 1 }, this.category);
    }, 300)();
  };

  clearSearchFilter = () => {
    this.query.searchQuery = '';
    this.props.fetchingMethod({ ...this.query }, this.category);
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid item xs={10} className={classes.pagination}>
        <Paper elevation={6}>
          { this.props.withSearch && (
            <TextField
              fullWidth={true}
              variant="filled"
              label="Category"
              onChange={this.searchFilter}
              value={this.query.searchQuery}
              InputProps={{
                endAdornment: (
                  <>
                    { this.query.searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.clearSearchFilter}
                        >
                          <Icon>close</Icon>
                        </IconButton>
                      </InputAdornment>
                    )}

                    <InputAdornment position="end">
                      <Icon color="primary">search</Icon>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}

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
    )
  }
}

export default withStyles(styles)(
  withRouter(PaginationComponent)
);
