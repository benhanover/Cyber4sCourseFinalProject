// import libraries
import { Switch, Route, Redirect } from "react-router-dom";
import { useEffect } from "react";

// import components
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Lobby from './components/Lobby/Lobby';
import VideoRoom from './components/VideoRoom/VideoRoom';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar/Navbar';
import OtherUserProfile from './components/OtherUserProfile/OtherUserProfile';

// redux shit
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { State, wsActionCreator } from "./state";

// network
import Network from "./utils/network";

// import css
import "./App.css";

const App: React.FunctionComponent<{}> = () => {
  const { user } = useSelector((state: State) => state.ws);
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);

  useEffect(() => {
    Network("GET", "http://192.168.1.111:4000/user/validator")
      .then((res) => {
        if (!res) return;
        setUser(res.user);
      })
      .catch((e) => {
        console.log("in the validator error:", e);
      });
  }, []);
  return (
    <>
      {!user
      ?
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      :
      <>
        <Navbar />
        <Switch>
          <Route path="/lobby" component={Lobby} />
          <Route path="/room" component={VideoRoom} />
          <Route path="/my-profile" component={Profile} />
          <Route path="/profile" component={OtherUserProfile} />
          <Route path="*">
            <Redirect to="/lobby" />
          </Route>
        </Switch>
      </>
          
      }
    
    </>
  );
};

export default App;
