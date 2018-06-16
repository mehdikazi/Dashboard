import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";

class OneStarRatingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfOnes: 1,
      numberOfOnesDate: moment(),
    }
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

  checkDateAndAfter = (checkInDate, startDate) => {
    return checkInDate.isSameOrAfter(startDate, 'day');
  }

  render() {
    const numberOfOnes = window.joined_active_users_with_checkin_table
      .where(row => row.rating == 1 && this.checkDateAndAfter(row.checkin_date, this.state.numberOfOnesDate));

    const filterNumberOfOnes = numberOfOnes
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        number_of_one_stars: group.deflate(row => row.rating).count()
      }))
      .inflate()
      .where(row => row.number_of_one_stars >= this.state.numberOfOnes);

    return (
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
    );
  }
}

export default OneStarRatingTable;
