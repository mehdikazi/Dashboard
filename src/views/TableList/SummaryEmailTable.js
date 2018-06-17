import React from "react";
import { Grid } from "material-ui";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RegularCard, Table, ItemGrid, CustomInput,} from "../../components";
import customInputStyle from "../../assets/jss/material-dashboard-react/customInputStyle";
import * as math from 'mathjs';

class SummaryEmailTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ItemGrid xs={12} sm={12} md={12}>
        <RegularCard
          cardTitle="Summary Email"
          cardSubtitle="Table for exporting info for weekly summary emails"
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
              tableHeaderColor="success"
              tableHead={newDf.getColumnNames()}
              tableData={newDf.toRows()}
            />
          }
        />
      </ItemGrid>
    );
  }
}

export default SummaryEmailTable;
