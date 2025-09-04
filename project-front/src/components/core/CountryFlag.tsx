import { useGetCountryFlagByCodeQuery } from "../../store";

const CountryFlag = ({
  isoCode,
  className,
}: {
  isoCode: string;
  className?: string | undefined;
}) => {
  const { data, error, isLoading } = useGetCountryFlagByCodeQuery(isoCode);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading flag</p>;

  const classes = className ? className : "w-full h-48 object-cover";

  return (
    <img
      className={classes}
      src={data![0].flags.svg}
      alt={`Flag of ${isoCode}`}
    />
  );
};

export default CountryFlag;
