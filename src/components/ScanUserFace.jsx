// src/components/ScanUserFace.jsx
import PropTypes from "prop-types";
import { useFaceScanner } from "@/hooks/useFaceScanner";
import { useEffect } from "react";

export default function ScanUserFace({
  buttonText = "Scan Face",
  onScanComplete,
  disabled = false,
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
  } = useFaceScanner();

  useEffect(() => {
    if (result && scanStep === "complete" && onScanComplete) {
      onScanComplete(result);
    }
  }, [result, scanStep, onScanComplete]);

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
    if (scanStep === "failed") {
      return {
        text: "Scan Failed",
        disabled: true,
        className: "bg-red-500 cursor-not-allowed",
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
      className: "bg-blue-500 hover:bg-blue-600",
    };
  };

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
    } else if (scanStep === "failed" || error) {
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      displayStatus = error || status;
    }

    return (
      <div
        className={`text-center font-medium p-3 mt-4 ${bgColor} ${textColor} rounded`}
      >
        {displayStatus}
      </div>
    );
  };

  const button = getButtonState();

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        className="w-full h-64 bg-black rounded mb-4"
      />

      <button
        onClick={startScan}
        className={`w-full p-2 text-white rounded transition ${button.className}`}
        disabled={button.disabled}
      >
        {button.text}
      </button>

      {renderStatusIndicator()}

      {!webcamActive && !isInitializing && (
        <div className="mt-4 text-sm text-red-500 text-center">
          Webcam not active. Please allow camera access.
        </div>
      )}

      {isInitializing && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Loading models...
        </div>
      )}
    </div>
  );
}

ScanUserFace.propTypes = {
  buttonText: PropTypes.string,
  onScanComplete: PropTypes.func,
  disabled: PropTypes.bool,
};
