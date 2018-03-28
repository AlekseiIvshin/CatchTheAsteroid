import { applyMiddleware, createStore, combineReducers } from "redux";
import thunkMiddleware from 'redux-thunk';
import BeaconsReducer from "../reducers/BeaconsReducer";
import BeaconsMiddleware from '../middlewares/BeaconsMiddleware';
import GoogleSignInMiddleware from "../middlewares/GoogleSignInMiddleware";
import GoogleSignInReducer from "../reducers/GoogleSignInReducer";

const rootReducer = combineReducers({
    beacons: BeaconsReducer,
    googleSignIn: GoogleSignInReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, BeaconsMiddleware, GoogleSignInMiddleware)
);

export { store };
