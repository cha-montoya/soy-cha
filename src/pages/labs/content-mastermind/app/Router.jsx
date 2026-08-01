import { Navigate, Route, Routes } from "react-router-dom";

import Overview from "../features/overview";
import Analysis from "../features/analysis";
import Content from "../features/content";
import ImageStudio from "../features/image-studio";
import Publishing from "../features/publishing";
import Analytics from "../features/analytics";
import SettingsLayout from "../features/settings/components/SettingsLayout";
import WorkspaceSettings from "../features/settings/pages/WorkspaceSettings";
import BrandAssetsSettings from "../features/settings/pages/BrandAssetsSettings";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Overview />} />

      <Route path="analysis" element={<Analysis />} />
      <Route path="analysis/:id" element={<Analysis />} />

      <Route path="content" element={<Content />} />
      <Route path="content/:id" element={<Content />} />

      <Route path="image-studio" element={<ImageStudio />} />
      <Route path="image-studio/:id" element={<ImageStudio />} />

      <Route path="publishing" element={<Publishing />} />
      <Route path="publishing/:id" element={<Publishing />} />

      <Route path="analytics" element={<Analytics />} />

      <Route path="settings" element={<SettingsLayout />}>
        <Route index element={<Navigate to="workspace" replace />} />
        <Route path="workspace" element={<WorkspaceSettings />} />
        <Route path="brand-assets" element={<BrandAssetsSettings />} />
      </Route>
    </Routes>
  );
}
