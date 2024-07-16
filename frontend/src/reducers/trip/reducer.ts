import { TripAction, TripActionTypes } from "./actions";

export interface TripState {
  trip: Trip;
  activities: Array<ActivitiesInDate>;
  participants: Array<Participant>;
  links: Array<Link>;
}

export function tripReducer(state: TripState, action: TripAction) {
  switch (action.type) {
    case TripActionTypes.SET_ACTIVITIES:
      return { ...state, activities: action.payload };
    case TripActionTypes.SET_PARTICIPANTS:
      return { ...state, participants: action.payload };
    case TripActionTypes.SET_LINKS:
      return { ...state, links: action.payload };
    case TripActionTypes.SET_TRIP_DETAILS:
      return { ...state, trip: action.payload };

    default:
      throw new Error();
  }
}
