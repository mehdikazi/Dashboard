import moment from 'moment';
import { readFile, Series, DataFrame } from 'data-forge';

function cleanCheckInDF() {
  const cid = window.cid;
  const removedColumnsDf = cid
    .select(row => ({
      fast_or_eat_day: row.fast_or_eat,
      notes: row.notes,
      email: row.email,
      checkin_date: row.date,
      checkin_weight: row.weight,
      calories_eaten: row.calories_eaten,
      rating: row.rating,
      tdee: row.tdee,
      goal_weight: row.goal
    }));

  const cleanedCid = removedColumnsDf
    .transformSeries({
      checkin_date: value => transformDate(value),
      checkin_weight: value => transformNumber(value),
      calories_eaten: value => transformCaloriesEaten(value),
      rating: value => transformNumber(value),
      tdee: value => transformNumber(value),
      goal_weight: value => transformNumber(value)
    });

  console.log(cleanedCid.toString());

  return cleanedCid;
}

function transformNumber(value) {
  if (value != "Nan") {
    return Number(value);
  } else {
    return 0;
  }
}

function transformDate(value) {
  if (!value) {
    return moment("1997-10-06");
  } else {
    console.log(value);
    return moment(value);
  }
}

function transformCaloriesEaten(value) {
  if (value != "Nan") {
    return Number(value);
  } else {
    return "missing"
  }
}


export default cleanCheckInDF;
