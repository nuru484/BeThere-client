// src/components/event/EventDetails.jsx
import { Calendar, MapPin, Tag, Repeat, Clock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PropTypes from "prop-types";

const EventDetails = ({ event }) => {
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

  const formatTime = (time) => time || "Not specified";

  const formatRecurrenceInfo = () => {
    if (!event?.isRecurring) return null;

    const interval = event.recurrenceInterval || 1;
    const intervalText = interval === 1 ? "day" : `${interval} days`;

    return `Every ${intervalText}`;
  };

  if (!event) return null;

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6 sm:p-8">
        {/* Event Title and Type */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {event.title}
            </h1>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 px-3 py-1.5 font-medium w-fit"
            >
              <Tag className="w-3 h-3 mr-1.5" />
              {event.type}
            </Badge>
          </div>

          {event.description && (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Date & Time Section */}
          <div className="space-y-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  Date & Time
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start sm:items-center gap-2 text-sm">
                    <span className="font-medium text-gray-500 w-12 flex-shrink-0">
                      Start:
                    </span>
                    <span className="text-gray-900 break-words">
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm pl-14">
                    <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      {formatTime(event.startTime)}
                    </span>
                  </div>

                  {event.endDate && (
                    <>
                      <div className="flex items-start sm:items-center gap-2 text-sm pt-2">
                        <span className="font-medium text-gray-500 w-12 flex-shrink-0">
                          End:
                        </span>
                        <span className="text-gray-900 break-words">
                          {formatDate(event.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm pl-14">
                        <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {formatTime(event.endTime)}
                        </span>
                      </div>
                    </>
                  )}

                  {event.durationDays && event.durationDays > 0 && (
                    <div className="flex items-center gap-2 text-sm mt-2 pt-2 border-t border-gray-100">
                      <span className="font-medium text-gray-500 flex-shrink-0">
                        Duration:
                      </span>
                      <span className="text-gray-600">
                        {event.durationDays}{" "}
                        {event.durationDays === 1 ? "day" : "days"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recurrence */}
            {event.isRecurring && (
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                  <Repeat className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    Recurrence
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formatRecurrenceInfo()}
                  </p>
                  {event.recurrenceInterval && (
                    <p className="text-gray-500 text-xs mt-1">
                      Interval: {event.recurrenceInterval}{" "}
                      {event.recurrenceInterval === 1 ? "day" : "days"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  Location
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900 break-words">
                    {event.location?.name || "No location specified"}
                  </p>
                  {(event.location?.city || event.location?.country) && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Globe className="w-3 h-3 flex-shrink-0" />
                      <span className="break-words">
                        {event.location.city}
                        {event.location.city && event.location.country
                          ? ", "
                          : ""}
                        {event.location.country}
                      </span>
                    </div>
                  )}
                  {event.location?.latitude && event.location?.longitude && (
                    <p className="text-xs text-gray-500 font-mono break-all">
                      {event.location.latitude}, {event.location.longitude}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EventDetails.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isRecurring: PropTypes.bool,
    recurrenceInterval: PropTypes.number,
    durationDays: PropTypes.number,
    location: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      city: PropTypes.string,
      country: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }).isRequired,
};

export default EventDetails;
