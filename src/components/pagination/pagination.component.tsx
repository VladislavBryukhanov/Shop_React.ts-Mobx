import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { computed, observable, reaction } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { IPagingQuery } from '../../types/pagingQuery';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './pagination.styles';
import Icon from '@material-ui/core/Icon';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { withPagingQuery } from './withPagingQuery';

interface IPaginationProps extends RouteComponentProps {
  fetchingMethod: (query: IPagingQuery, category?: string) => Promise<void>;
  withSearch?: boolean;
  count: number;
  limit: number;
  query: IPagingQuery;
  category?: string;
  classes: any;
}

@observer
class PaginationComponent extends React.Component<IPaginationProps> {
  @computed
  get pageCount() {
    let pageCount = (this.props.count / this.props.limit);
    if (pageCount > Math.floor(pageCount)) {
      pageCount = Math.floor(pageCount) + 1;
    }
    return pageCount || 1;
  }

  @observable
  searchQuery: string = '';

  componentDidMount() {
    this.fetchingMethod();

    reaction(
      () => ({ ...this.props.query, category: this.props.category }),
      (data, reaction) => {
        this.fetchingMethod();
      }, { equals: (from, to) => _.isEqual(from, to) }
    );
  }

  fetchingMethod() {
    const { searchQuery } = this;
    const { query, limit, category } = this.props;
    let currentPage = searchQuery ? 1 : query.currentPage;

    this.props.fetchingMethod({ searchQuery, currentPage, limit }, category);
  }

  changePage = (page: number) => {
    this.props.history.push({
      ...this.props.history,
      search: `page=${page}`
    })
  };

  renderPageNumbers = (displayedNumbers: number = 8) => {
    const { currentPage } = this.props.query;
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
          disabled={this.props.query.currentPage === i}
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
    this.searchQuery = e.target.value;
    _.debounce(() => {
      this.fetchingMethod();
    }, 300)();
  };

  clearSearchFilter = () => {
    this.searchQuery = '';
    this.fetchingMethod();
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
              value={this.searchQuery}
              InputProps={{
                endAdornment: (
                  <>
                    { this.searchQuery && (
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
              onClick={() => this.changePage(this.props.query.currentPage - 1)}
              disabled={this.props.query.currentPage === 1}
            >
              <Icon>arrow_back_ios</Icon>
            </IconButton>
            {this.renderPageNumbers()}
            <IconButton
              onClick={() => this.changePage(this.props.query.currentPage + 1)}
              disabled={this.props.query.currentPage === this.pageCount}
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
  withPagingQuery(PaginationComponent)
);
