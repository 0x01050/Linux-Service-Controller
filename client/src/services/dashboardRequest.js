import axios from "axios";

// Login - get user token
export const getStatus = () => {
    return axios
      .post("/api/dashboard/status")
      .then((res) => {
        return {
          data : res.data,
          connection : true, 
        };
        // Set token to localStorage
      })
      .catch(err =>{
        window.alert("Node.js server Error");
          console.log(err);
          return {data : err, connection : false};
      }
      );
  };
  
  export const startService = () => {
    return axios
      .post("/api/dashboard/start")
      .then(res => {
        return {
          data : res.data,
          connection : true, 
        };
      })
      .catch(err =>{
        window.alert("Node.js server Error");
        return {data : err, connection : false};
      }
      );
  };
  
  export const stopService = () => {
    return axios
      .post("/api/dashboard/stop")
      .then(res => {
        return {
          data : res.data,
          connection : true, 
        };
      })
      .catch(err =>{
        window.alert("Node.js server Error");
        return {data : err, connection : false};
      }
      );
  };
  
  export const restartService = () => {
    return axios
      .post("/api/dashboard/restart")
      .then(res => {
        return {
          data : res.data,
          connection : true, 
        };
      })
      .catch(err =>{
        window.alert("Node.js server Error");
        return {data : err, connection : false};
      }
      );
  };
  
  