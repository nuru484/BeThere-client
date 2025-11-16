// src/components/FaceScanner.jsx
import PropTypes from "prop-types";
import { useFaceScanner } from "@/hooks/useFaceScanner";
import { useEffect, useState, useRef } from "react";

export default function FaceScanner({
  buttonText = "Scan Face",
  onScanComplete,
  disabled = false,
  externalStatus = null,
}) {
  const {
    videoRef,
    status,
    error,
    result,
    scanStep,
    isInitializing,
    webcamActive,
    startScan,
    reset,
  } = useFaceScanner();

  const [shouldShowInternalError, setShouldShowInternalError] = useState(false);
  const hasEmittedRef = useRef(false);

  useEffect(() => {
    if (scanStep === "idle") {
      hasEmittedRef.current = false;
    }
  }, [scanStep]);

  useEffect(() => {
    if (
      result &&
      scanStep === "complete" &&
      onScanComplete &&
      !hasEmittedRef.current
    ) {
      hasEmittedRef.current = true;
      onScanComplete(result);
    }
  }, [result, scanStep, onScanComplete]);

  // Auto-hide internal error after 5s
  useEffect(() => {
    if (scanStep === "failed" && error) {
      setShouldShowInternalError(true);
      const timer = setTimeout(() => setShouldShowInternalError(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShouldShowInternalError(false);
    }
  }, [scanStep, error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const getButtonState = () => {
    if (isInitializing || !webcamActive || disabled) {
      return {
        text: buttonText,
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed",
      };
    }
    if (scanStep === "started") {
      return {
        text: "Processing...",
        disabled: true,
        className: "bg-yellow-500 cursor-wait",
      };
    }
    if (scanStep === "failed" && shouldShowInternalError) {
      return {
        text: "Retry Scan",
        disabled: false,
        className: "bg-orange-500 hover:bg-orange-600",
      };
    }
    if (scanStep === "complete") {
      return {
        text: "Scan Again",
        disabled: false,
        className: "bg-green-500 hover:bg-green-600",
      };
    }
    return {
      text: buttonText,
      disabled: false,
      className: "bg-blue-600 hover:bg-blue-700",
    };
  };

  const handleClick = () => {
    hasEmittedRef.current = false;
    reset(); // Reset internal state
    startScan();
  };

  const renderStatusIndicator = () => {
    let bgColor = "bg-gray-50";
    let textColor = "text-gray-700";
    let displayStatus = status;
    let showRefreshButton = false;

    if ((scanStep === "failed" || error) && shouldShowInternalError) {
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      displayStatus = error || status;
      showRefreshButton = true;
    } else if (externalStatus) {
      displayStatus = externalStatus.message || externalStatus;
      const type = externalStatus.type;
      if (type === "loading" || type === "info") {
        bgColor = "bg-blue-50";
        textColor = "text-blue-700";
      } else if (type === "success") {
        bgColor = "bg-green-50";
        textColor = "text-green-700";
      } else if (type === "error") {
        bgColor = "bg-red-50";
        textColor = "text-red-700";
      } else if (type === "warning") {
        bgColor = "bg-yellow-50";
        textColor = "text-yellow-700";
      }
    } else if (!webcamActive && !isInitializing) {
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      displayStatus = "Webcam not active. Please allow camera access.";
    } else if (isInitializing) {
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      displayStatus = "Loading models...";
    } else if (scanStep === "started") {
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-700";
    } else if (scanStep === "complete") {
      bgColor = "bg-green-50";
      textColor = "text-green-700";
    }

    return (
      <div
        className={`text-center font-medium p-4 mt-4 border ${bgColor} ${textColor} rounded-lg transition-all duration-300`}
      >
        <p>{displayStatus}</p>
        {showRefreshButton && (
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Refresh to Scan Again
          </button>
        )}
      </div>
    );
  };

  const renderFaceOverlay = () => {
    if (!webcamActive) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-80">
          <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>

          {scanStep === "started" && (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
            </div>
          )}

          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  scanStep === "started"
                    ? "bg-yellow-400 animate-pulse"
                    : scanStep === "complete"
                    ? "bg-green-400"
                    : scanStep === "failed"
                    ? "bg-red-400"
                    : "bg-blue-400"
                }`}
              ></div>
              <span className="text-white text-xs font-medium">
                {scanStep === "started"
                  ? "Scanning..."
                  : scanStep === "complete"
                  ? "Complete"
                  : scanStep === "failed"
                  ? "Failed"
                  : "Ready"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const button = getButtonState();

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl">
        <div className="relative bg-black rounded-xl overflow-hidden mb-6 shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-80 object-cover"
          />
          {renderFaceOverlay()}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50"></div>
        </div>

        <button
          onClick={handleClick}
          className={`w-full py-4 px-6 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${button.className}`}
          disabled={button.disabled}
        >
          <span className="flex items-center justify-center gap-2">
            {scanStep === "started" && (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {button.text}
          </span>
        </button>
      </div>

      {renderStatusIndicator()}

      {webcamActive &&
        scanStep === "idle" &&
        !externalStatus &&
        !shouldShowInternalError && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Instructions:
            </h3>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Position your face within the frame</li>
              <li>• Ensure good lighting conditions</li>
              <li>• Look directly at the camera</li>
              <li>• Remove glasses if possible for better accuracy</li>
            </ul>
          </div>
        )}
    </div>
  );
}

FaceScanner.propTypes = {
  buttonText: PropTypes.string,
  onScanComplete: PropTypes.func,
  disabled: PropTypes.bool,
  externalStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["loading", "success", "error", "warning", "info"]),
    }),
  ]),
};
