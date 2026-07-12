import { Routes, Route } from "react-router-dom";
import Overview from "../features/overview";
import Content from "../features/content";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="content" element={<Content />} />
    </Routes>
  );
}