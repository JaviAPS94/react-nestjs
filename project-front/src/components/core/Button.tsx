import className from "classnames";
import { GoSync } from "react-icons/go";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  primary?: boolean;
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
  cancel?: boolean;
  highlight?: boolean;
  info?: boolean;
  base?: boolean;
  baseFill?: boolean;
  rounded?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactElement;
}

const Button = ({
  children,
  primary,
  success,
  warning,
  danger,
  cancel,
  highlight,
  info,
  base,
  baseFill,
  rounded,
  loading,
  disabled,
  icon,
  ...rest
}: ButtonProps) => {
  const classes = className(
    "flex items-center justify-center px-3 py-1.5 border rounded",
    rest.className,
    {
      "opacity-80": loading || disabled,
      "bg-blue-500 hover:bg-blue-600 text-white": primary,
      "border-green-600 bg-green-600 hover:bg-green-700 text-white": success,
      "border-yellow-400 bg-yellow-400 hover:bg-yellow-500 text-white": warning,
      "border-gray-400 bg-gray-400 hover:bg-gray-500 text-white": cancel,
      "border-purple-500 bg-purple-500 hover:bg-purple-600 text-white":
        highlight,
      "border-indigo-500 bg-indigo-500 hover:bg-indigo-600 text-white": info,
      "border-red-500 bg-red-500 hover:bg-red-600 text-white": danger,
      "border-gray-400 bg-white hover:bg-gray-300 text-gray-700": base,
      "border-black bg-white hover:bg-gray-300 text-black": baseFill,
      "rounded-full": rounded,
    }
  );

  return (
    <button {...rest} disabled={loading || disabled} className={classes}>
      {loading ? (
        <GoSync className="animate-spin" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
