import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as dashboardRequests from '../../services/dashboardRequest';
import { logoutUser } from "../../actions/authActions";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  withStyles
} from '@material-ui/core';

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
      service: "",
    };
    this.onStatusClick = this.onStatusClick.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
  }

  async componentDidMount(){

    dashboardRequests.getStatus()
    .then((ret)=>{
      if(ret.connection)
      {
        const status = (ret.data.status === "on"); 
        this.setState({service : ret.data.serviceName, status});
      }
    })
    try {
      this.intervalID = setInterval(async () => {
        const ret = await dashboardRequests.getStatus();
        if(ret.connection)
        {
          const status = (ret.data.status === "on");
          if(status !== this.state.status)
            this.setState({status});
        }
        else
        {
          clearInterval(this.intervalID);
        }
      }, 3000);
    } catch(e) {
      console.log(e);
    }
  }

  componentWillUnmount(){
    clearInterval(this.intervalID);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  onStatusClick = async e => {
    e.preventDefault();
    dashboardRequests.getStatus()
    .then((ret)=>{
      if(ret.connection)
      {
        const status = (ret.data.status === "on"); 
        this.setState({service : ret.data.serviceName, status});
      }
    })
  }

  onStartClick = async e => {
    e.preventDefault();
    // this.setState({status : true});
    dashboardRequests.startService()
      .then((ret)=>{
        if(ret.connection)
        {
          const success = ret.data.success; 
          if(!success)
            window.alert("Service start failed!");
          else
          {
            this.setState({status : true});
          }
        }
      })
  }

  onStopClick = async e => {
    e.preventDefault();
    // this.setState({status : false});
    dashboardRequests.stopService()
    .then((ret)=>{
      if(ret.connection)
      {
        const success = ret.data.success; 
        if(!success)
          window.alert("Service stop failed!");
        else
        {
          this.setState({status : false});
        }
      }
    })
  }

  onRestartClick = async e => {
    e.preventDefault();
    // this.setState({status : true});
    dashboardRequests.restartService()
      .then((ret)=>{
        if(ret.connection)
        {
          const success = ret.data.success; 
          if(!success)
            window.alert("Service restart failed!");
          else
          {
            this.setState({status : true});
          }
        }
      })

  }

  render() {
    // const { user } = this.props.auth;
    const {status, service} = this.state;
    const { classes } = this.props;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <Box
              display="flex"
              justifyContent="center"
              mb={3}
              className={classes.root}
            >
              <Grid
                container
                justify="space-between"
                spacing={2}
              >
                <Grid item
                md={4}
                sm={4}
                >
                  {
                    status?
                    (
                      <img 
                      src="/on.jpg" 
                      height={50}
                      style={{
                        marginTop : "10px"
                      }}
                      alt="on status"
                      />
                    ):(
                      <img 
                      src="/off.jpg" 
                      height={50}
                      style={{
                        marginTop : "10px"
                      }}
                      alt="off status"
                      />
                    )
                  }
                  </Grid>
                <Grid 
                md= {8}
                sm = {8}
                item>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {service}
                      </Typography>
                    </CardContent>
                  </Card>
                  </Grid>
              <Grid
              md = {12}
              sm ={12}
              item>
                <Box mx="auto" mt={10}>
                  <Button 
                    onClick={this.onStartClick}
                    variant="contained"
                    mt={1}
                    style={{
                      margin: '10px'
                    }}
                    color="primary"> 
                    Start
                  </Button>
                  <Button 
                    onClick={this.onStopClick}
                    variant="contained"
                    style={{
                      margin: '10px'
                    }}
                    pt={4}
                    color="secondary"> 
                    Stop
                  </Button>
                  <Button 
                    onClick={this.onRestartClick}
                    variant="contained"
                    pt={1}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      margin : '10px'
                    }}> 
                    Restart
                  </Button>
                </Box>
              </Grid>
              </Grid>
            </Box>
            <Divider />
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
