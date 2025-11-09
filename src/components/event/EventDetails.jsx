// src/components/event/EventDetails.jsx
import {
  Calendar,
  MapPin,
  Tag,
  Repeat,
  Clock,
  Globe,
  AlertCircle,
} from "lucide-react";
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

  if (!event) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardContent>
          <div className="text-center py-8 sm:py-12">
            <div className="max-w-md mx-auto px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Event Not Found
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                The event you&apos;re looking for doesn&apos;t exist or has been
                removed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* Event Title and Type */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              {event.title}
            </h1>
            <Badge
              variant="secondary"
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 font-medium w-fit shadow-sm hover:shadow transition-shadow"
            >
              <Tag className="w-3.5 h-3.5 mr-1.5" />
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

        <Separator className="my-6 sm:my-8 bg-gray-200" />

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Date & Time Section */}
          <div className="space-y-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl flex-shrink-0 shadow-sm">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base tracking-tight">
                  Date & Time
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start sm:items-center gap-2 text-sm">
                    <span className="font-medium text-gray-500 w-12 flex-shrink-0">
                      Start:
                    </span>
                    <span className="text-gray-900 break-words font-medium">
                      {formatDate(event.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm pl-14">
                    <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600">
                      {formatTime(event.startTime)}
                    </span>
                  </div>

                  {event.endDate && (
                    <>
                      <div className="flex items-start sm:items-center gap-2 text-sm pt-3 mt-3 border-t border-gray-100">
                        <span className="font-medium text-gray-500 w-12 flex-shrink-0">
                          End:
                        </span>
                        <span className="text-gray-900 break-words font-medium">
                          {formatDate(event.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm pl-14">
                        <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">
                          {formatTime(event.endTime)}
                        </span>
                      </div>
                    </>
                  )}

                  {event.durationDays && event.durationDays > 0 && (
                    <div className="flex items-center gap-2 text-sm mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-500 flex-shrink-0">
                        Duration:
                      </span>
                      <span className="text-gray-900 font-medium">
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
              <div className="flex items-start gap-3 sm:gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl">
                <div className="p-2.5 bg-white border border-teal-200 rounded-lg flex-shrink-0 shadow-sm">
                  <Repeat className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base tracking-tight">
                    Recurrence
                  </h3>
                  <p className="text-gray-700 text-sm font-medium">
                    {formatRecurrenceInfo()}
                  </p>
                  {event.recurrenceInterval && (
                    <p className="text-gray-500 text-xs mt-1.5">
                      Repeats every {event.recurrenceInterval}{" "}
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
              <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex-shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base tracking-tight">
                  Location
                </h3>
                <div className="space-y-3">
                  <p className="font-semibold text-gray-900 break-words text-base">
                    {event.location?.name || "No location specified"}
                  </p>
                  {(event.location?.city || event.location?.country) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
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
                    <div className="pt-2 mt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-mono break-all bg-gray-50 px-2 py-1.5 rounded border border-gray-200">
                        {event.location.latitude.toFixed(6)},{" "}
                        {event.location.longitude.toFixed(6)}
                      </p>
                    </div>
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
  }),
};

export default EventDetails;
