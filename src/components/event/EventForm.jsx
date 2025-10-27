import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import {
  MapPin,
  Edit3,
  FileText,
  ArrowRight,
  AlertCircle,
  X,
  Navigation,
  Info,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
// import * as yup from "yup";
import { eventValidationSchema } from "@/validation/eventValidation";

const EventForm = ({ onSubmit, isLoading, defaultValues, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(eventValidationSchema),
    defaultValues: {
      ...defaultValues,
      isRecurring: defaultValues?.isRecurring || false,
      recurrenceRule: defaultValues?.recurrenceRule || "",
      location: {
        name: defaultValues?.location?.name || "",
        latitude: defaultValues?.location?.latitude || "",
        longitude: defaultValues?.location?.longitude || "",
        city: defaultValues?.location?.city || "",
        country: defaultValues?.location?.country || "",
      },
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
    },
  });

  const [locationError, setLocationError] = useState(null);
  const isRecurring = watch("isRecurring");

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setValue("location.latitude", position.coords.latitude);
          setValue("location.longitude", position.coords.longitude);
          setLocationError(null);
          navigator.geolocation.clearWatch(watchId);
        },
        () => {
          setLocationError(
            "Unable to retrieve your location. Please enter manually."
          );
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  // Transform form data before submission
  const handleFormSubmit = (data) => {
    const transformedData = {
      ...data,
      // Convert startDate and endDate to ISO-8601 DateTime if they exist
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      // startTime and endTime are already in HH:mm format from the time input
    };
    onSubmit(transformedData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gray-100 border border-emerald-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 text-center flex-grow">
            {defaultValues ? "Update Event" : "Create New Event"}
          </h2>
          <div className="w-8" />
        </div>

        <p className="text-gray-500 text-center mb-6">
          {defaultValues
            ? "Edit the details to update the event"
            : "Fill in the details to create an event"}
        </p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title */}
          <div className="relative">
            <FileText
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              {...register("title")}
              placeholder="Event Title"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <span className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="relative">
            <Edit3 className="absolute top-3 left-3 text-gray-400" size={20} />
            <textarea
              {...register("description")}
              placeholder="Event Description"
              rows="4"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <span className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Start/End Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Start Date (optional)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={16}
                      className="ml-1 text-gray-400 cursor-help"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    Start date of the event. Leave empty for recurring events.
                  </TooltipContent>
                </Tooltip>
              </label>
              <input
                type="date"
                {...register("startDate")}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                End Date (optional)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={16}
                      className="ml-1 text-gray-400 cursor-help"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    End date of the event. Leave empty for recurring events.
                  </TooltipContent>
                </Tooltip>
              </label>
              <input
                type="date"
                {...register("endDate")}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                {...register("startTime")}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.startTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startTime && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.startTime.message}
                </span>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                {...register("endTime")}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.endTime ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endTime && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.endTime.message}
                </span>
              )}
            </div>
          </div>

          {/* Recurrence */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("isRecurring")}
                id="isRecurring"
                className="mr-2"
              />
              <label
                htmlFor="isRecurring"
                className="font-medium text-gray-700 flex items-center"
              >
                Is this event recurring?
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      size={16}
                      className="ml-1 text-gray-400 cursor-help"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    If enabled, the event repeats according to the rule below.
                  </TooltipContent>
                </Tooltip>
              </label>
            </div>

            {isRecurring && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Recurrence Rule
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info
                        size={16}
                        className="ml-1 text-gray-400 cursor-help"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Use iCalendar RRULE format. E.g.:
                      <br />
                      <code className="text-xs">
                        FREQ=WEEKLY;BYDAY=MO,WE,FR
                      </code>
                    </TooltipContent>
                  </Tooltip>
                </label>
                <input
                  type="text"
                  {...register("recurrenceRule")}
                  placeholder="FREQ=WEEKLY;BYDAY=MO,WE,FR"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.recurrenceRule ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.recurrenceRule && (
                  <span className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.recurrenceRule.message}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4 pt-2">
            <div className="relative">
              <MapPin
                className="absolute top-3 left-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                {...register("location.name")}
                placeholder="Location Name"
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                  errors.location?.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.location?.name && (
                <span className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.location.name.message}
                </span>
              )}
            </div>

            <div className="flex space-x-4">
              <input
                type="number"
                step="any"
                {...register("location.latitude")}
                placeholder="Latitude"
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="number"
                step="any"
                {...register("location.longitude")}
                placeholder="Longitude"
                className="w-full px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 flex items-center justify-center"
            >
              <Navigation className="mr-2" size={18} />
              Use Current Location
            </button>

            {locationError && (
              <span className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {locationError}
              </span>
            )}

            <input
              type="text"
              {...register("location.city")}
              placeholder="City (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              {...register("location.country")}
              placeholder="Country (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300"
            />
          </div>

          {/* Event Type */}
          <div className="relative">
            <input
              type="text"
              {...register("type")}
              placeholder="Event Type (e.g., Sports, Music, Meetup)"
              className={`w-full pl-3 pr-3 py-2 rounded-lg border ${
                errors.type ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.type && (
              <span className="text-sm text-red-500 mt-1 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-500 flex items-center justify-center"
            >
              {isLoading ? (
                <span>
                  {defaultValues ? "Updating event..." : "Creating event..."}
                </span>
              ) : (
                <>
                  {defaultValues ? "Update Event" : "Create Event"}
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EventForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  defaultValues: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    isRecurring: PropTypes.bool,
    recurrenceRule: PropTypes.string,
    location: PropTypes.shape({
      name: PropTypes.string,
      latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    type: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
};

export default EventForm;
