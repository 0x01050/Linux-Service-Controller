import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as dashboardRequests from '../../services/dashboardRequest';
import { logoutUser } from "../../actions/authActions";
import {
  Divider,
  withStyles
} from '@material-ui/core';
import ServiceController from "./ServiceController";

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
    };
  }

  async componentDidMount(){

    dashboardRequests.getServices()
    .then((ret)=>{
      if(ret.connection)
      {
        const services = ret.data.services;
        this.setState({services});
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
    const {services} = this.state;
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        {
          services.map(service=>(
            <>
              <ServiceController 
                serviceName={service.serviceName}
                friendlyName={service.friendlyName}
                />
              <Divider />
            </>
          ))
        }
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
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
