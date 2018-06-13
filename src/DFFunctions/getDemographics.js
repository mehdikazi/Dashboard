import moment from 'moment';
import { readFile, Series, DataFrame } from 'data-forge';;

function getDemographics() {
  const age_series = window.qd.getSeries("age")
  const new_age_series = age_series.select(value => transform_number(value))
  var new_df = window.qd.withSeries("age", new_age_series);
  const average_age = new_df.getSeries('age').average();

  const new_if_series = new_df.getSeries("is_new_to_if");
  const new_new_if_series = new_if_series.select(value => transform_boolean(value));
  const percent_new_if = new_new_if_series.sum() / new_new_if_series.count();

  const current_weight_series = new_df.getSeries("start_weight");
  const goal_weight_series = new_df.getSeries("goal_weight");
  new_df = new_df.withSeries("start_weight", current_weight_series);
  new_df = new_df.withSeries("goal_weight", goal_weight_series);
  const average_expected_loss = new_df
    .select(row => ({
      difference: row.start_weight - row.goal_weight
    }))
    .getSeries('difference')
    .average();
  const median_expected_loss = new_df
    .select(row => ({
      difference: row.start_weight - row.goal_weight
    }))
    .getSeries('difference')
    .median();

  const new_challenge_period_series = new_df
    .getSeries("challenge_period")
    .select(value => transform_challenge_period(value))
  const new_start_date_series = new_df
    .getSeries("start_date")
    .select(value => transform_date(value))
  new_df = new_df.withSeries("challenge_period", new_challenge_period_series);
  new_df = new_df.withSeries("start_date", new_start_date_series);
  const number_active_users = new_df
    .select(row => ({
      is_active: calculate_is_active(row.start_date, row.challenge_period)
    }))
    .getSeries('is_active')
    .sum()

  const demographics_table = new DataFrame([
    {
      Average_Age: Math.round(average_age),
      Percent_New_To_IF: (Math.round(percent_new_if*100) / 100) * 100,
      Average_Expected_Loss: Math.round(average_expected_loss),
      Median_Expected_Loss: Math.round(median_expected_loss),
      number_active_users: number_active_users,
    }
  ])

  const acitive_user_table = new_df
    .where(row => calculate_is_active(row.start_date, row.challenge_period) == 1)
    .setIndex("email")
    .select(row => ({
      first_name: row.first_name,
      last_name: row.last_name,
      schedule: row.schedule,
      day_number: moment().diff(row.start_date, 'days') + 1,
      challenge_period: row.challenge_period
    }))
    .orderBy(column => column.day_number)

  const challenge_period_table = window.qd
      .groupBy(row => row.challenge_period)
      .select(group => ({
        challenge_period: group.first().challenge_period,
        count: group.deflate(row => row.challenge_period).count()
      }))
      .inflate();

  const challenge_period_table_updated = challenge_period_table
    .select(row => ({
      labels: String(row.count),
      series: row.count,
    }))
    .withSeries('labels', challenge_period_table.getSeries("challenge_period").select(value => transform_challenge_period_to_text(value)))
    .orderByDescending(column => column.series);

  const gender_table = window.qd
    .groupBy(row => row.gender)
    .select(group => ({
      gender: group.first().gender,
      count: group.deflate(row => row.gender).count()
    }))
    .inflate()
    .where(row => row.gender != 'Not listed')
    .orderBy(row => row.gender);

  const schedule_table = window.qd
    .groupBy(row => row.schedule)
    .select(group => ({
      schedule: group.first().schedule,
      count: group.deflate(row => row.schedule).count()
    }))
    .inflate()
    .orderBy(column => column.schedule);

  const schedule_table_updated = schedule_table
    .select(row => ({
      labels: String(row.count),
      series: row.count
    }))
    .withSeries('labels', schedule_table.getSeries("schedule").select(value => transform_schedule(value)))
    .orderBy(column => column.series);

  const activeUserDf = calculateActiveUsers();
  const joinedDf = joinActiveUserAndCheckin(activeUserDf);
  const cleanedDf = cleanDf(joinedDf);
  const addDayNumberForCheckinDf = addDayNumberForCheckin(cleanedDf);
  const finalDf = addDayNumberForCheckinDf
    .select(row => ({
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      check_in_date: row.check_in_date.format("dddd, MMMM Do YYYY"),
      day_of_checkin: row.day_of_checkin,
      current_day_in_challenge: row.day_of_challenge,
      weight: row.weight_on_day,
      rating: row.rating,
      calories_eaten: row.calories_eaten,
      goal_weight: row.goal_weight,
      challenge_period: row.challenge_period,
      schedule: row.schedule,
      start_date: row.start_date.format("dddd, MMMM Do YYYY"),
    }));

  window.demographics_table = demographics_table;
  window.acitive_user_table = acitive_user_table;
  window.challenge_period_table = challenge_period_table_updated;
  window.gender_table = gender_table;
  window.schedule_table = schedule_table_updated;
  window.final_joined_table = finalDf;
  window.day_number_for_checkins = addDayNumberForCheckinDf;
}

