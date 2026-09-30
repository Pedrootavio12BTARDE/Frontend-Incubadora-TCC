import { BookOpen, ExternalLink, FileText, GraduationCap } from "lucide-react";

interface ReferencesScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function ReferencesScreen({ darkMode = false, isDesktop = false }: ReferencesScreenProps) {
  const references = [
    {
      title: "Desenvolvimento de um sistema automatizado para controle de aviários",
      authors: "Repositório IFRS",
      year: "2023",
      journal: "Instituto Federal do Rio Grande do Sul",
      description: "Propõe uma arquitetura aberta de hardware e software para monitorar variáveis ambientais e reduzir o estresse térmico em granjas.",
      url: "https://www.google.com/goto?url=CAESbQHrOzAVd3QKNgtyy-nIsDueLzjBrbH0Yco-2CQ5spZceYBlJCg2WFYhWluCffnFyaFjwXRn1bDeRNaiIKgzCuLR4Iu8iXG-i8HZZ-z9IOL9RVF_UPtkpvSzKf_cveC01XYQrrLGKiiDAyX3RmI",
      category: "Automação",
    },
    {
      title: "Sistemas automatizados de controle de gases e temperatura na avicultura",
      authors: "BDTD USP",
      year: "2022",
      journal: "Biblioteca Digital de Teses e Dissertações da USP",
      description: "Tese acadêmica que detalha o desenvolvimento e implementação de sistemas automatizados para controle de amônia, CO₂ e temperatura.",
      url: "https://www.google.com/goto?url=CAESfAHrOzAVZaUBkvzWkwsco9m8F_lU8toRcjgrtDqfgOuApJTwYQ4UwuksDmkxQBPPkU5SxIz23AhyCvePriWFLSZ7IRJUo4lEk5ZGefnlqKO2UvmvxOTvClNEaWws-yuTJUhO9pf4VaVgZJVqe5ahrOAEUdD5rVOs3pLQ7SM",
      category: "IoT",
    },
    {
      title: "Estudo do monitoramento automatizado de variáveis na avicultura",
      authors: "Repositório UERGS",
      year: "2023",
      journal: "Universidade Estadual do Rio Grande do Sul",
      description: "Aborda o uso de sensores de IoT para mitigar o desconforto térmico de lotes de aves provocado por extremos climáticos.",
      url: "https://www.google.com/goto?url=CAESgwEB6zswFaRQZ8E8n0rxTChKET8e6tMafKSVMfHs4bMDAJTmYMy87EOlY8VXtWxOiyFipM-jvhHXhz7IZCISrATPJifa5ez9RgoXVx5ImcYloEUe-6FtpakDmlHDRoLgyNRW4v7BdAaBVbfaqWVxpeiU8ZTpPD70r6zn6rVs3QqtUjwnBQ",
      category: "Sensores",
    },
    {
      title: "Automação na avicultura de corte: uso de visão computacional",
      authors: "Anais do CILAMCE",
      year: "2023",
      journal: "CILAMCE - Computação em Engenharia",
      description: "Demonstra o uso de inteligência artificial e visão computacional para identificação, monitoramento e predição de peso das aves.",
      url: "https://www.google.com/goto?url=CAESfwHrOzAVUDZ8csalScQy5Zku245zMx5OUFj6T9hPb0AnOXXJ1l3a83IyuBOk7CVTsZ3AKN6tcOiVwJWX6n8Ornv0FH8tPtQFF_9EtHva9vhdudV_LTcS2TKbrtl6iOrDBFha0M_5rAG2r5gW5YsHsh3Gsuj6zyK8Vr2SZwwoDFE",
      category: "Visão Comp.",
    },
    {
      title: "Monitoramento de avicultura a partir de variáveis climáticas",
      authors: "Repositório Unoeste",
      year: "2022",
      journal: "Universidade do Oeste Paulista",
      description: "Análise prática das respostas comportamentais das aves a partir do clima, validando impactos físicos no confinamento.",
      url: "https://www.google.com/goto?url=CAESeAHrOzAVNVd01jN5QXWACM6blkoOBPSNsK2A014tvVHT2j3hsFbI3zqefbUR4dE3dWKBmshrCLnq9elYkZvgd76UEfr5fTnzOxjD4dM4x2gSOiekWS6JYEwf106UfSMEq0-fz85HgUxzUuCZ-oW7MX3aM8h4lGZ9Lw",
      category: "Incubação",
    },
    {
      title: "Automação no manejo alimentar de animais de produção",
      authors: "Revista E-Ciência",
      year: "2023",
      journal: "Revista E-Ciência",
      description: "Explora o impacto da aplicação de engenharia na distribuição inteligente de ração para reduzir o desperdício em granjas.",
      url: "https://www.google.com/goto?url=CAEScwHrOzAVkwJGwhUaISoRtmLSRDxovvmPe6gq16ExfFNBa5nysXE9cjENL8jH7oSVurZVuHeaituVm9SY-9ekvwc9hpThBo1AOv2U1GpjUDQwWUE0eThVb8aoh9s3u6Bt3luX-obGRc624FbCypK1miPsJjU",
      category: "Hardware",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Automação: "#6EDDC4",
      IoT: "#98FFD9",
      Sensores: "#4ECDC4",
      "Visão Comp.": "#FF6B6B",
      Incubação: "#44A6A0",
      Hardware: "#FFE66D",
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