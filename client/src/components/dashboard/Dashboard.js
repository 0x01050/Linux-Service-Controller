import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as dashboardRequests from '../../services/dashboardRequest';
import { logoutUser } from "../../actions/authActions";
import {
  Box,
  Grid,
  Divider,
  withStyles,
  Typography,
} from '@material-ui/core';
import ServiceController from "./ServiceController";
import WebSocketBox from "./WebSocketBox";

const isEmpty = require("is-empty");

const styles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

class Dashboard extends Component {

  constructor() {
    super();
    this.state = {
      status: false,
      services: [],
      webSocketServer : "",
    };
  }

  async componentDidMount(){

    dashboardRequests.getServices()
    .then((ret)=>{
      if(ret.connection)
      {
        const { services, webSocketServer} = ret.data;
        this.setState({services, webSocketServer});
      }
    })
  }

  componentWillUnmount(){
    clearInterval(this.intervalID);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };


  render() {
    // const { user } = this.props.auth;
    const {services, webSocketServer} = this.state;
    const { classes } = this.props;
    if(isEmpty(services) || isEmpty(webSocketServer)) return null;
    return (
      <div
        style={{paddingTop : '75px'}}
        className="container">

        <Box
          display="flex"
          justifyContent="center"
          mb={0}
          className={classes.root}
        >
          <Grid
            container
            justify="space-between"
            spacing={0}
          >
            {
              services.map((service, index)=>(
                <Fragment
                  key={index}
                >
                <ServiceController
                  serviceName={service.serviceName}
                  friendlyName={service.friendlyName}
                  />
                <Grid
                  md={12}
                  sm={12}
                  xs={12}
                  item
                >
                  <Divider />
                </Grid>
              </Fragment>
              ))

            }
              <Grid
                md={6}
                sm={12}
                xs={12}
                item
              >
              <Typography 
                style={{
                  marginTop: '20px',
                  fontSize : 'large'
                }}
                color="textSecondary"
                gutterBottom>
                WebSocket Text
              </Typography>
            <WebSocketBox webSocketServer={webSocketServer} />
            </Grid>
          </Grid>
        </Box>
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>


      
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(styles)(Dashboard));
