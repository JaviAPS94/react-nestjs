import { Route, Routes } from "react-router-dom";
import NormListPage from "./pages/NormListPage";
import Navbar from "./components/core/Navbar";
import NewNormPage from "./pages/NewNormPage";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<NormListPage />} />
        <Route path="/new-norm" element={<NewNormPage />} />
      </Routes>
    </>
  );
};

export default App;
