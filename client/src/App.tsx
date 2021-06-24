// import libraries
// import { Switch, Route } from 'react-router-dom'

// import components
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Lobby from './components/Lobby/Lobby';

const App: React.FunctionComponent<{}> = () => {
  return (
    <div>
      {/* <Switch
      >
        
        <Route path="/" component/>

      
        </Switch> */}
      <Login />
      <Register />
      <Lobby />
    </div>
  );
};

export default App;
