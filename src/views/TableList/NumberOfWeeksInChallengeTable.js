import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";

class NumberOfWeeksInChallengeTable extends React.Component {
  constructor(props){
    super(props);
  }

  calculateIsActive = (startDate, challengePeriod) => {
    if (moment().diff(startDate, 'days') + 1 <= challengePeriod && moment().diff(startDate, 'days') + 1 > 0) {
      return 1;
    } else {
      return 0;
    }
  }

  render() {
    const acitive_user_table = window.cleaned_qd
      .where(row => this.calculateIsActive(row.start_date, row.challenge_period) == 1)
      .select(row => ({
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        schedule: row.schedule,
        day_number: moment().diff(row.start_date, 'days') + 1,
        challenge_period: row.challenge_period,
        start_date: row.start_date,
        start_weight: row.start_weight,
      }))

    const numberOfWeeks = acitive_user_table
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_date: group.first().start_date.format("dddd, MMMM Do YYYY"),
        number_of_weeks_in_challenge: moment().diff(group.first().start_date, 'weeks'),
      }))
      .inflate()
      .orderBy(column => column.number_of_weeks_in_challenge);

    return (
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Number of Weeks in Challenge"
          cardSubtitle="Number of weeks an active user is in their challenge"
          headerColor={"green"}
          content={
            <Table
              tableHeaderColor="success"
              tableHead={numberOfWeeks.getColumnNames()}
              tableData={numberOfWeeks.toRows()}
            />
          }
        />
      </ItemGrid>
    );
  }
}

export default NumberOfWeeksInChallengeTable;
