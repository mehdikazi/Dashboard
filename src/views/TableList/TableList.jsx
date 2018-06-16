import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";
import CheckinInfoTable from './CheckinInfoTable';
import NumberOfWeeksInChallengeTable from "./NumberOfWeeksInChallengeTable";
import NumberOfCheckinsBetweenTwoDatesTable from "./NumberOfCheckinsBetweenTwoDatesTable";
import HasntCheckedInTable from "./HasntCheckedInTable";
import PerfectStreakTable from "./PerfectStreakTable";
import OneStarRatingTable from "./OneStarRatingTable";

class TableList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Grid container>
          <CheckinInfoTable />
          <NumberOfWeeksInChallengeTable />
          <NumberOfCheckinsBetweenTwoDatesTable />
          <HasntCheckedInTable />
          <PerfectStreakTable />
          <OneStarRatingTable />
        </Grid>
      </div>
    );
  }
}

export default TableList;
