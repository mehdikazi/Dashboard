import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";

class NumberOfCheckinsBetweenTwoDatesTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dateRangeStart: moment(),
      dateRangeEnd:moment().add(7, 'd'),
    }
  }

  checkBetweenDates = (checkInDate) => {
    if (checkInDate.isSameOrAfter(this.state.dateRangeStart, 'day') && checkInDate.isSameOrBefore(this.state.dateRangeEnd, 'day')) {
      return true;
    }
  }

  handleDateRangeStart = (date) => {
    this.setState({
      dateRangeStart: date
    })
  }

  handleDateRangeEnd = (date) => {
    this.setState({
      dateRangeEnd: date,
    })
  }

  render() {
    const betweenDates = window.joined_active_users_with_checkin_table
      .where(row => this.checkBetweenDates(row.checkin_date));

    const countCheckIns = betweenDates
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_check_ins: group.deflate(row => row.checkin_date).count(),
      }))
      .inflate();

    return (
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Number of Checkins Between Two Dates"
          cardSubtitle="Number of checkins an active user has completed in a date range"
          headerColor={"blue"}
          cardAction={
            <Grid
              container
              alignItems={'flex-end'}
              direction={'column'}
            >
              <ItemGrid xs={3} sm={12} md={12}>
              <DatePicker
                selected={this.state.dateRangeStart}
                selectsStart
                startDate={this.state.dateRangeStart}
                endDate={this.state.handleDateRangeEnd}
                onChange={this.handleDateRangeStart}
                className="date-input"
              />
              </ItemGrid>
              <ItemGrid xs={12} sm={12} md={12}>
                <DatePicker
                  selected={this.state.dateRangeEnd}
                  selectsEnd
                  startDate={this.state.dateRangeStart}
                  endDate={this.state.handleDateRangeEnd}
                  onChange={this.handleDateRangeEnd}
                  className="date-input"
                />
              </ItemGrid>
            </Grid>
          }
          content={
            <Table
              tableHeaderColor="info"
              tableHead={countCheckIns.getColumnNames()}
              tableData={countCheckIns.toRows()}
            />
          }
        />
      </ItemGrid>
    );
  }
}

export default NumberOfCheckinsBetweenTwoDatesTable;
