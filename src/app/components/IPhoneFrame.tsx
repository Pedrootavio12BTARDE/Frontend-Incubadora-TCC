interface IPhoneFrameProps {
  children: React.ReactNode;
}

export function IPhoneFrame({ children }: IPhoneFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      {/* iPhone 14 Frame */}
      <div className="relative">
        {/* Moldura externa do iPhone */}
        <div className="relative bg-[#1d1d1f] rounded-[3.5rem] p-3 shadow-2xl">
          {/* Borda interna metálica */}
          <div className="relative bg-gradient-to-b from-[#3a3a3c] to-[#1d1d1f] rounded-[3rem] p-[2px]">
            {/* Tela do iPhone */}
            <div className="relative bg-black rounded-[2.9rem] overflow-hidden" style={{ width: '390px', height: '844px' }}>
              {/* Dynamic Island (notch do iPhone 14) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black rounded-b-[1.2rem] w-[126px] h-[37px] flex items-center justify-center">
                  {/* Câmera e sensores */}
                  <div className="flex items-center gap-3">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#0a0a0a] border border-[#1a1a1a]" />
                  </div>
                </div>
              </div>

              {/* Conteúdo do App */}
              <div className="w-full h-full overflow-y-auto scrollbar-hide">
                {children}
              </div>
            </div>
          </div>

          {/* Botões laterais */}
          {/* Volume + */}
          <div className="absolute left-0 top-[120px] w-[3px] h-[32px] bg-[#1d1d1f] rounded-l-sm" />
          {/* Volume - */}
          <div className="absolute left-0 top-[170px] w-[3px] h-[32px] bg-[#1d1d1f] rounded-l-sm" />
          {/* Mudo */}
          <div className="absolute left-0 top-[90px] w-[3px] h-[24px] bg-[#1d1d1f] rounded-l-sm" />
          {/* Power */}
          <div className="absolute right-0 top-[140px] w-[3px] h-[60px] bg-[#1d1d1f] rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}
