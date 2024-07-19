import { isBefore } from "date-fns";

export function insertSortedActivity(
  array: Array<Activity>,
  newActivity: Activity,
) {
  let left = 0;
  let right = array.length - 1;
  let mid: number;

  //   Perform binary search
  while (left <= right) {
    mid = Math.floor((left + right) / 2);
    if (isBefore(newActivity.occurs_at, array[mid].occurs_at)) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  array.splice(left, 0, newActivity);
  console.log(array);
  return array;
}
