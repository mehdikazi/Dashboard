import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";

class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     startDate: moment().add(1, 'd'),
     emaill: '',
     dateRangeStart: moment(),
     dateRangeEnd:moment().add(7, 'd'),
     dateAndAfterStart: moment().add(1, 'd'),
     numberOfCheckins: 1,
     numberOfOnes: 1,
     numberOfOnesDate: moment(),
   };
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

  checkDate = (startDate, checkInDate) => {
    if (startDate.isSame(moment().add(1, 'd'), 'day')) {
      return true;
    }
    console.log(typeof(checkInDate));
    return startDate.isSame(moment(checkInDate), 'day');
  }

  checkEmail = (inputEmail, tableEmail) => {
    if (inputEmail == '' || !inputEmail) {
      return true;
    }
    return tableEmail.startsWith(inputEmail);
  }

  checkBetweenDates = (checkInDate) => {
    if (checkInDate.isSameOrAfter(this.state.dateRangeStart, 'day') && checkInDate.isSameOrBefore(this.state.dateRangeEnd, 'day')) {
      return true;
    }
  }

  checkDateAndAfter = (checkInDate, startDate) => {
    return checkInDate.isSameOrAfter(startDate, 'day');
  }

  handledateAndAfter = (date) => {
    this.setState({
      dateAndAfterStart: date,
    });
  }

  handleNumberOfCheckinsChange = (event) => {
    this.setState({
      numberOfCheckins: event.target.value,
    })
  }

  handleNumberOfOnesDateChange = (date) => {
    this.setState({
      numberOfOnesDate: date
    });
  }

  handleNumberOfOnesChange = (event) => {
    this.setState({
      numberOfOnes: event.target.value,
    })
  }



  render() {
    const filteredTable = window.day_number_for_checkins
      .where(row => this.checkDate(this.state.startDate, row.check_in_date) && this.checkEmail(this.state.email, row.email));

    const convertedCheckInDatesSeries = filteredTable.getSeries("check_in_date").select(value => value.format("dddd, MMMM Do YYYY"))
    const convertedStartDatesSeries = filteredTable.getSeries("start_date").select(value => value.format("dddd, MMMM Do YYYY"))
    var newDf = filteredTable.withSeries('check_in_date', convertedCheckInDatesSeries)
    newDf = newDf.withSeries('start_date', convertedStartDatesSeries)

    const numberOfWeeks = window.day_number_for_checkins
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_date: group.first().start_date.format("dddd, MMMM Do YYYY"),
        number_of_weeks_in_challenge: moment().diff(group.first().start_date, 'weeks'),
      }))
      .inflate()
      .orderBy(column => column.number_of_weeks_in_challenge);

    const betweenDates = window.day_number_for_checkins
      .where(row => this.checkBetweenDates(row.check_in_date));

    const countCheckIns = betweenDates
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_check_ins: group.deflate(row => row.check_in_date).count(),
      }))
      .inflate();

    const dateAndAfter = window.day_number_for_checkins
      .where(row => this.checkDateAndAfter(row.check_in_date, this.state.dateAndAfterStart));

    const countCheckInsDateAndAfter = dateAndAfter
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_check_ins: group.deflate(row => row.check_in_date).count(),
      }))
      .inflate()
      .where(row => row.number_of_check_ins <= this.state.numberOfCheckins);

    const perfectStreak = window.day_number_for_checkins
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_date: group.first().start_date,
        number_of_check_ins: group.deflate(row => row.check_in_date).count(),
      }))
      .inflate()
      .where(row => row.number_of_check_ins == (moment().diff(row.start_date, 'days') + 1))
      .select(row => ({
        email: row.email,
        start_date: row.start_date.format("dddd, MMMM Do YYYY"),
        number_of_check_ins: row.number_of_check_ins
      }));

    const numberOfOnes = window.day_number_for_checkins
      .where(row => row.rating == 1 && this.checkDateAndAfter(row.check_in_date, this.state.numberOfOnesDate));

    const filterNumberOfOnes = numberOfOnes
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_one_stars: group.deflate(row => row.rating).count()
      }))
      .inflate()
      .where(row => row.number_of_one_stars >= this.state.numberOfOnes);



    return (
      <div>
        <Grid container>
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
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="Hasnt Checked In"
              cardSubtitle="Users who havent checked in at least X times since Y date"
              headerColor={"red"}
              cardAction={
                <Grid
                  container
                  alignItems={'flex-end'}
                  direction={'column'}
                >
                  <ItemGrid xs={3} sm={12} md={12}>
                    <CustomInput
                      labelText="# of checkins"
                      id="checkins"
                      formControlProps={{
                        fullWidth: true
                      }}
                      handleChange={this.handleNumberOfCheckinsChange}
                    />
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={12}>
                    <DatePicker
                      selected={this.state.dateAndAfterStart}
                      onChange={this.handledateAndAfter}
                      className="date-input"
                    />
                  </ItemGrid>
                </Grid>
              }
              content={
                <Table
                  tableHeaderColor="rose"
                  tableHead={countCheckInsDateAndAfter.getColumnNames()}
                  tableData={countCheckInsDateAndAfter.toRows()}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="Perfect Streaks"
              cardSubtitle="Users with perfect checkin streaks"
              headerColor={"orange"}
              content={
                <Table
                  tableHeaderColor="warning"
                  tableHead={perfectStreak.getColumnNames()}
                  tableData={perfectStreak.toRows()}
                />
              }
            />
          </ItemGrid>
          <ItemGrid xs={12} sm={12} md={12}>
            <RegularCard
              cardTitle="Feeling 1 Star"
              cardSubtitle="Users who have had at least X 1 star ratings since Y date"
              cardAction={
                <Grid
                  container
                  alignItems={'flex-end'}
                  direction={'column'}
                >
                  <ItemGrid xs={3} sm={12} md={12}>
                    <CustomInput
                      labelText="# of 1's"
                      id="numberOfOnes"
                      formControlProps={{
                        fullWidth: true
                      }}
                      handleChange={this.handleNumberOfOnesChange}
                    />
                  </ItemGrid>
                  <ItemGrid xs={12} sm={12} md={12}>
                    <DatePicker
                      selected={this.state.numberOfOnesDate}
                      onChange={this.handleNumberOfOnesDateChange}
                      className="date-input"
                    />
                  </ItemGrid>
                </Grid>
              }
              content={
                <Table
                  tableHeaderColor="primary"
                  tableHead={filterNumberOfOnes.getColumnNames()}
                  tableData={filterNumberOfOnes.toRows()}
                />
              }
            />
          </ItemGrid>
        </Grid>
      </div>
    );
  }
}

export default TableList;
