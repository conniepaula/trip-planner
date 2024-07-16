interface Trip {
  id: string;
  is_confirmed: boolean;
  destination: string;
  starts_at: Date;
  ends_at: Date;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  is_confirmed: boolean;
}

interface Link {
  id: string;
  title: string;
  url: string;
}

interface Activity {
  id: string;
  title: string;
  occurs_at: Date;
  trip_id: string;
}

interface ActivitiesInDate {
  date: Date;
  activities: Array<Activity>;
}
