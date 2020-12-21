import axios from "axios";

export const getServices = () => {
  return axios
    .post("/api/dashboard/services")
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

export const getStatus = (serviceName) => {
    return axios
      .post("/api/dashboard/status", {serviceName})
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
  
  export const startService = (serviceName) => {
    return axios
      .post("/api/dashboard/start", {serviceName})
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
  
  export const stopService = (serviceName) => {
    return axios
      .post("/api/dashboard/stop", {serviceName})
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
  
  export const restartService = (serviceName) => {
    return axios
      .post("/api/dashboard/restart", serviceName)
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
  
  