import { combineReducers } from "redux";
import authReducer from "./authReducer";
import dashboardReducer from "./dashboardReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  dashboard : dashboardReducer,
  errors: errorReducer
});
