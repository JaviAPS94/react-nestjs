import { Accessory } from "./Accesories";
import AccesoriesTable from "./AccesoriesTable";

const ValueModal: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: { [key: string]: any } | Record<string, any>[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ values, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Todos los valores</h2>
        <div className="grid grid-cols-2 gap-4">
          {Array.isArray(values)
            ? values.map((value, index) => (
                <div key={index} className="border p-2 rounded">
                  <strong>{value.name}:</strong>
                  {value.name == "Accesorios" ? (
                    <AccesoriesTable
                      accessories={JSON.parse(value.value) as Accessory[]}
                    />
                  ) : (
                    value.value
                  )}
                </div>
              ))
            : Object.entries(values).map(([key, value]) => (
                <div key={key} className="border p-2 rounded">
                  <strong>{key}:</strong> {value}
                </div>
              ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ValueModal;
