import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Loader from "./components/ui/Loader";
import Home from "./pages/Home";
import GrowthSystems from "./pages/growth-systems";
import CaseStudy from "./pages/case-study";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colors = ["#042940", "#005C53", "#9FC131", "#DBF227", "#D6D58E"];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 32;
    canvas.height = 32;

    let index = 0;

    const drawFavicon = () => {
      ctx.clearRect(0, 0, 32, 32);

      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.arc(16, 16, 9, 0, Math.PI * 2);
      ctx.fill();

      const link = document.getElementById("favicon");
      if (link) {
        link.href = canvas.toDataURL("image/png");
      }

      index++;
    };

    drawFavicon();
    const interval = setInterval(drawFavicon, 1400);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Loader finishLoading={() => setLoading(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/growth-systems" element={<GrowthSystems />} />
      <Route path="/case-study" element={<CaseStudy />} />
    </Routes>
  );
}