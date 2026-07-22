import { Route, Routes } from "react-router-dom";

import Overview from "../features/overview";
import Analysis from "../features/analysis";
import Content from "../features/content";
import ImageStudio from "../features/image-studio";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Overview />} />

      <Route
        path="analysis"
        element={<Analysis />}
      />

      <Route
        path="analysis/:id"
        element={<Analysis />}
      />

      <Route
        path="content"
        element={<Content />}
      />

      <Route
        path="content/:id"
        element={<Content />}
      />

      <Route
        path="image-studio"
        element={<ImageStudio />}
      />

      <Route
        path="image-studio/:id"
        element={<ImageStudio />}
      />
    </Routes>
  );
}