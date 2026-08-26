import { ReactNode } from "react";
import { Minus, Square, X, Circle } from "lucide-react";

interface DesktopFrameProps {
  children: ReactNode;
}

export function DesktopFrame({ children }: DesktopFrameProps) {
  return (
    <div className="w-[1920px] h-[1080px] flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden border-4 border-gray-300">
      {/* Browser Chrome */}
      <div className="h-10 bg-gradient-to-b from-gray-200 to-gray-300 flex items-center px-4 gap-3 border-b border-gray-400 flex-shrink-0">
        {/* Traffic Lights (macOS style) */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] hover:bg-[#FF6B63] cursor-pointer transition-colors" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:bg-[#FFC842] cursor-pointer transition-colors" />
          <div className="w-3 h-3 rounded-full bg-[#28C940] border border-[#1AAB29] hover:bg-[#33D451] cursor-pointer transition-colors" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-2 ml-4">
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-1 flex items-center gap-2 shadow-inner border border-gray-300">
            <div className="w-3 h-3 text-gray-400">🔒</div>
            <span className="text-xs text-gray-600" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
              ecoincubadora.io
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
