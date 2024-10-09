import className from "classnames";

interface AlertProps {
  message: string;
  success?: boolean;
  error?: boolean;
}

const Alert = ({ message, success, error }: AlertProps) => {
  const classes = className(
    "fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg",
    {
      "bg-red-500": error,
      "bg-green-500": success,
    }
  );

  return <div className={classes}>{message}</div>;
};

export default Alert;
