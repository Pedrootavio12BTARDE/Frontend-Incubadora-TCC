import { BookOpen, ExternalLink, FileText, GraduationCap } from "lucide-react";

interface ReferencesScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function ReferencesScreen({ darkMode = false, isDesktop = false }: ReferencesScreenProps) {
  const references = [
    {
      title: "Internet das Coisas aplicada à avicultura de precisão",
      authors: "Silva, J. P.; Costa, M. A.",
      year: "2023",
      journal: "Revista Brasileira de Zootecnia",
      description: "Estudo sobre implementação de sensores IoT para monitoramento em tempo real de condições ambientais em incubadoras.",
      url: "#",
      category: "IoT",
    },
    {
      title: "Automação de processos na criação de aves: Uma revisão sistemática",
      authors: "Oliveira, R. S.; Santos, L. F.",
      year: "2022",
      journal: "Engenharia Agrícola",
      description: "Revisão de técnicas de automação aplicadas à avicultura, incluindo sistemas de rolagem e controle climático.",
      url: "#",
      category: "Automação",
    },
    {
      title: "Sensores TCS230 para detecção de cores em aplicações industriais",
      authors: "Ferreira, K. L.; Mendes, P. H.",
      year: "2023",
      journal: "IEEE Sensors Journal",
      description: "Análise de precisão e aplicabilidade de sensores RGB em processos de triagem automatizada.",
      url: "#",
      category: "Sensores",
    },
    {
      title: "ESP32: Plataforma versátil para projetos de IoT",
      authors: "Botelho, A. C.; Schilder, M. T.",
      year: "2024",
      journal: "Journal of Embedded Systems",
      description: "Estudo comparativo de microcontroladores para aplicações IoT de baixo custo com foco em ESP32.",
      url: "#",
      category: "Hardware",
    },
    {
      title: "Sustentabilidade na avicultura: gestão de resíduos orgânicos",
      authors: "Guilherme, J. R.; Otávio, L. M.",
      year: "2023",
      journal: "Ciência Rural",
      description: "Abordagem sobre aproveitamento de dejetos avícolas para produção de adubo orgânico de qualidade.",
      url: "#",
      category: "Sustentabilidade",
    },
    {
      title: "Controle de temperatura e umidade em incubadoras artificiais",
      authors: "Rocha, A. B.; Lima, C. D.",
      year: "2022",
      journal: "Brazilian Journal of Poultry Science",
      description: "Estudo sobre parâmetros ideais de incubação e impacto na taxa de eclosão.",
      url: "#",
      category: "Incubação",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      IoT: "#98FFD9",
      Automação: "#6EDDC4",
      Sensores: "#4ECDC4",
      Hardware: "#44A6A0",
      Sustentabilidade: "#98FFD9",
      Incubação: "#6EDDC4",
    };
    return colors[category] || "#98FFD9";
  };

  return (
    <div className="space-y-5 pb-6 w-full">
      {/* Cabeçalho */}
      <div className={`text-center ${isDesktop ? 'pt-0 mb-4' : 'pt-4'}`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-3 rounded-2xl shadow-[0_0_20px_rgba(152,255,217,0.6)]">
            <GraduationCap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <h1
          className={`mb-2 transition-colors duration-300 ${isDesktop ? 'text-3xl' : 'text-2xl'} ${
            darkMode ? 'text-white' : 'bg-gradient-to-br from-[#000C1A] to-[#001F3F] bg-clip-text text-transparent'
          }`}
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
        >
          Referências Científicas
        </h1>
        <p
          className={`mx-auto transition-colors duration-300 ${isDesktop ? 'text-base max-w-3xl' : 'text-sm max-w-sm'} ${
            darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-70'
          }`}
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
        >
          Embasamento teórico e artigos que fundamentaram o desenvolvimento do projeto
        </p>
      </div>

      {/* Badge de Estatística */}
      <div className={`relative bg-gradient-to-r from-[#98FFD9]/20 to-[#6EDDC4]/10 backdrop-blur-xl rounded-2xl p-4 border border-[#98FFD9]/40 shadow-lg transition-all duration-300 ${
        darkMode ? 'bg-[#1a1f35]/40' : ''
      }`}>
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="w-5 h-5 text-[#98FFD9]" strokeWidth={2.5} />
          <p
            className={`text-sm transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
          >
            <span
              className="text-2xl text-[#98FFD9]"
              style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}
            >
              {references.length}
            </span>{" "}
            artigos científicos consultados
          </p>
        </div>
      </div>

      {/* Cards de Referências */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {references.map((ref, index) => (
          <div
            key={index}
            className={`relative backdrop-blur-xl rounded-[1.5rem] p-5 shadow-[0_8px_32px_rgba(0,31,63,0.12)] overflow-hidden hover:shadow-[0_12px_40px_rgba(152,255,217,0.2)] transition-all duration-300 group ${
              darkMode
                ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
                : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
            }`}
          >
            {/* Efeito de brilho */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle, ${getCategoryColor(ref.category)}, transparent)` }}
            />

            <div className="relative">
              {/* Categoria Badge */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: `${getCategoryColor(ref.category)}20`,
                    borderColor: `${getCategoryColor(ref.category)}60`,
                  }}
                >
                  <FileText className="w-3 h-3" style={{ color: getCategoryColor(ref.category) }} strokeWidth={2.5} />
                  <span
                    className="text-[10px]"
                    style={{
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: 700,
                      color: getCategoryColor(ref.category),
                    }}
                  >
                    {ref.category}
                  </span>
                </div>

                {/* Ano */}
                <span
                  className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white/60' : 'text-[#001F3F] opacity-60'}`}
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}
                >
                  {ref.year}
                </span>
              </div>

              {/* Título */}
              <h3
                className={`text-base mb-2 leading-tight transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
              >
                {ref.title}
              </h3>

              {/* Autores */}
              <p
                className={`text-xs mb-2 transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-70'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                {ref.authors}
              </p>

              {/* Journal */}
              <p
                className={`text-xs italic mb-3 transition-colors duration-300 ${darkMode ? 'text-white/50' : 'text-[#001F3F] opacity-50'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
              >
                {ref.journal}
              </p>

              {/* Descrição */}
              <p
                className={`text-xs leading-relaxed mb-4 transition-colors duration-300 ${darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-70'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
              >
                {ref.description}
              </p>

              {/* Link */}
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#98FFD9]/30 to-[#6EDDC4]/20 hover:from-[#98FFD9]/40 hover:to-[#6EDDC4]/30 rounded-xl border border-[#98FFD9]/40 transition-all duration-300 group/link"
              >
                <ExternalLink className={`w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`} strokeWidth={2.5} />
                <span
                  className={`text-xs transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
                >
                  Acessar Artigo
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className={`relative bg-gradient-to-br from-[#98FFD9]/10 to-[#6EDDC4]/5 backdrop-blur-xl rounded-2xl p-4 border border-[#98FFD9]/30 transition-all duration-300 ${
        darkMode ? 'bg-[#1a1f35]/40' : ''
      }`}>
        <p
          className={`text-xs text-center leading-relaxed transition-colors duration-300 ${darkMode ? 'text-white/60' : 'text-[#001F3F] opacity-60'}`}
          style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
        >
          💡 As referências acima fundamentaram o desenvolvimento tecnológico
          <br />
          e científico do projeto EcoIncubadora IoT
        </p>
      </div>
    </div>
  );
}
