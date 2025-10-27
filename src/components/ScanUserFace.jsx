"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaceAuthSystem } from "@/lib/FaceAuthSystem";
import PropTypes from "prop-types";

export default function ScanUserFace({
  buttonText = "Scan Face",
  onScanComplete,
  onStatusUpdate,
  onError,
  disabled = false,
}) {
  const [authSystem, setAuthSystem] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const [errorMessage, setErrorMessage] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const [webcamActive, setWebcamActive] = useState(false);
  const [scanStep, setScanStep] = useState("idle");
  const videoRef = useRef(null);
  const scanSamples = useRef([]);

  // Start webcam
  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setWebcamActive(true);
          setStatus("Ready to scan face.");
          setErrorMessage("");
          if (onStatusUpdate) onStatusUpdate("Ready to scan face.");
        };
      }
    } catch (err) {
      console.error("Webcam error:", err);
      setStatus("Camera error.");
      setErrorMessage(
        `Failed to access webcam: ${
          err.message || "Please allow camera access."
        }`
      );
      if (onError)
        onError(
          `Failed to access webcam: ${
            err.message || "Please allow camera access."
          }`
        );
    }
  }, [onError, onStatusUpdate]);

  // Initialize FaceAuthSystem
  useEffect(() => {
    const init = async () => {
      setStatus("Loading face detection models...");
      setIsInitializing(true);
      setErrorMessage("");

      try {
        const system = new FaceAuthSystem({
          distanceThreshold: 0.2,
        });

        const initialized = await system.initialize();
        if (initialized) {
          setAuthSystem(system);
          setStatus("System initialized. Starting webcam...");
          startWebcam();
        } else {
          setStatus("Failed to initialize face models.");
          setErrorMessage(
            "Face detection models could not be loaded. Please try again."
          );
          if (onError) onError("Face detection models could not be loaded.");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setStatus("Initialization failed.");
        setErrorMessage(
          `Error: ${error.message || "Failed to initialize the system."}`
        );
        if (onError)
          onError(error.message || "Failed to initialize the system.");
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [onError, startWebcam]);

  // Capture image from webcam
  const captureImage = () => {
    const video = videoRef.current;
    if (!video || !webcamActive) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return canvas;
  };

  // Handle face scan
  const handleScan = async () => {
    setErrorMessage("");
    setScanStep("started");
    setStatus("Capturing face samples...");
    if (onStatusUpdate) onStatusUpdate("Capturing face samples...");

    if (!authSystem || !webcamActive) {
      setStatus("Invalid setup.");
      setErrorMessage("Ensure webcam is active and system is initialized.");
      setScanStep("failed");
      if (onError)
        onError("Ensure webcam is active and system is initialized.");
      return;
    }

    scanSamples.current = [];

    try {
      // Capture three face samples
      for (let i = 0; i < 3; i++) {
        setStatus(`Capturing sample ${i + 1} of 3...`);
        if (onStatusUpdate) onStatusUpdate(`Capturing sample ${i + 1} of 3...`);
        if (i > 0) await new Promise((r) => setTimeout(r, 1000));
        const image = captureImage();
        if (image) {
          scanSamples.current.push(image);
        } else {
          setStatus("Image capture failed.");
          setErrorMessage("Failed to capture image from webcam.");
          setScanStep("failed");
          if (onError) onError("Failed to capture image from webcam.");
          return;
        }
      }

      setStatus("Processing face data...");
      if (onStatusUpdate) onStatusUpdate("Processing face data...");
      const result = await authSystem.scanFace(scanSamples.current);

      if (!result.success) {
        // Update status to reflect the specific error
        setStatus("Face scan failed.");
        setErrorMessage(result.message || "Face scan failed.");
        setScanStep("failed");
        if (onError) onError(result.message || "Face scan failed.");
        return;
      }

      setStatus("Face scan completed successfully.");
      setScanStep("complete");
      if (onStatusUpdate) onStatusUpdate("Face scan completed successfully.");
      if (onScanComplete) onScanComplete(result);
    } catch (error) {
      console.error("Scan error:", error);
      // Ensure status is updated to reflect the error
      setStatus("Scan failed.");
      setErrorMessage(error.message || "An error occurred during face scan.");
      setScanStep("failed");
      if (onError)
        onError(error.message || "An error occurred during face scan.");
    }
  };

  // Determine button state
  const getButtonState = () => {
    if (isInitializing || !webcamActive || disabled) {
      return {
        className: "bg-gray-400 cursor-not-allowed",
        disabled: true,
        text: buttonText,
      };
    }

    if (scanStep === "started") {
      return {
        className: "bg-yellow-500 cursor-wait",
        disabled: true,
        text: "Processing...",
      };
    }

    if (scanStep === "failed") {
      return {
        className: "bg-red-500 cursor-not-allowed",
        disabled: true,
        text: "Scan Failed",
      };
    }

    if (scanStep === "complete") {
      return {
        className: "bg-green-500 hover:bg-green-600",
        disabled: false,
        text: "Scan Again",
      };
    }

    return {
      className: "bg-blue-500 hover:bg-blue-600",
      disabled: false,
      text: buttonText,
    };
  };

  // Render status indicator
  const renderStatusIndicator = () => {
    let bgColor = "bg-gray-50";
    let textColor = "text-gray-700";
    let displayStatus = status;

    if (scanStep === "started") {
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-700";
    } else if (scanStep === "complete") {
      bgColor = "bg-green-50";
      textColor = "text-green-700";
    } else if (scanStep === "failed" || errorMessage) {
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      displayStatus = errorMessage || status; // Prioritize error message
    }

    return (
      <div
        className={`text-center font-medium p-3 ${bgColor} ${textColor} rounded`}
      >
        {displayStatus}
      </div>
    );
  };

  const buttonState = getButtonState();

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        className="w-full h-64 bg-black rounded mb-4"
      />
      <button
        onClick={handleScan}
        className={`w-full p-2 text-white rounded transition ${buttonState.className}`}
        disabled={buttonState.disabled}
      >
        {buttonState.text}
      </button>

      {renderStatusIndicator()}

      {errorMessage && (
        <div className="mt-4 text-sm text-red-500 text-center">
          {errorMessage}
        </div>
      )}

      {isInitializing && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Loading models...
        </div>
      )}

      {!webcamActive && !isInitializing && (
        <div className="mt-4 text-sm text-red-500 text-center">
          Webcam not active. Please allow camera access.
        </div>
      )}
    </div>
  );
}

ScanUserFace.propTypes = {
  buttonText: PropTypes.string,
  onScanComplete: PropTypes.func,
  onStatusUpdate: PropTypes.func,
  onError: PropTypes.func,
  disabled: PropTypes.bool,
};
