import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import API from "../../api/axios";

const BreakingNewsTicker = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/news", { params: { isBreaking: true, limit: 8 } })
      .then((res) => setItems(res.data.news || []))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  const tickerText = items.map((n) => n.title).join("   ●   ");

  return (
    <div className="bg-red-600 text-white flex items-center overflow-hidden h-9">
      <div className="flex-shrink-0 flex items-center gap-1 bg-gray-900 px-4 h-full font-bold text-sm uppercase tracking-widest whitespace-nowrap">
        <Zap className="h-4 w-4" />
        Breaking
      </div>
      <div className="overflow-hidden flex-1">
        <div
          className="whitespace-nowrap text-sm animate-marquee inline-block"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default BreakingNewsTicker;
