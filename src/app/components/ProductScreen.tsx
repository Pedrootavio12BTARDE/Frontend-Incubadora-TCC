import { Package, Cpu, Wrench, Zap, Image as ImageIcon } from "lucide-react";

interface ProductScreenProps {
  onNavigate?: () => void;
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function ProductScreen({ onNavigate, darkMode = false, isDesktop = false }: ProductScreenProps = {}) {
  const categories = [
    {
      title: "Eletrônica e Sensores",
      icon: Cpu,
      color: "#98FFD9",
      items: [
        { name: "ESP32 DevKit V1", price: 45.00 },
        { name: "Sensor DHT22", price: 28.00 },
        { name: "Módulo Relé", price: 18.00 },
        { name: "Servo Motor", price: 15.00 },
        { name: "Regulador LM2596", price: 12.00 },
      ],
    },
    {
      title: "Estrutura e Soldagem",
      icon: Wrench,
      color: "#6EDDC4",
      items: [
        { name: "Placa de Fenolite", price: 12.00 },
        { name: "Kit Jumpers Rígidos", price: 15.00 },
        { name: "Barra de Pinos", price: 5.00 },
        { name: "Estanho", price: 10.00 },
      ],
    },
    {
      title: "Elétrica e Clima",
      icon: Zap,
      color: "#4ECDC4",
      items: [
        { name: "Fonte 12V 2A", price: 35.00 },
        { name: "Lâmpada 40W", price: 8.00 },
        { name: "Soquete E27", price: 6.00 },
        { name: "Cooler 12V", price: 12.00 },
        { name: "Caixa Térmica", price: 25.00 },
      ],
    },
  ];

  const calculateSubtotal = (items: { price: number }[]) => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const totalGeral = categories.reduce((sum, cat) => sum + calculateSubtotal(cat.items), 0);

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-2 sm:p-4">
      {/* Grid tecnológico de fundo */}
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-500 ${darkMode ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `
            linear-gradient(${darkMode ? '#98FFD9' : '#001F3F'} 1px, transparent 1px),
            linear-gradient(90deg, ${darkMode ? '#98FFD9' : '#001F3F'} 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Pontos de luz */}
      <div className="absolute top-6 right-6 w-2 h-2 bg-[#98FFD9] rounded-full animate-pulse shadow-[0_0_20px_#98FFD9]" />
      <div className="absolute bottom-10 left-4 w-1.5 h-1.5 bg-[#6EDDC4] rounded-full animate-pulse shadow-[0_0_15px_#6EDDC4]" style={{ animationDelay: '0.5s' }} />

      <div className={`relative z-10 space-y-6 ${isDesktop ? 'pb-8' : 'px-2 py-6 pb-24'}`}>
        {/* Cabeçalho - Only on mobile */}
        {!isDesktop && (
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-2.5 rounded-xl shadow-[0_0_20px_rgba(152,255,217,0.6)]">
                <Package className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1
              className={`text-2xl mb-1 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
            >
              Inventário e Investimento
            </h1>
            <p
              className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white/60' : 'text-[#001F3F]/60'}`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
            >
              Lista completa de componentes e custos
            </p>
          </div>
        )}

        {/* Categorias de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {categories.map((category, catIndex) => {
          const Icon = category.icon;
          const subtotal = calculateSubtotal(category.items);

          return (
            <div
              key={catIndex}
              className={`relative backdrop-blur-2xl rounded-[2rem] p-5 overflow-hidden transition-all duration-300 ${
                darkMode
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                  : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60 shadow-[0_8px_32px_rgba(0,31,63,0.12)]'
              }`}
            >
              {/* Efeito de brilho */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20"
                style={{ background: `radial-gradient(circle, ${category.color}, transparent)` }}
              />

              {/* Título da Categoria */}
              <div className="relative flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }}
                >
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h2
                  className={`text-base transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  {category.title}
                </h2>
              </div>

              {/* Lista de Itens */}
              <div className="relative space-y-2.5 mb-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`flex items-center justify-between backdrop-blur-sm rounded-xl p-3 transition-all duration-300 ${
                      darkMode
                        ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                        : 'bg-white/40 border border-white/40 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#98FFD9] shadow-[0_0_8px_#98FFD9]" />
                      <span
                        className={`text-sm transition-colors duration-300 ${darkMode ? 'text-white/90' : 'text-[#001F3F]'}`}
                        style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className={`text-sm transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                      style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                    >
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className={`relative pt-3 transition-colors duration-300 ${darkMode ? 'border-t border-white/20' : 'border-t border-[#001F3F]/20'}`}>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F]/70'}`}
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Subtotal:
                  </span>
                  <span
                    className="text-xl"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 900,
                      color: category.color,
                      textShadow: `0 0 20px ${category.color}80`,
                    }}
                  >
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Card de Protótipo Finalizado */}
        <div className={isDesktop ? "max-w-5xl mx-auto" : ""}>
        <div className={`relative backdrop-blur-2xl rounded-[2rem] p-6 border-2 border-[#98FFD9]/60 shadow-[0_0_40px_rgba(152,255,217,0.5)] overflow-hidden transition-all duration-300 ${
          darkMode
            ? 'bg-gradient-to-br from-[#98FFD9]/20 to-[#6EDDC4]/10'
            : 'bg-gradient-to-br from-[#98FFD9]/30 to-[#6EDDC4]/20'
        }`}>
          {/* Efeito de brilho externo forte */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#98FFD9] to-[#6EDDC4] rounded-[2rem] blur-xl opacity-30 animate-pulse" />

          <div className="relative">
            <h3
              className={`text-lg text-center mb-4 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
            >
              🏆 Protótipo Finalizado
            </h3>

            {/* Placeholder de Imagem */}
            <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-br from-white/20 to-white/10 border border-white/30'
                : 'bg-gradient-to-br from-white/40 to-white/20 border border-white/50'
            }`} style={{ aspectRatio: '16/10' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className={`w-16 h-16 mx-auto mb-2 transition-colors duration-300 ${darkMode ? 'text-white/40' : 'text-[#001F3F]/40'}`} strokeWidth={1.5} />
                  <p className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white/50' : 'text-[#001F3F]/50'}`} style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}>
                    Imagem do Protótipo
                    <br />
                    EcoIncubadora IoT
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p
                className={`text-xs leading-relaxed transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F]/70'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
              >
                Sistema completo de triagem automatizada
                <br />
                com monitoramento em tempo real
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* Banner de Total Geral - Dentro do Scroll */}
        <div className={`mt-6 mb-4 relative rounded-[2rem] border-2 border-[#98FFD9]/60 shadow-[0_0_40px_rgba(152,255,217,0.5)] backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          isDesktop ? 'max-w-5xl mx-auto' : ''
        } ${
          darkMode
            ? 'bg-gradient-to-r from-[#000C1A] via-[#001F3F] to-[#000C1A]'
            : 'bg-gradient-to-r from-white/80 via-white/60 to-white/80'
        }`}>
          {/* Efeito de brilho superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#98FFD9] to-transparent shadow-[0_0_20px_#98FFD9]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(152,255,217,0.1),transparent_70%)]" />

          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-xs mb-1 transition-colors duration-300 ${darkMode ? 'text-white/60' : 'text-[#001F3F]/60'}`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}
                >
                  INVESTIMENTO TOTAL
                </p>
                <p className={`text-[10px] transition-colors duration-300 ${darkMode ? 'text-white/40' : 'text-[#001F3F]/40'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
                  Todos os componentes incluídos
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-4xl leading-none"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #98FFD9, #6EDDC4, #44A6A0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 30px rgba(152,255,217,0.8))',
                  }}
                >
                  R$ {totalGeral.toFixed(2)}
                </div>
                <p className="text-[9px] text-[#98FFD9] mt-1" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                  Custo-benefício excepcional
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
