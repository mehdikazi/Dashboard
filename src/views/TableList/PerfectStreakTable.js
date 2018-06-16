import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";

class PerfectStreakTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const perfectStreak = window.joined_active_users_with_checkin_table
      .groupBy(row => row.email)
      .select(group => ({
        email: group.first().email,
        start_date: group.first().start_date,
        number_of_check_ins: group.deflate(row => row.checkin_date).count(),
      }))
      .inflate()
      .where(row => row.number_of_check_ins == (moment().diff(row.start_date, 'days') + 1))
      .select(row => ({
        email: row.email,
        start_date: row.start_date.format("dddd, MMMM Do YYYY"),
        number_of_check_ins: row.number_of_check_ins
      }));
      
    return (
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
    );
  }
}

export default PerfectStreakTable;
