import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import Chartist from 'chartist';
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
  TrendingDown,
  GroupAdd,
  Group,
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

import dashboardStyle from "../../assets/jss/material-dashboard-react/dashboardStyle";

var tooltip = require("chartist-plugin-tooltip-infl");

class Dashboard extends React.Component {

  render() {
    const schedule_data = this.calculateScheduleData();
    const challenge_period_data = this.calculateChallengePeriodData();
    return (
      <div>
        <Grid container>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={Group}
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
              icon={TrendingDown}
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
              iconColor="orange"
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
              title="# of Females"
              description={window.gender_table.toArray()[0].count}
              small="users"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={DateRange}
              iconColor="red"
              title="Average Age"
              description={window.demographics_table.getSeries("Average_Age").toArray()[0]}
              small="years old"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={GroupAdd}
              iconColor="purple"
              title="New to IF"
              description={window.demographics_table.getSeries("Percent_New_To_IF").toArray()[0]}
              small="%"
              statIcon={DateRange}
              statText="Last 24 Hours"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={6} md={3}>
            <StatsCard
              icon={TrendingDown}
              iconColor="blue"
              title="Total Weight Lost"
              description={Math.round(this.calculateTotalWeightLoss() * 10) / 10}
              small="pounds"
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
          <ItemGrid xs={12} sm={12} md={6}>
            <ChartCard
              chart={
                <ChartistGraph
                  className="ct-chart"
                  data={schedule_data.data}
                  type="Bar"
                  options={schedule_data.options}
                  listener={schedule_data.animation}
                />
              }
              chartColor="blue"
              title="Schedule Breakdown"
              text={'Total users broken down by schedule'}
              statIcon={AccessTime}
              statText="updated 4 minutes ago"
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={6}>
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
        </Grid>
      </div>
    );
  }

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
        axisX: {
          showGrid: true,
          onlyInteger: true,
        },
        plugins: [
          Chartist.plugins.tooltip({
            className : 'ct-tooltipa'
          })
        ],
        axisY: {
          showGrid: false,
        },
        horizontalBars: true,
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
          showGrid: false,
        },
        plugins: [
          Chartist.plugins.tooltip({
            className : 'ct-tooltip'
          })
        ],
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

  calculateTotalWeightLoss = () => {
    const df = window.joined_qd_cid
    const removeNoneEntries = df
      .where(row => row.checkin_weight > 0);
    const lowestWeight = removeNoneEntries
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_weight: group.first().start_weight,
        lowest_weight: group.deflate(row => row.checkin_weight).min()
      }))
      .inflate();

    const weightLossByEachTable = lowestWeight
      .select(row => ({
        email: row.email,
        weight_lost: row.start_weight - row.lowest_weight
      }));

    const totalWeightLost = weightLossByEachTable.getSeries("weight_lost").sum();
    return totalWeightLost;
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
