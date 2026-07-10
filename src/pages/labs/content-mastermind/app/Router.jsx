import { Routes, Route } from "react-router-dom";
import Overview from "../features/overview";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Overview />} />
    </Routes>
  );
}