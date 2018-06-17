import moment from 'moment';
import { readFile, Series, DataFrame } from 'data-forge';

function createAndGetJoinedActiveUsersAndCheckinDF(cleanedQd, cleanedCid) {
  const acitive_user_table = cleanedQd
    .where(row => calculateIsActive(row.start_date, row.challenge_period) == 1)
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

  const joinedDf = acitive_user_table.join(
    cleanedCid,
    left => left.email,
    right => right.email,
    (left, right) => {
      return {
        email: left.email,
        first_name: left.first_name,
        last_name: left.last_name,
        checkin_date: right.checkin_date,
        checkin_weight: right.checkin_weight,
        goal_weight: right.goal_weight,
        rating: right.rating,
        schedule: left.schedule,
        challenge_period: left.challenge_period,
        calories_eaten: right.calories_eaten,
        day_of_challenge: left.day_number,
        start_date: left.start_date,
        start_weight: left.start_weight,
        lost_weight: (Math.round((left.start_weight - right.checkin_weight) * 10) / 10),
      }
    }
  );

  const new_series = joinedDf
    .select(row => ({
      day_of_checkin: row.checkin_date.diff(row.start_date, 'days') + 1
    }))
    .deflate(row => row.day_of_checkin);

  const new_df = joinedDf
    .withSeries("day_of_checkin", new_series);

  return new_df;
}

function calculateIsActive(startDate, challengePeriod) {
  if (moment().diff(startDate, 'days') + 1 <= challengePeriod && moment().diff(startDate, 'days') + 1 > 0) {
    return 1;
  } else {
    return 0;
  }
}

export default createAndGetJoinedActiveUsersAndCheckinDF;
