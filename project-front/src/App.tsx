import { Route, Routes } from "react-router-dom";
import NormListPage from "./pages/NormListPage";
import Navbar from "./components/core/Navbar";
import NormPage from "./pages/NormPage";
import DesignPage from "./pages/DesignPage";
import ElementsDesignPage from "./pages/ElementsDesignPage";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<NormListPage />} />
        <Route path="/norms/new" element={<NormPage />} />
        <Route path="/norms/edit/:normId" element={<NormPage />} />
        <Route path="/design" element={<DesignPage />} />
        <Route path="/elements/design" element={<ElementsDesignPage />} />
      </Routes>
    </>
  );
};

export default App;
