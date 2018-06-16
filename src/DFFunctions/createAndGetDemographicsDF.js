import moment from 'moment';
import { readFile, Series, DataFrame } from 'data-forge';

function createAndGetDemographicsDF(cleanedQd) {
  const average_age = cleanedQd.getSeries('age').average();
  const percent_new_if = cleanedQd.getSeries('is_new_to_if').sum() / cleanedQd.getSeries('is_new_to_if').count();
  const average_expected_loss = cleanedQd
    .select(row => ({
      difference: row.start_weight - row.goal_weight
    }))
    .getSeries('difference')
    .average();
  const median_expected_loss = cleanedQd
    .select(row => ({
      difference: row.start_weight - row.goal_weight
    }))
    .getSeries('difference')
    .median();
  const number_active_users = cleanedQd
    .select(row => ({
      is_active: calculateIsActive(row.start_date, row.challenge_period)
    }))
    .getSeries('is_active')
    .sum();
  const demographicsTable = new DataFrame([
    {
      Average_Age: Math.round(average_age),
      Percent_New_To_IF: (Math.round(percent_new_if*100) / 100) * 100,
      Average_Expected_Loss: Math.round(average_expected_loss),
      Median_Expected_Loss: Math.round(median_expected_loss),
      number_active_users: number_active_users,
    }
  ]);

  return demographicsTable;
}

function calculateIsActive(startDate, challengePeriod) {
  if (moment().diff(startDate, 'days') + 1 <= challengePeriod && moment().diff(startDate, 'days') + 1 > 0) {
    return 1;
  } else {
    return 0;
  }
}

export default createAndGetDemographicsDF;
