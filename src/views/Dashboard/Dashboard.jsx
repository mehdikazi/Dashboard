import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
import {
  ContentCopy,
  Store,
  InfoOutline,
  Warning,
  DateRange,
  LocalOffer,
  Update,
  ArrowUpward,
  AccessTime,
  Accessibility,
} from "@material-ui/icons";
import { withStyles, Grid } from "material-ui";

import {
  StatsCard,
  ChartCard,
  TasksCard,
  RegularCard,
  Table,
  ItemGrid
} from "../../components";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "../../variables/charts";

import dashboardStyle from "../../assets/jss/material-dashboard-react/dashboardStyle";
var Chartist = require("chartist");

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  calculateScheduleData = () => {
    var delays = 80,
      durations = 500;
    var delays2 = 80,
      durations2 = 500;

    const schedule_data_array = window.schedule_table.toRows();
    const labels = []
    const series = []
    for (var i=0; i < schedule_data_array.length; i++) {
      labels.push(schedule_data_array[i][0]);
      series.push(schedule_data_array[i][1]);
    };

    const schedule_data = {
      data: {
        labels: labels,
        series: [series]
      },
      options: {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: Math.max.apply(Math, series), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      },
      // for animation
      animation: {
        draw: function(data) {
          if (data.type === "line" || data.type === "area") {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path
                  .clone()
                  .scale(1, 0)
                  .translate(0, data.chartRect.height())
                  .stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
              }
            });
          } else if (data.type === "point") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: "ease"
              }
            });
          }
        }
      }
    };
    return schedule_data;
  }

  calculateChallengePeriodData = () => {
    var delays = 80,
      durations = 500;
    var delays2 = 80,
      durations2 = 500;
    const challenge_period_array = window.challenge_period_table.toRows();
    const labels = [];
    const series = [];
    for (var i=0; i < challenge_period_array.length; i++) {
      labels.push(challenge_period_array[i][0]);
      series.push(challenge_period_array[i][1]);
    };

    const challenge_period_data = {
      data: {
        labels: labels,
        series: [series]
      },
      options: {
        axisX: {
          showGrid: false
        },
        low: 0,
        high: Math.max.apply(Math, series),
        chartPadding: {
          top: 0,
          right: 5,
          bottom: 0,
          left: 0
        },
      },
      responsiveOptions: [
        [
          "screen and (max-width: 640px)",
          {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[0];
              }
            }
          }
        ]
      ],
      animation: {
        draw: function(data) {
          if (data.type === "bar") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: "ease"
              }
            });
          }
        }
      }
    };
    return challenge_period_data;
  }

  render() {
    const challenge_period_data = this.calculateChallengePeriodData();
    const schedule_data = this.calculateScheduleData();
    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="orange"
              title="Total Users"
              description={window.qd.count()}
              small="users"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="green"
              title="Active Users"
              description={window.demographics_table.getSeries("number_active_users").toArray()[0]}
              small="users"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="red"
              title="New to IF"
              description={window.demographics_table.getSeries("Percent_New_To_IF").toArray()[0]}
              small="%"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="blue"
              title="Average Expected Loss"
              description={window.demographics_table.getSeries("Average_Expected_Loss").toArray()[0]}
              statIcon={Update}
              small="pounds"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="purple"
              title="Median Expected Loss"
              description={window.demographics_table.getSeries("Median_Expected_Loss").toArray()[0]}
              small="pounds"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={DateRange}
              iconColor="orange"
              title="Average Age"
              description={window.demographics_table.getSeries("Average_Age").toArray()[0]}
              small="years old"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="green"
              title="# of Females"
              description={window.gender_table.toArray()[0].count}
              small="users"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Accessibility}
              iconColor="red"
              title="# of Males"
              description={window.gender_table.toArray()[1].count}
              small="users"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={schedule_data.data}
                  type="Line"
                  options={schedule_data.options}
                  listener={schedule_data.animation}
                />
              }
              chartColor="green"
              title="Schedule Breakdown"
              text={'Total users broken down by schedule'}
              statIcon={AccessTime}
              statText="updated 4 minutes ago"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={challenge_period_data.data}
                  type="Bar"
                  options={challenge_period_data.options}
                  responsiveOptions={challenge_period_data.responsiveOptions}
                  listener={challenge_period_data.animation}
                />
              }
              chartColor="orange"
              title="Challenge Period Breakdown"
              text={'Total users broken down by challenge period'}
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={4}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              }
              chartColor="red"
              title="Completed Tasks"
              text="Last Campaign Performance"
              statIcon={AccessTime}
              statText="campaign sent 2 days ago"
            />
          </ItemGrid>
        </Grid>
        <Grid container>
          <ItemGrid xs={12} sm={12} md={6}>
            <TasksCard />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
            <RegularCard
              headerColor="orange"
              cardTitle="Employees Stats"
              cardSubtitle="New employees on 15th September, 2016"
              content={
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
