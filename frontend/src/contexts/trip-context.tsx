"use client";

import {
  setActivitiesAction,
  setLinksAction,
  setParticipantsAction,
  setTripDetailsAction,
} from "@/reducers/trip/actions";
import { tripReducer, TripState } from "@/reducers/trip/reducer";
import { insertSortedActivity } from "@/utils/insertSortedActivity";
import { isSameDay } from "date-fns";
import { ReactNode, createContext, useContext, useReducer } from "react";

interface TripContextType extends TripState {
  updateTripDetails: (
    destination: string,
    starts_at: Date,
    ends_at: Date,
  ) => void;
  addParticipant: (id: string, name: string, email: string) => void;
  removeParticipant: (id: string) => void;
  addLink: (id: string, title: string, url: string) => void;
  removeLink: (id: string) => void;
  addActivity: (id: string, title: string, dateTime: Date) => void;
}

const TripContext = createContext({} as TripContextType);

interface TripProviderProps {
  children: ReactNode;
  initialValue: TripState;
}
export function TripProvider(props: TripProviderProps) {
  const { children, initialValue } = props;
  const [tripState, dispatch] = useReducer(tripReducer, initialValue);
  const { trip, participants, activities, links } =
    tripState as TripContextType;

  const updateTripDetails = (
    destination: string,
    starts_at: Date,
    ends_at: Date,
  ) => {
    dispatch(setTripDetailsAction(destination, starts_at, ends_at));
  };

  const addParticipant = (id: string, name: string, email: string) => {
    const updatedParticipants = participants.concat({
      id,
      name,
      email,
      is_confirmed: false,
    });
    dispatch(setParticipantsAction(updatedParticipants));
  };

  const removeParticipant = (id: string) => {
    const updatedParticipants = participants.filter(
      (participant) => participant.id !== id,
    );
    dispatch(setParticipantsAction(updatedParticipants));
  };

  const addLink = (id: string, title: string, url: string) => {
    const updatedLinks = links.concat({ id, title, url });
    dispatch(setLinksAction(updatedLinks));
  };

  const removeLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    dispatch(setLinksAction(updatedLinks));
  };

  const addActivity = (id: string, title: string, dateTime: Date) => {
    const updatedActivities = activities.map((activitiesInDate) => {
      if (isSameDay(dateTime, activitiesInDate.date)) {
        const newActivitiesArray = insertSortedActivity(
          activitiesInDate.activities,
          { id, title, occurs_at: dateTime, trip_id: trip.id },
        );
        return {
          ...activitiesInDate,
          activities: newActivitiesArray,
        };
      }
      return activitiesInDate;
    });
    dispatch(setActivitiesAction(updatedActivities));
  };

  const value = {
    trip,
    activities,
    participants,
    links,
    addParticipant,
    removeParticipant,
    addLink,
    removeLink,
    addActivity,
    updateTripDetails,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export const useTrip = () => {
  const context = useContext(TripContext);

  if (context === undefined) {
    throw new Error("useTrip must be used within TripContext");
  }

  return context;
};