function transform_number(value) {
  if (value != "Nan") {
    return Number(value);
  } else {
    return 0;
  }
}

function transform_calories_eaten(value) {
  if (value != "Nan") {
    return Number(value);
  } else {
    return "missing";
  }
}

function transform_boolean(value) {
  if (value) {
    return 1;
  } else {
    return 0;
  }
}

function transform_challenge_period(value) {
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

function transform_challenge_period_to_text(value) {
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
  } else {
    return "Not recorded";
  }
}

function transform_date(value) {
  if (!value) {
    return moment("1997-10-06");
  } else {
    return moment(value + " 2018");
  }
}

function transform_checkin_date(value) {
  if (!value) {
    return moment("1997-10-06");
  } else {
    return moment(value);
  }
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

function calculate_is_active(start_date, challenge_period) {
  if (moment().diff(start_date, 'days') + 1 <= challenge_period && moment().diff(start_date, 'days') + 1 > 0) {
    return 1;
  } else {
    return 0;
  }
}

function calculateActiveUsers() {
  const new_challenge_period_series = window.qd
    .getSeries("challenge_period")
    .select(value => transform_challenge_period(value))
  const new_start_date_series = window.qd
    .getSeries("start_date")
    .select(value => transform_date(value))
  var new_df = window.qd.withSeries("challenge_period", new_challenge_period_series);
  new_df = window.qd.withSeries("start_date", new_start_date_series);

  const acitive_user_table = new_df
    .where(row => calculate_is_active(row.start_date, row.challenge_period) == 1)
    .select(row => ({
      email: row.email,
      first_name: row.first_name,
      last_name: row.last_name,
      schedule: row.schedule,
      day_number: moment().diff(row.start_date, 'days') + 1,
      challenge_period: row.challenge_period,
      start_date: row.start_date,
    }))

  return acitive_user_table;
}

function joinActiveUserAndCheckin(activeUserDf) {
  const joinedDf = activeUserDf.join(
    window.cid,
    left => left.email,
    right => right.email,
    (left, right) => {
      return {
        email: left.email,
        first_name: left.first_name,
        last_name: left.last_name,
        check_in_date: right.date,
        weight_on_day: right.weight,
        goal_weight: right.goal,
        rating: right.rating,
        schedule: left.schedule,
        challenge_period: left.challenge_period,
        calories_eaten: right.calories_eaten,
        day_of_challenge: left.day_number,
        start_date: left.start_date,
      }
    }
  );
  return joinedDf;
}

function cleanDf(df) {
  const new_checkin_series = df
    .getSeries("check_in_date")
    .select(value => transform_checkin_date(value));

  const new_weight_series = df
    .getSeries("weight_on_day")
    .select(value => transform_number(value));

  const new_goal_weight_series = df
    .getSeries("goal_weight")
    .select(value => transform_number(value));

  const new_calories_eaten_series = df
    .getSeries("calories_eaten")
    .select(value => transform_calories_eaten(value))

  var new_df = df.withSeries("check_in_date", new_checkin_series);
  new_df = new_df.withSeries("weight_on_day", new_weight_series);
  new_df = new_df.withSeries("goal_weight", new_goal_weight_series);
  new_df = new_df.withSeries("calories_eaten", new_calories_eaten_series);

  return new_df

}

function addDayNumberForCheckin(df) {
  const new_series = df
    .select(row => ({
      day_of_checkin: row.check_in_date.diff(row.start_date, 'days') + 1
    }))
    .deflate(row => row.day_of_checkin);

  const new_df = df
    .withSeries("day_of_checkin", new_series);

  return new_df;
}

export default getDemographics;
