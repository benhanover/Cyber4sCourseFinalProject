import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators, State } from './state';

function App() {
  const dispatch = useDispatch();
  const { increase, decrease } = bindActionCreators(ActionCreators, dispatch);
  const roomCount = useSelector((state: State) => state.roomCount);

  return (
    <div className='App'>
      <h1>{roomCount}</h1>
      <button onClick={() => increase(1)}>Increase</button>
      <button onClick={() => decrease(1)}>Decrease</button>
    </div>
  );
}

export default App;
