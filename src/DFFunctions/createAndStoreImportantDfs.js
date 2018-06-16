import moment from 'moment';
import { readFile, Series, DataFrame } from 'data-forge';
import cleanQuestionnaireDF from './cleanQuestionnaireDF.js';
import cleanCheckInDF from './cleanCheckInDF.js';
import createAndGetDemographicsDF from './createAndGetDemographicsDF.js';
import createAndGetJoinedActiveUsersAndCheckinDF from './createAndGetJoinedActiveUsersAndCheckinDF.js';

function createAndStoreImportantDfs() {
  const cleanedQd = cleanQuestionnaireDF();
  const cleanedCid = cleanCheckInDF();

  const demographicsTable = createAndGetDemographicsDF(cleanedQd);
  const genderTable = cleanedQd
    .groupBy(row => row.gender)
    .select(group => ({
      gender: group.first().gender,
      count: group.deflate(row => row.gender).count()
    }))
    .inflate()
    .where(row => row.gender != 'Not listed')
    .orderBy(row => row.gender);
  const challengePeriodTable = cleanedQd
    .groupBy(row => row.challenge_period_text)
    .select(group => ({
      challenge_period_text: group.first().challenge_period_text,
      count: group.deflate(row => row.challenge_period_text).count()
    }))
    .inflate()
    .orderByDescending(column => column.count);
  const scheduleTable = cleanedQd
    .groupBy(row => row.schedule)
    .select(group => ({
      schedule: group.first().schedule,
      count: group.deflate(row => row.schedule).count()
    }))
    .inflate()
    .orderBy(column => column.count);
  const joinedQdCid = joinQDAndCID(cleanedQd, cleanedCid);

  window.demographics_table = demographicsTable;
  window.gender_table = genderTable;
  window.challenge_period_table = challengePeriodTable;
  window.schedule_table = scheduleTable;
  window.joined_qd_cid = joinedQdCid;
  window.joined_active_users_with_checkin_table = createAndGetJoinedActiveUsersAndCheckinDF(cleanedQd, cleanedCid);
}


function transform_schedule(value) {
  if (value == "16/8 || Fast 16 hours, Eat within 8 hour window daily") {
    return "16/8";
  } else if (value == "20/4 || Fast 20 hours, Eat within 4 hour window daily") {
    return "20/4";
  } else if (value == "4:3 || Eat 4 days, Fast 3 days every week") {
    return "4:3";
  } else if (value == "5:2 || Eat 5 days, Fast 2 days every week") {
    return "5:2";
  } else if (value == "6:1 & 16/8 ") {
    return "6:1";
  } else {
    return "Na";
  }
}

function joinQDAndCID(cleanedQd, cleanedCid) {
  const joinedDf = cleanedQd.join(
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
        start_date: left.start_date,
        start_weight: left.start_weight,
      }
    }
  );
  return joinedDf;
}

export default createAndStoreImportantDfs;
