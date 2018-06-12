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

  render() {
    const filteredTable = window.day_number_for_checkins
      .where(row => this.checkDate(this.state.startDate, row.check_in_date) && this.checkEmail(this.state.email, row.email));

    const convertedCheckInDatesSeries = filteredTable.getSeries("check_in_date").select(value => value.format("dddd, MMMM Do YYYY"))
    const convertedStartDatesSeries = filteredTable.getSeries("start_date").select(value => value.format("dddd, MMMM Do YYYY"))
    var newDf = filteredTable.withSeries('check_in_date', convertedCheckInDatesSeries)
    newDf = newDf.withSeries('start_date', convertedStartDatesSeries)

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
        </Grid>
      </div>
    );
  }
}

// function TableList({ ...props }) {
//   return (
//     <Grid container>
//       <ItemGrid xs={12} sm={12} md={12}>
//         <RegularCard
//           cardTitle="Simple Table"
//           cardSubtitle="Here is a subtitle for this table"
//           content={
//             <Table
//               tableHeaderColor="primary"
//               tableHead={["Name", "Country", "City", "Salary"]}
//               tableData={[
//                 ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
//                 ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
//                 ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
//                 ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
//                 ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
//                 ["Mason Porter", "Chile", "Gloucester", "$78,615"]
//               ]}
//             />
//           }
//         />
//       </ItemGrid>
//     </Grid>
//   );
// }

export default TableList;
