// import libraries
import { Switch, Route, Redirect } from "react-router-dom";
import { useEffect, useState } from "react";

// import components
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Lobby from "./components/Lobby/Lobby";
import VideoRoom from "./components/VideoRoom/VideoRoom";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import OtherUserProfile from "./components/OtherUserProfile/OtherUserProfile";
import AccountSettings from './components/AccountSettings/AccountSettings';


// redux shit
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { State, wsActionCreator } from "./state";

// import enums
import { enums } from "./utils/enums";
  
// network
import Network from "./utils/network";
// import css
import "./App.css";

const App: React.FunctionComponent<{}> = () => {
  const { user } = useSelector((state: State) => state.ws);
  const dispatch = useDispatch();
  const { setUser } = bindActionCreators({ ...wsActionCreator }, dispatch);
  const [displayAccountSettings, setDisplayAccountSettings] = useState<any>(false);
  
  useEffect(() => {
    Network("GET", `${enums.baseUrl}/user/validator`)
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
      {!user ? (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      ) : (
        <>
         
          {
            displayAccountSettings&&
             <AccountSettings user={user} setUser={setUser} displayAccountSettings={displayAccountSettings} setDisplayAccountSettings={setDisplayAccountSettings} />
          }
          <Switch>
            <Route path="/lobby" >
              <>
              <Navbar setDisplayAccountSettings={setDisplayAccountSettings} displayAccountSettings={displayAccountSettings}/>
              <Lobby />
              </>
            </Route>
            <Route path="/room" component={VideoRoom} />
            <Route path="/my-profile"  >
            <>
            <Navbar setDisplayAccountSettings={setDisplayAccountSettings} displayAccountSettings={displayAccountSettings}/>
            <Profile />
            </>
            </Route>
            <Route
              exact
              path="/profile/:user"
              render={(props: any) => {
             return( 
               <>
              <Navbar setDisplayAccountSettings={setDisplayAccountSettings} displayAccountSettings={displayAccountSettings}/>
             <OtherUserProfile user={props} />
             </>)
            }}
            />
            <Route path="*">
              <Redirect to="/lobby" />
            </Route>
          </Switch>
        </>
      )}
    </>
  );
};

export default App;



{/* <>
<Navbar setDisplayAccountSettings={setDisplayAccountSettings} displayAccountSettings={displayAccountSettings}/>
{
  displayAccountSettings&&
   <AccountSettings user={user} setUser={setUser} displayAccountSettings={displayAccountSettings} setDisplayAccountSettings={setDisplayAccountSettings} />
}
<Switch>
  <Route path="/lobby" component={Lobby} />
  <Route path="/room" component={VideoRoom} />
  <Route path="/my-profile" component={Profile} />
  <Route
    exact
    path="/profile/:user"
    render={(props: any) => <OtherUserProfile user={props} />}
  />
  <Route path="*">
    <Redirect to="/lobby" />
  </Route>
</Switch>
</> */}