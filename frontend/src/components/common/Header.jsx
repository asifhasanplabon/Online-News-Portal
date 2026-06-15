import { format } from "date-fns";
import { Newspaper } from "lucide-react";

const Header = () => {
  return (
    <div className="bg-red-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span className="text-xl font-bold tracking-widest uppercase">The Daily Chronicle</span>
        </div>
        <div className="text-sm opacity-80 hidden sm:block">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>
    </div>
  );
};

export default Header;
