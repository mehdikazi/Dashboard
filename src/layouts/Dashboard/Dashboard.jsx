import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import CsvParse from '@vtex/react-csv-parse';
import { readFile, Series, DataFrame } from 'data-forge';
import createAndStoreImportantDfs from '../../DFFunctions/createAndStoreImportantDfs.js';
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { withStyles } from "material-ui";

import { Header, Footer, Sidebar } from "../../components";

import dashboardRoutes from "../../routes/dashboard.jsx";

import appStyle from "../../assets/jss/material-dashboard-react/appStyle.jsx";

import image from "../../assets/img/sidebar-2.jpg";
import logo from "../../assets/img/reactlogo.png";

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

class App extends React.Component {
  state = {
    mobileOpen: false,
    questionaireData: null,
    checkInData: null,
  };
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps";
  }
  componentDidMount() {
    if(navigator.platform.indexOf('Win') > -1){
      // eslint-disable-next-line
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
  }

  handleQuestionaireData = questionaireData => {
    const questionaireDf = new DataFrame(questionaireData);
    window.qd = questionaireDf;
    this.setState({ questionaireData })
  }

  handleCheckInData = checkInData => {
    const checkinDf = new DataFrame(checkInData);
    window.cid = checkinDf;
    this.setState({ checkInData })
  }

  handleError = error => {
    this.setState({ error })
  }
  render() {
    if (this.state.questionaireData && this.state.checkInData) {
      const { classes, ...rest } = this.props;
      createAndStoreImportantDfs();
      return (
        <div className={classes.wrapper}>
          <Sidebar
            routes={dashboardRoutes}
            logoText={"Creative Tim"}
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            {...rest}
          />
          <div className={classes.mainPanel} ref="mainPanel">
            <Header
              routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              {...rest}
            />
            {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
            {this.getRoute() ? (
              <div className={classes.content}>
                <div className={classes.container}>{switchRoutes}</div>
              </div>
            ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
          </div>
        </div>
      );
    } else {
      const questionaireKeys = [
        'first_name',
        'last_name',
        'agree_to_terms',
        'gender',
        'age',
        'is_new_to_if',
        'is_wl_goal',
        'goal_weight',
        'start_weight',
        'height',
        'activity_level',
        'schedule',
        'schedule_4_3',
        'time_4_3',
        'schedule_5_2',
        'time_5_2',
        'time_20_4',
        'time_16_8',
        'email',
        'city_state',
        'country',
        'facebook_url',
        'weight_loss_from_if',
        'introduction',
        'start_date',
        'submited_at',
        'token',
        'challenge_period',
      ]
      const checkInKeys = [
        'token',
        'date',
        'fast_or_eat',
        'is_weight',
        'weight',
        'is_calories',
        'calories_eaten',
        'is_calories_burnt',
        'is_body_fat',
        'is_measurments',
        'is_progress_photos',
        'is_none_chosen',
        'bf_percent',
        'burned_calories',
        'neck',
        'chest',
        'waist',
        'hips',
        'upper_thigh',
        'mid_calf',
        'bicep',
        'forearm',
        'front_facing',
        'side_facing',
        'rating',
        'notes',
        'name',
        'email',
        'tdee',
        'goal'
      ]
      return (
        <div>
          <h1>FastWithMe Challenge Dashboard</h1>
          <div>
            <div>
              Upload FastWithMe Challenge Questionaire
            </div>
            <CsvParse
              keys={questionaireKeys}
              onDataUploaded={this.handleQuestionaireData}
              onError={this.handleError}
              render={onChange => <input type="file" onChange={onChange} />}
            />
          </div>

          <div>
            <div>
              Upload FastWithMe Challenge Check-Ins
            </div>
            <CsvParse
              keys={checkInKeys}
              onDataUploaded={this.handleCheckInData}
              onError={this.handleError}
              render={onChange => <input type="file" onChange={onChange} />}
            />
          </div>
        </div>
      );
    }
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(appStyle)(App);
