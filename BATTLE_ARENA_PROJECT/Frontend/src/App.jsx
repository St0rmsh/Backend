import { BrowserRouter, Routes, Route } from "react-router-dom";

import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}