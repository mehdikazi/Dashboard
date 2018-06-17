import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";
import * as math from 'mathjs';

class CheckinInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().add(1, 'd'),
      emaill: '',
    }
  }

  handleDateChange = (date) => {
    this.setState({
      startDate: date,
    });
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    })
  }

  checkDate = (startDate, checkInDate) => {
    if (startDate.isSame(moment().add(1, 'd'), 'day')) {
      return true;
    }
    return startDate.isSame(checkInDate, 'day');
  }

  checkEmail = (inputEmail, tableEmail) => {
    if (inputEmail == '' || !inputEmail) {
      return true;
    }
    return tableEmail.startsWith(inputEmail);
  }

  render() {
    const checkinInfoColumnOrder = window.joined_active_users_with_checkin_table
      .select(row => ({
        checkin_date: row.checkin_date,
        rating: row.rating,
        name: row.first_name,
        day: row.day_of_checkin,
        challenge_period: row.challenge_period,
        checkin_weight: row.checkin_weight,
        goal_weight: row.goal_weight,
        weight_lost: row.lost_weight,
        percent_of_goal: math.round((row.lost_weight / (row.start_weight - row.goal_weight)) * 100, 1) + "%",
        schedule: row.schedule,
        fast_or_eat: row.fast_or_eat_day,
        calories_eaten: row.calories_eaten,
        calorie_goal: row.tdee,
        calories_burned: row.calories_burned,
        start_date: row.start_date,
        email: row.email,
        daily_notes_for_day_of_checkin: row.notes,
      }))
      .orderBy(column => column.rating)
    const filteredTable = checkinInfoColumnOrder
      .where(row => this.checkDate(this.state.startDate, row.checkin_date) && this.checkEmail(this.state.email, row.email));

    const convertedCheckInDatesSeries = filteredTable.getSeries("checkin_date").select(value => value.format("dddd, MM/DD/YYYY"));
    const convertedStartDatesSeries = filteredTable.getSeries("start_date").select(value => value.format("dddd, MM/DD/YYYY"));
    var newDf = filteredTable.withSeries('checkin_date', convertedCheckInDatesSeries)
    newDf = newDf.withSeries('start_date', convertedStartDatesSeries)
    return(
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Checkin Info"
          cardSubtitle="Filter Checkin Info by Date and/or Email"
          cardAction={
            <Grid
              container
              alignItems={'flex-end'}
              direction={'column'}
            >
              <ItemGrid xs={3} sm={12} md={12}>
                <CustomInput
                  labelText="Search for an email"
                  id="username"
                  formControlProps={{
                    fullWidth: true
                  }}
                  handleChange={this.handleEmailChange}
                />
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={12}>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleDateChange}
                  className="date-input"
                />
              </ItemGrid>
            </Grid>
          }
          content={
            <Table
              tableHeaderColor="primary"
              tableHead={newDf.getColumnNames()}
              tableData={newDf.toRows()}
            />
          }
        />
      </ItemGrid>
    );
  }
}

export default CheckinInfoTable;
