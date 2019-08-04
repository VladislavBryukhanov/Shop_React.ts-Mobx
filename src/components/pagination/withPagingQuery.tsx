import React from 'react';
import { computed } from 'mobx';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

interface IRouterParams {
  category: string;
}

export const withPagingQuery = <P extends any>(Component: React.ComponentType<any>) => {
  class WrappedComponent extends React.PureComponent<P & RouteComponentProps<IRouterParams>> {
    @computed
    get category() {
      return this.props.match.params.category;
    }

    @computed
    get currentPage() {
      const { page = 1 } = queryString.parse(this.props.history.location.search);
      return +page!;
    }

    render() {
      return (
        <Component
          {...this.props}
          category={this.category}
          query={{
            currentPage: this.currentPage,
          }}/>
      )
    }
  }

  return withRouter(WrappedComponent)
};
