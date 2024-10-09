const Tooltip: React.FC<{
  text: string;
  visible: boolean;
  position: { x: number; y: number };
}> = ({ text, visible, position }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(10px, -50%)",
      }}
    >
      {text}
    </div>
  );
};

export default Tooltip;
