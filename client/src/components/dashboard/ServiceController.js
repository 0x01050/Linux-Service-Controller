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
  withStyles
} from '@material-ui/core';

const styles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
});

class ServiceController extends Component {
  constructor() {
    super();
    this.state = {
      status: false,
      serviceName: '',
      friendlyName: '',

    };
    this.onStatusClick = this.onStatusClick.bind(this);
    this.onStartClick = this.onStartClick.bind(this);
    this.onStopClick = this.onStopClick.bind(this);
  }

  async componentDidMount() {
    const { serviceName, friendlyName } = this.props;

    dashboardRequests.getStatus(serviceName)
      .then((ret) => {
        if (ret.connection) {
          const status = (ret.data.status === 'on');
          this.setState({ serviceName, friendlyName, status });
        } else {
          this.setState({ serviceName, friendlyName });
        }
      });
    try {
      this.intervalID = setInterval(async () => {
        const ret = await dashboardRequests.getStatus(serviceName);
        if (ret.connection) {
          const status = (ret.data.status === 'on');
          if (status !== this.state.status) this.setState({ status });
        } else {
          clearInterval(this.intervalID);
        }
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  onStatusClick = async (e) => {
    e.preventDefault();
    const { serviceName } = this.state;
    dashboardRequests.getStatus(serviceName)
      .then((ret) => {
        if (ret.connection) {
          const status = (ret.data.status === 'on');
          this.setState({ service: ret.data.serviceName, status });
        }
      });
  }

  onStartClick = async (e) => {
    e.preventDefault();
    // this.setState({status : true});
    const { serviceName } = this.state;
    dashboardRequests.startService(serviceName)
      .then((ret) => {
        if (ret.connection) {
          const { success } = ret.data;
          if (!success) window.alert('Service start failed!');
          else {
            this.setState({ status: true });
          }
        }
      });
  }

  onStopClick = async (e) => {
    e.preventDefault();
    // this.setState({status : false});
    const { serviceName } = this.state;
    dashboardRequests.stopService(serviceName)
      .then((ret) => {
        if (ret.connection) {
          const { success } = ret.data;
          if (!success) window.alert('Service stop failed!');
          else {
            this.setState({ status: false });
          }
        }
      });
  }

  onRestartClick = async (e) => {
    e.preventDefault();
    // this.setState({status : true});
    const { serviceName } = this.state;
    dashboardRequests.restartService(serviceName)
      .then((ret) => {
        if (ret.connection) {
          const { success } = ret.data;
          if (!success) window.alert('Service restart failed!');
          else {
            this.setState({ status: true });
          }
        }
      });
  }

  render() {
    // const { user } = this.props.auth;
    const { status, friendlyName } = this.state;

    return (
      <>
          <Grid
            item
            md={4}
            sm={4}
          >
            {
            status
              ? (
                <img
                  src="/on.jpg"
                  height={50}
                  style={{
                    marginTop: '10px'
                  }}
                  alt="on status"
                />
              ) : (
                <img
                  src="/off.jpg"
                  height={50}
                  style={{
                    marginTop: '10px'
                  }}
                  alt="off status"
                />
              )
          }
          </Grid>
          <Grid
            md={8}
            sm={8}
            item
          >
            <Card variant="outlined">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {friendlyName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            md={12}
            sm={12}
            item
          >
            <Box mx="auto" mt={10}>
              <Button
                onClick={this.onStartClick}
                variant="contained"
                mt={1}
                style={{
                  margin: '10px'
                }}
                color="primary"
              >
                Start
              </Button>
              <Button
                onClick={this.onStopClick}
                variant="contained"
                style={{
                  margin: '10px'
                }}
                pt={4}
                color="secondary"
              >
                Stop
              </Button>
              <Button
                onClick={this.onRestartClick}
                variant="contained"
                pt={1}
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  margin: '10px'
                }}
              >
                Restart
              </Button>
            </Box>
          </Grid>
        </>
    );
  }
}

ServiceController.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(styles)(ServiceController));
