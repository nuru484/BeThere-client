// src/hooks/useFaceVerification.js
import { useState, useRef } from "react";
import { FaceAuthSystem } from "@/lib/FaceAuthSystem";
import { useFaceScan } from "@/hooks/useFaceScanApi";

export const useFaceVerification = (userId) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const authSystemRef = useRef(new FaceAuthSystem({ distanceThreshold: 0.2 }));

  const {
    facescan,
    isLoading,
    isError,
    error: fetchError,
  } = useFaceScan(userId);

  const verifyFace = async (scanResult) => {
    setIsVerifying(true);
    setError(null);

    try {
      if (isError) {
        setError(fetchError?.message || "Failed to fetch face scan data");
        setIsVerifying(false);
        return false;
      }

      if (!scanResult.success) {
        setError("Scan failed");
        setIsVerifying(false);
        return false;
      }

      if (!facescan?.data?.faceScan) {
        setError("No registered user found with this ID");
        setIsVerifying(false);
        return false;
      }

      const verificationResult = authSystemRef.current.verifyFaceScan(
        scanResult.fuzzyHash,
        facescan.data.faceScan
      );

      if (verificationResult.success && verificationResult.isMatch) {
        setIsVerifying(false);
        return true;
      } else {
        setError(verificationResult.message || "Face scan does not match");
        setIsVerifying(false);
        return false;
      }
    } catch (err) {
      console.log(err);
      setError("Verification failed");
      setIsVerifying(false);
      return false;
    }
  };

  return { verifyFace, isVerifying, error, isLoading };
};
