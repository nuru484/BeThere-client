import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreateAttendance,
  useUpdateAttendance,
} from "@/hooks/useAttendance";
import ScanUserFace from "@/components/ScanUserFace";
import { useFaceVerification } from "@/hooks/useFaceVerification";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import PropTypes from "prop-types";

export default function MarkAttendance({ type = "in" }) {
  const { user } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const watchIdRef = useRef(null);

  const {
    verifyFace,
    isVerifying,
    error: faceError,
    isLoading: faceLoading,
  } = useFaceVerification(user.id);

  const {
    mutate: createAttendance,
    isLoading: isCreating,
    error: createError,
  } = useCreateAttendance();

  const {
    mutate: updateAttendance,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateAttendance();

  const isMarking = type === "in" ? isCreating : isUpdating;
  const attendanceError = type === "in" ? createError : updateError;
  const markAttendance = type === "in" ? createAttendance : updateAttendance;

  // Start watching location
  const startWatchingLocation = useCallback(() => {
    setLocationError("");
    setLatitude(null);
    setLongitude(null);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationError("");
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError("Please enable location services to mark attendance.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  }, []);

  // Check and request location permission
  const checkLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        setLocationError(
          "Location access is disabled. Please enable location services in your browser settings to mark attendance."
        );
      } else if (result.state === "prompt" || result.state === "granted") {
        startWatchingLocation();
      }
    });
  }, [startWatchingLocation]);

  useEffect(() => {
    checkLocationPermission();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [checkLocationPermission]);

  const handleScanComplete = async (result) => {
    const isVerified = await verifyFace(result);
    if (isVerified) {
      setStatus(`Authentication successful! Marking attendance ${type}...`);
      setErrorMessage("");

      if (!latitude || !longitude) {
        setStatus("");
        setLocationError(
          "Location is required to mark attendance. Please enable location services."
        );
        return;
      }

      const time = format(new Date(), "HH:mm");
      const attendanceData = {
        userId: user?.id,
        eventId: parseInt(eventId),
        latitude,
        longitude,
        ...(type === "in" ? { startTime: time } : { attendanceEndTime: time }),
      };

      markAttendance(attendanceData, {
        onSuccess: () => {
          setStatus(`Attendance ${type} marked successfully!`);
        },
        onError: (err) => {
          setStatus(`Attendance ${type} marking failed.`);
          setErrorMessage(err.message || `Failed to mark attendance ${type}.`);
        },
      });
    } else {
      setStatus("Authentication failed.");
      setErrorMessage(faceError || "Face scan does not match.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate(`/dashboard/events/${eventId}`)}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors flex items-center"
        >
          ← Back to Event
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mark Attendance {type === "in" ? "In" : "Out"}
        </h1>

        <ScanUserFace
          buttonText={`Scan Face to Mark Attendance ${
            type === "in" ? "In" : "Out"
          }`}
          onScanComplete={handleScanComplete}
          onStatusUpdate={setStatus}
          onError={setErrorMessage}
          disabled={faceLoading || isVerifying || isMarking || !user?.id}
        />
        {faceLoading && (
          <div className="mt-4 text-center font-medium text-gray-700">
            Fetching stored fuzzy hash...
          </div>
        )}
        {isVerifying && (
          <div className="mt-4 text-center font-medium text-gray-700">
            Verifying face scan...
          </div>
        )}
        {isMarking && (
          <div className="mt-4 text-center font-medium text-gray-700">
            Marking attendance {type}...
          </div>
        )}
        {locationError && (
          <div className="mt-4 text-sm text-red-500 text-center">
            {locationError}
          </div>
        )}
        {status && !faceLoading && !isVerifying && !isMarking && (
          <div className="mt-4 text-center font-medium text-gray-700">
            {status}
          </div>
        )}
        {(errorMessage || attendanceError?.message) && (
          <div className="mt-4 text-sm text-red-500 text-center">
            {errorMessage || attendanceError?.message}
          </div>
        )}
      </div>
    </div>
  );
}

MarkAttendance.propTypes = {
  type: PropTypes.oneOf(["in", "out"]),
};
