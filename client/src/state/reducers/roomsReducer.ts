import { Iroom } from "../../components/Lobby/interfaces";

const roomReducer = (state: Array<Iroom | null> = [], action: any) => {
  switch (action.type) {
    case "setRooms":
      state = action.payload;
      break;
    case "addRoom":
      console.log(
        action.payload,
        "payload inside reducer the beforestate: ",
        state
      );

      state.push(action.payload);
      console.log(" inside reducer the  after state: ", state);
      break;
    case "removeRoom":
      const roomIndex = state.findIndex((room) => action.payload);
      state[roomIndex] = null;
      break;
    default:
      return state;
  }
  return [...state];
};

export default roomReducer;
