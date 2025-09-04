import className from "classnames";
import { useState } from "react";
import Button from "./Button";
import { MdClose } from "react-icons/md";

interface AlertProps {
  message?: string;
  messages?: string[]; // for multiple errors
  success?: boolean;
  error?: boolean;
  onClose?: () => void;
}

const Alert = ({ message, messages, success, error, onClose }: AlertProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.(); // Notify parent if needed
  };

  const classes = className(
    "fixed bottom-4 right-4 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm w-full z-50",
    {
      "bg-red-500": error,
      "bg-green-500": success,
      hidden: !visible,
    }
  );

  return (
    <div className={classes}>
      <Button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close alert"
        rounded
      >
        <MdClose className="h-2 w-2" />
      </Button>
      {message && <p className="font-semibold">{message}</p>}
      {messages && messages.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm space-y-1">
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Alert;
