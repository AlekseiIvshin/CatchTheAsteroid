import { SIGN_IN } from "../actions/SignInActionTypes";
import { ApiActionTypes } from "./../actions/actionsTypes";

const initialState = {
  email: "",
  name: "",
  typeAuthorization: "",
  phone: "",
  idVK: "",
  newUser: true,
  userId: null,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        email: action.payload.email,
        name: action.payload.name,
        typeAuthorization: action.payload.typeAuthorization,
        phone: action.payload.phone,
        idVK: action.payload.idVK,
        newUser: action.payload.newUser,
        userId: action.payload.userId,
      };
    case ApiActionTypes.GET_ALL_STATIONS_SUCCESS:
      return {
        ...state,
        name: action.payload.name,
      };
    case ApiActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
