import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";

class HasntCheckedInTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateAndAfterStart: moment().add(1, 'd'),
      numberOfCheckins: 1,
    }
  }

  handleNumberOfCheckinsChange = (event) => {
    this.setState({
      numberOfCheckins: event.target.value,
    })
  }

  handledateAndAfter = (date) => {
    this.setState({
      dateAndAfterStart: date,
    });
  }

  checkDateAndAfter = (checkInDate, startDate) => {
    return checkInDate.isSameOrAfter(startDate, 'day');
  }

  render() {
    const dateAndAfter = window.joined_active_users_with_checkin_table
      .where(row => this.checkDateAndAfter(row.checkin_date, this.state.dateAndAfterStart));

    const countCheckInsDateAndAfter = dateAndAfter
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_check_ins: group.deflate(row => row.checkin_date).count(),
      }))
      .inflate()
      .where(row => row.number_of_check_ins <= this.state.numberOfCheckins);

    return(
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
    );
  }
}

export default HasntCheckedInTable;
