// import libraries
import { Switch, Route, Redirect } from 'react-router-dom';
import { useEffect } from 'react';

// import components
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Lobby from './components/Lobby/Lobby';

// redux shit
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux'
import { State, wsActionCreator } from './state';

// network
import Network from './utils/network';

const App: React.FunctionComponent<{}> = () => {
  const { isLogged } = useSelector((state: State) => state.ws)
  const dispatch = useDispatch();
  const { setIsLogged } = bindActionCreators({...wsActionCreator}, dispatch);
  
  useEffect(() => {
    Network('GET', 'http://localhost:4000/user/validator')
      .then((res) => {
        if (typeof res !== 'boolean') return;
        if (!(res === true)) return;
        setIsLogged(res)
    });
  }, []);
  return (
    <div>
      {!isLogged
      ?
        <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
      :
      <Switch>
        <Route path="/lobby" component={Lobby} />
        <Route path="*">
          <Redirect to="/lobby" />
        </Route>
      </Switch>
          
      }
      {/* <Login />
      <Register />
      <Lobby /> */}
    </div>
  );
};

export default App;
