// src/components/EventForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";
import {
  MapPin,
  Edit3,
  FileText,
  ArrowRight,
  X,
  Navigation,
  Info,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { eventValidationSchema } from "@/validation/eventValidation";

const EventForm = ({ onSubmit, isLoading, defaultValues, onCancel }) => {
  const [locationError, setLocationError] = useState(null);

  const form = useForm({
    resolver: zodResolver(eventValidationSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate).toISOString().split("T")[0]
        : "",
      startTime: defaultValues?.startTime || "",
      endTime: defaultValues?.endTime || "",
      isRecurring: defaultValues?.isRecurring || false,
      recurrenceInterval: defaultValues?.recurrenceInterval || undefined,
      durationDays: defaultValues?.durationDays || undefined,
      type: defaultValues?.type || "",
      location: {
        name: defaultValues?.location?.name || "",
        latitude: defaultValues?.location?.latitude || 0,
        longitude: defaultValues?.location?.longitude || 0,
        city: defaultValues?.location?.city || "",
        country: defaultValues?.location?.country || "",
      },
    },
  });

  const isRecurring = form.watch("isRecurring");

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          form.setValue("location.latitude", position.coords.latitude);
          form.setValue("location.longitude", position.coords.longitude);
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

  const handleFormSubmit = (data) => {
    const transformedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
      ...(data.isRecurring &&
        data.recurrenceInterval && {
          recurrenceInterval: data.recurrenceInterval,
        }),
      ...(data.durationDays && { durationDays: data.durationDays }),
    };
    onSubmit(transformedData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-2">
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-800 text-center flex-grow">
            {defaultValues ? "Update Event" : "Create New Event"}
          </h2>
          <div className="w-10" />
        </div>

        <p className="text-gray-500 text-center mb-8">
          {defaultValues
            ? "Edit the details to update the event"
            : "Fill in the details to create an event"}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Event Title
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <Input
                        placeholder="Enter event title"
                        className="pl-10 h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <Edit3 className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <Textarea
                        placeholder="Enter event description"
                        className="pl-10 min-h-[100px] border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      End Date
                      {!isRecurring && (
                        <span className="text-red-500 text-xs">(Required)</span>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            size={16}
                            className="text-gray-400 cursor-help"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {isRecurring
                            ? "Optional for recurring events"
                            : "Required for non-recurring events"}
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      When attendance opens (e.g., 06:00)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Time */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      End Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      When attendance closes (e.g., 19:30)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Recurring Event Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-semibold text-gray-700 flex items-center gap-2">
                        Is this event recurring?
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info
                              size={16}
                              className="text-gray-400 cursor-help"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            If enabled, the event will repeat at regular
                            intervals
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormDescription>
                        Enable this if the event repeats over time
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <FormField
                    control={form.control}
                    name="recurrenceInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Recurrence Interval (Days)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 7 for weekly"
                            className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                            disabled={isLoading}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          How many days between occurrences
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Duration (Days)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="e.g., 1"
                            className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                            disabled={isLoading}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          How many days each occurrence lasts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-blue-600" />
                Event Location
              </h3>

              <FormField
                control={form.control}
                name="location.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Location Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Conference Hall A"
                        className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Latitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., 5.6037"
                          className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Longitude
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., -0.1870"
                          className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                          disabled={isLoading}
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={handleUseCurrentLocation}
                variant="outline"
                className="w-full h-12 border-2 border-blue-300 hover:bg-blue-100 hover:border-blue-400 text-blue-700"
                disabled={isLoading}
              >
                <Navigation className="mr-2 h-5 w-5" />
                Use Current Location
              </Button>

              {locationError && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <X size={14} />
                  {locationError}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        City (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Accra"
                          className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Country (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Ghana"
                          className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Event Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Event Type
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Sports, Music, Conference"
                      className="h-12 border-2 border-gray-200 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-100"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                {isLoading ? (
                  <span>
                    {defaultValues ? "Updating Event..." : "Creating Event..."}
                  </span>
                ) : (
                  <>
                    {defaultValues ? "Update Event" : "Create Event"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
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
    recurrenceInterval: PropTypes.number,
    durationDays: PropTypes.number,
    location: PropTypes.shape({
      name: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      city: PropTypes.string,
      country: PropTypes.string,
    }),
    type: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
};

export default EventForm;
