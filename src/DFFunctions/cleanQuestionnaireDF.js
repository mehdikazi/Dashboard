import moment from 'moment';
import { readFile, Series, DataFrame } from 'data-forge';

function cleanQuestionnaireDF() {
  const qd = window.qd;
  const deletedRowsDf = qd
    .select(row => ({
      first_name: row.first_name,
      last_name: row.last_name,
      gender: row.gender,
      activity_level: row.activity_level,
      schedule_4_3: row.schedule_4_3,
      time_4_3: row.time_4_3,
      schedule_5_2: row.schedule_5_2,
      time_5_2: row.time_5_2,
      time_20_4: row.time_20_4,
      time_16_8: row.time_16_8,
      email: row.email,
      city_state: row.city_state,
      country: row.country,
      introduction: row.introduction,
      age: row.age,
      is_new_to_if: row.is_new_to_if,
      is_wl_goal: row.is_wl_goal,
      goal_weight: row.goal_weight,
      start_weight: row.start_weight,
      height: row.height,
      schedule: row.schedule,
      start_date: row.start_date,
      challenge_period: row.challenge_period,
      challenge_period_text: row.challenge_period,
    }));

  const cleanedQd = deletedRowsDf
    .transformSeries({
      age: value => transformNumber(value),
      is_new_to_if: value => transformBoolean(value),
      is_wl_goal: value => transformYesNo(value),
      goal_weight: value => transformNumber(value),
      start_weight: value => transformNumber(value),
      height: value => transformNumber(value),
      schedule: value => transformSchedule(value),
      start_date: value => transformDate(value),
      challenge_period: value => transformChallengePeriod(value),
      challenge_period_text: value => transformChallengePeriodToText(value)
    });
  return cleanedQd
}

function transformNumber(value) {
  if (value != "Nan") {
    return Number(value);
  } else {
    return 0;
  }
}

function transformBoolean(value) {
  if (value) {
    return 1;
  } else {
    return 0;
  }
}

function transformYesNo(value) {
  if (value == "Yes!") {
    return 1;
  } else {
    return 0;
  }
}

function transformSchedule(value) {
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

function transformDate(value) {
  if (!value) {
    return moment("1997-10-06");
  } else {
    return moment(value + " 2018");
  }
}

function transformChallengePeriod(value) {
  if (value == 31) {
    return 30;
  } else if (value == 61) {
    return 60;
  } else if (value == 91) {
    return 90;
  } else if (!value) {
    return 30;
  } else {
    return Number(value);
  }
}

function transformChallengePeriodToText(value) {
  if (value == 30) {
    return "30 Days";
  } else if (value == 31) {
    return "30 Days + 1:1";
  } else if (value == 61) {
    return "60 Days + 1:1";
  } else if (value == 90) {
    return "90 Days";
  } else if (value == 91) {
    return "90 Days + 1:1";
  } else if (value) {
    return value.toString() + 'Days';
  } else {
    return "Not recorded";
  }
}

export default cleanQuestionnaireDF;
