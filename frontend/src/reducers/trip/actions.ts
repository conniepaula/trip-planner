import { Action } from "../types";

export enum TripActionTypes {
  SET_TRIP_DETAILS = "SET_TRIP_DETAILS",
  SET_PARTICIPANTS = "SET_PARTICIPANTS",
  SET_ACTIVITIES = "SET_ACTIVITIES",
  SET_LINKS = "SET_LINKS",
}

export type TripAction = Action<TripActionTypes>;

export function setTripDetailsAction(
  destination: string,
  starts_at: Date,
  ends_at: Date,
) {
  return {
    type: TripActionTypes.SET_TRIP_DETAILS,
    payload: { destination, starts_at, ends_at },
  };
}

export function setParticipantsAction(participants: Array<Participant>) {
  return {
    type: TripActionTypes.SET_PARTICIPANTS,
    payload: participants,
  };
}
export function setActivitiesAction(activities: Array<ActivitiesInDate>) {
  return {
    type: TripActionTypes.SET_ACTIVITIES,
    payload: activities,
  };
}
export function setLinksAction(links: Array<Link>) {
  return {
    type: TripActionTypes.SET_LINKS,
    payload: links,
  };
}
