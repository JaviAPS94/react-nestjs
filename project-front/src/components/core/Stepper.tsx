import { FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";
import Button from "./Button";

interface StepperProps {
  step: number;
  stepComponents: Record<
    number,
    { title?: string; content: JSX.Element; isFinalStep?: boolean }
  >;
  errorMessage?: string;
  onNextStep: () => void;
  onFinalAction: () => void;
  onCancel: () => void;
  finishFlow?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  step,
  stepComponents,
  errorMessage,
  onNextStep,
  onFinalAction,
  onCancel,
  finishFlow,
}) => {
  const currentStep = stepComponents[step];

  return (
    <>
      {currentStep?.title && (
        <h2 className="text-lg font-medium">{currentStep?.title}</h2>
      )}

      <div className="mt-4 max-h-96 overflow-y-auto">
        {currentStep?.content || <p>No step found</p>}
      </div>

      {errorMessage && (
        <span className="text-red-500 text-sm">{errorMessage}</span>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          primary={!currentStep.isFinalStep && !finishFlow}
          success={currentStep.isFinalStep || finishFlow}
          onClick={
            currentStep.isFinalStep || finishFlow ? onFinalAction : onNextStep
          }
          className="mr-2 text-white px-4 py-2 rounded-md"
          icon={
            currentStep.isFinalStep || finishFlow ? (
              <FaPlus />
            ) : (
              <FaChevronRight />
            )
          }
        >
          {currentStep.isFinalStep || finishFlow ? "Finalizar" : "Continuar"}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          icon={<FaTimes />}
        >
          Cancelar
        </Button>
      </div>
    </>
  );
};

export default Stepper;
