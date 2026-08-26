import { Instagram, Linkedin, Mail, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

interface AboutScreenProps {
  darkMode?: boolean;
  isDesktop?: boolean;
}

export function AboutScreen({ darkMode = false, isDesktop = false }: AboutScreenProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const team = [
    {
      name: "Pedro Otávio",
      role: "Engenheiro de Sistemas",
      description: "Especialista em IoT e arquitetura de soluções embarcadas",
    },
    {
      name: "Ana Botelho",
      role: "Desenvolvedora Full Stack",
      description: "Desenvolvimento do dashboard e integração de sistemas",
    },
    {
      name: "Kauan Ferreira",
      role: "Designer UX/UI",
      description: "Criação da identidade visual e experiência do usuário",
    },
    {
      name: "Maria Schilder",
      role: "Engenheira de Automação",
      description: "Sistema mecânico de triagem e rolagem automatizada",
    },
    {
      name: "Luiz Otávio",
      role: "Analista de Dados",
      description: "Análise de dados e otimização de processos IoT",
    },
    {
      name: "José Guilherme",
      role: "Engenheiro Eletrônico",
      description: "Desenvolvimento de hardware e circuitos embarcados",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contato enviado:", { name, message });
    setName("");
    setMessage("");
  };

  return (
    <div className="space-y-5 pb-6 w-full">
      {/* Cabeçalho - Only show on mobile */}
      {!isDesktop && (
        <div className="text-center pt-4">
          <h1
            className={`text-2xl mb-2 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'bg-gradient-to-br from-[#000C1A] to-[#001F3F] bg-clip-text text-transparent'
            }`}
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
          >
            Quem Somos
          </h1>
          <p
            className={`text-sm max-w-sm mx-auto transition-colors duration-300 ${
              darkMode ? 'text-white/70' : 'text-[#001F3F] opacity-70'
            }`}
            style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
          >
            Equipe multidisciplinar dedicada à inovação na avicultura sustentável
          </p>
        </div>
      )}

      {/* Cards da Equipe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((member, index) => (
          <div
            key={index}
            className={`relative backdrop-blur-[20px] rounded-[1.5rem] p-5 shadow-[0_8px_32px_rgba(0,31,63,0.12)] overflow-hidden transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20 hover:bg-[#1a1f35]/90'
                : 'bg-white/60 border border-white/60 hover:bg-white/70'
            }`}
          >
            {/* Efeito de brilho */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#98FFD9]/10 rounded-full blur-3xl" />

            <div className="relative">
              {/* Avatar placeholder */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(152,255,217,0.4)]">
                <span
                  className="text-2xl text-white"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900 }}
                >
                  {member.name.charAt(0)}
                </span>
              </div>

              {/* Nome e Cargo */}
              <h3
                className="text-lg text-[#98FFD9] mb-1"
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
              >
                {member.name}
              </h3>
              <p
                className={`text-sm mb-2 transition-colors duration-300 ${darkMode ? 'text-white/80' : 'text-[#001F3F]/80'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
              >
                {member.role}
              </p>

              {/* Descrição */}
              <p
                className={`text-xs leading-relaxed mb-4 transition-colors duration-300 ${
                  darkMode ? 'text-white/70' : 'text-[#001F3F]/70'
                }`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
              >
                {member.description}
              </p>

              {/* Ícones Sociais */}
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-[#98FFD9]/20 rounded-full hover:bg-[#98FFD9]/30 transition-all duration-300 border border-[#98FFD9]/40 hover:scale-110">
                  <Instagram className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
                </button>
                <button className="p-2.5 bg-[#98FFD9]/20 rounded-full hover:bg-[#98FFD9]/30 transition-all duration-300 border border-[#98FFD9]/40 hover:scale-110">
                  <Linkedin className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
                </button>
                <button className="p-2.5 bg-[#98FFD9]/20 rounded-full hover:bg-[#98FFD9]/30 transition-all duration-300 border border-[#98FFD9]/40 hover:scale-110">
                  <MessageCircle className="w-4 h-4 text-[#98FFD9]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulário de Contato */}
      <div className="pt-2 max-w-3xl mx-auto w-full">
        <div className={`relative backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_32px_rgba(0,31,63,0.12)] overflow-hidden transition-all duration-300 ${
          darkMode
            ? 'bg-gradient-to-br from-[#1a1f35]/80 to-[#0d1425]/60 border border-[#98FFD9]/20'
            : 'bg-gradient-to-br from-white/60 to-white/30 border border-white/60'
        }`}>
          {/* Efeito de brilho */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#98FFD9]/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-[#98FFD9] to-[#6EDDC4] p-2 rounded-xl shadow-lg">
                <Mail className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h3
                className={`transition-colors duration-300 ${isDesktop ? 'text-xl' : 'text-base'} ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}
              >
                Fale Conosco
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Input Nome */}
              <div>
                <label
                  className={`block text-sm mb-1.5 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className={`w-full backdrop-blur-sm border-2 border-[#98FFD9]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#98FFD9] transition-all duration-300 ${
                    darkMode
                      ? 'bg-[#1a1f35]/60 text-white placeholder:text-white/40'
                      : 'bg-white/60 text-[#001F3F] placeholder:text-[#001F3F]/40'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                />
              </div>

              {/* Textarea Mensagem */}
              <div>
                <label
                  className={`block text-sm mb-1.5 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-[#001F3F]'}`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                >
                  Sua Mensagem
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  required
                  rows={4}
                  className={`w-full backdrop-blur-sm border-2 border-[#98FFD9]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#98FFD9] transition-all duration-300 resize-none ${
                    darkMode
                      ? 'bg-[#1a1f35]/60 text-white placeholder:text-white/40'
                      : 'bg-white/60 text-[#001F3F] placeholder:text-[#001F3F]/40'
                  }`}
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 500 }}
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                className="w-full relative bg-[#98FFD9] text-[#001F3F] py-3 rounded-xl shadow-[0_8px_24px_rgba(152,255,217,0.4)] hover:shadow-[0_12px_32px_rgba(152,255,217,0.5)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group hover:bg-[#6EDDC4]"
              >
                <Send className="relative w-4 h-4" strokeWidth={2.5} />
                <span
                  className="relative text-sm tracking-wide"
                  style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 800 }}
                >
                  ENVIAR
                </span>
              </button>
            </form>
          </div>
        </div>

        <p className={`text-center text-[9px] mt-3 transition-colors duration-300 ${darkMode ? 'text-white/40' : 'text-[#001F3F] opacity-40'}`} style={{ fontFamily: 'Quicksand, sans-serif' }}>
          Responderemos em até 24 horas
        </p>
      </div>
    </div>
  );
}
