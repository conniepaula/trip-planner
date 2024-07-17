import { format } from "date-fns";
import { MapPin } from "lucide-react";

interface ActivityCardProps {
  date: Date;
  activities: Array<Activity>;
}

export default function ActivityCard(props: ActivityCardProps) {
  const { date, activities } = props;

  return (
    <div key={String(date)} className="space-y-2.5">
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-semibold text-zinc-300">
          {format(date, "MMMM do")}
        </span>
        <span className="text-xs text-zinc-500">{format(date, "EEEE")}</span>
      </div>
      {activities.length > 0 ? (
        <div className="space-y-2.5">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5 shadow-sm"
            >
              <MapPin className="text-primary size-5" />
              <span>{activity.title}</span>
              <span className="ml-auto text-sm text-zinc-400">
                {format(activity.occurs_at, "k:mm")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No activities on this date.</p>
      )}
    </div>
  );
}
