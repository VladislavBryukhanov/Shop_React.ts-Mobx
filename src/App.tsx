import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Auth from './pages/Auth/auth.component';

const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Auth}/>
      <Route path="/sign_up" component={
        (props: any) => <Auth {...props} isSignUp={true} />
      } />
    </Switch>
  );
};

export default App;
