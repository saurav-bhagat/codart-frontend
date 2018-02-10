import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Leaderboard from './components/LeaderBoard';
import QuestionSpace from './components/QuestionSpace';
import Logout from './components/Logout';
import { BrowserRouter } from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Main = () => (
        <BrowserRouter>
              <Switch>
                  <Route exact path='/' component={App}  />
                  <Route exact path="/leaderboard" component={Leaderboard}  />

                       <Route exact path="/QuestionSpace" component={QuestionSpace}  />

                  <Route exact path="/logout" component={Logout}  />
              </Switch>
        </BrowserRouter>
)
ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
