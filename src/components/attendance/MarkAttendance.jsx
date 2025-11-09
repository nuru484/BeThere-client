// src/components/attendance/MarkAttendance.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCreateAttendance,
  useUpdateAttendance,
} from "@/hooks/useAttendance";
import FaceScanner from "@/components/FaceScanner";
import { FaceAuthSystem } from "@/lib/FaceAuthSystem";
import { useGetUserFaceScan } from "@/hooks/useFaceScanApi";
import { useAuth } from "@/hooks/useAuth";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import ErrorMessage from "../ui/ErrorMessage";

export default function MarkAttendance({ type = "in" }) {
  const { user } = useAuth();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const watchIdRef = useRef(null);
  const authSystemRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  const {
    data: userFaceData,
    isLoading: fetchingUserFaceData,
    isError: isFaceApiDataError,
    error: faceApiDataError,
    refetch: refetchFaceData,
  } = useGetUserFaceScan(user?.id);

  const storedDescriptor = userFaceData?.data?.faceScan;

  const { mutate: createAttendance, isPending: isCreating } =
    useCreateAttendance();

  const { mutate: updateAttendance, isPending: isUpdating } =
    useUpdateAttendance();

  const isMarking = type === "in" ? isCreating : isUpdating;
  const markAttendance = type === "in" ? createAttendance : updateAttendance;

  // Initialize FaceAuthSystem
  useEffect(() => {
    const initAuthSystem = async () => {
      const system = new FaceAuthSystem({ distanceThreshold: 0.6 });
      await system.initialize();
      authSystemRef.current = system;
    };
    initAuthSystem();
  }, []);

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

  const handleScanComplete = useCallback(
    async (scanResult) => {
      if (hasSubmittedRef.current) {
        return;
      }

      if (!scanResult || !scanResult.descriptor) {
        toast.error("Invalid face scan result.");
        return;
      }

      setIsVerifying(true);
      setVerificationStatus({
        message: "Verifying face scan...",
        type: "loading",
      });

      try {
        if (!storedDescriptor) {
          toast.error(
            "No stored face scan found. Please register your face first."
          );
          setVerificationStatus({
            message:
              "No stored face scan found. Please register your face first.",
            type: "error",
          });
          setIsVerifying(false);
          return;
        }

        // Verify face using FaceAuthSystem
        const verificationResult = authSystemRef.current.verifyFaceScan(
          scanResult.descriptor,
          storedDescriptor
        );

        if (!verificationResult.success) {
          toast.error(
            "Face verification failed: " + verificationResult.message
          );
          setVerificationStatus({
            message: "Face verification failed: " + verificationResult.message,
            type: "error",
          });
          setIsVerifying(false);
          return;
        }

        if (!verificationResult.isMatch) {
          toast.error(
            verificationResult.message ||
              "Face does not match. Authentication failed."
          );
          setVerificationStatus({
            message:
              verificationResult.message ||
              "Face does not match. Authentication failed.",
            type: "error",
          });
          setIsVerifying(false);
          return;
        }

        // Face verified successfully
        toast.success(
          verificationResult.message || "Face verified successfully!"
        );
        setVerificationStatus({
          message: verificationResult.message || "Face verified successfully!",
          type: "success",
        });

        // Check location
        if (!latitude || !longitude) {
          setLocationError(
            "Location is required to mark attendance. Please enable location services."
          );
          setVerificationStatus({
            message:
              "Location is required to mark attendance. Please enable location services.",
            type: "error",
          });
          setIsVerifying(false);
          return;
        }

        hasSubmittedRef.current = true;

        const attendanceData = {
          latitude,
          longitude,
        };

        setVerificationStatus({
          message: `Marking attendance ${type}...`,
          type: "loading",
        });

        markAttendance(
          { eventId: parseInt(eventId), attendanceData },
          {
            onSuccess: (response) => {
              toast.success(
                response?.message || `Attendance ${type} marked successfully!`
              );
              setVerificationStatus({
                message:
                  response?.message ||
                  `Attendance ${type} marked successfully!`,
                type: "success",
              });
              setIsVerifying(false);
              setTimeout(() => {
                navigate(`/dashboard/events/${eventId}`);
              }, 2000);
            },
            onError: (error) => {
              toast.error(
                error?.message || `Failed to mark attendance ${type}.`
              );
              setVerificationStatus({
                message: error?.message || `Failed to mark attendance ${type}.`,
                type: "error",
              });
              setIsVerifying(false);
              hasSubmittedRef.current = false;
            },
          }
        );
      } catch (error) {
        console.error("Error during face verification:", error);
        toast.error(
          error?.message || "An error occurred during face verification."
        );
        setVerificationStatus({
          message:
            error?.message || "An error occurred during face verification.",
          type: "error",
        });
        setIsVerifying(false);
        hasSubmittedRef.current = false;
      }
    },
    [
      storedDescriptor,
      latitude,
      longitude,
      markAttendance,
      eventId,
      type,
      navigate,
    ]
  );

  const getExternalStatus = () => {
    if (locationError) {
      return {
        message: locationError,
        type: "error",
      };
    }

    if (verificationStatus) {
      return verificationStatus;
    }

    return null;
  };

  if (fetchingUserFaceData) return <div>Loading face data...</div>;

  if (isFaceApiDataError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ErrorMessage error={faceApiDataError} onRetry={refetchFaceData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="container max-w-2xl">
        <button
          onClick={() => navigate(`/dashboard/events/${eventId}`)}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors flex items-center"
        >
          ← Back to Event
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mark Attendance {type === "in" ? "In" : "Out"}
        </h1>

        <FaceScanner
          buttonText={`Scan Face to Mark Attendance ${
            type === "in" ? "In" : "Out"
          }`}
          onScanComplete={handleScanComplete}
          disabled={
            isVerifying || isMarking || !user?.id || hasSubmittedRef.current
          }
          externalStatus={getExternalStatus()}
        />
      </div>
    </div>
  );
}

MarkAttendance.propTypes = {
  type: PropTypes.oneOf(["in", "out"]),
};
