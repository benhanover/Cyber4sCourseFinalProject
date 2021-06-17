import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { roomCountActionCreators, State } from './state';

function App() {
  const dispatch = useDispatch();
  const { increase, decrease } = bindActionCreators(
    roomCountActionCreators,
    dispatch
  );
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
