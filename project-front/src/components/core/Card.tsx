import Button from "./Button";
import CountryFlag from "./CountryFlag";
import { MdOpenInNew } from "react-icons/md";

interface CardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string | undefined;
  countryCode?: string | undefined;
  handleButtonClick?: (id: number) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  imageUrl,
  countryCode,
  handleButtonClick,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      {imageUrl && (
        <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      )}
      {countryCode && <CountryFlag isoCode={countryCode} />}
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xl">{title}</h2>
          </div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
        {handleButtonClick && (
          <Button
            primary
            className="py-1 px-3 rounded text-sm"
            onClick={() => handleButtonClick(id)}
          >
            <MdOpenInNew className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
