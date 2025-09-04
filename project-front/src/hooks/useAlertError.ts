import { useEffect, useState } from "react";

export const useErrorAlert = (errorsMap: Record<string, unknown>) => {
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    const messages: string[] = [];

    for (const [key, error] of Object.entries(errorsMap)) {
      if (error) messages.push(key);
    }

    if (messages.length > 0) {
      setErrorMessages(messages);
      setShowErrorAlert(true);

      const timer = setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, Object.values(errorsMap));

  return { showErrorAlert, errorMessages, setShowErrorAlert };
};
