🎨 Diretrizes Globais de Design (Válidas para Ambas as Páginas)
Tema Visual: Modo escuro (Dark Mode) industrial, limpo e tecnológico. Fundo principal em azul-escuro profundo (#0a1628 ou #0d1d35).

Cores de Destaque: Detalhes, botões ativos, links e bordas finas utilizando Ciano Neon (#00d4ff) e Verde-Menta para criar um efeito de iluminação (glow) de alta tecnologia. Texto principal em branco puro e subtextos em cinza-claro para excelente contraste.

Tipografia: Títulos impactantes e modernos em fonte geométrica (ex: Inter, Syne ou Plus Jakarta Sans, Bold/Extrabold). Textos de apoio altamente legíveis em Inter (Regular/Medium).

Layout: Uso de Bento Grids (caixas modulares) com cantos arredondados (16px), espaçamentos generosos (white space) para evitar poluição visual e layouts 100% responsivos (Desktop e Mobile).

📄 PÁGINA 1: Home Page Pública (Apresentação de Marketing)
Esta página é a porta de entrada do site. O objetivo é apresentar o projeto e direcionar o usuário para o sistema.

1. Barra de Navegação (Header)
Esquerda: Logotipo minimalista + Nome "EcoIncubadora IoT".

Centro: Links simples: Funcionalidades, Como Funciona, Sustentabilidade.

Direita: Botão de Ação (CTA) principal preenchido em Ciano Neon com texto em caixa alta: "ACESSAR PAINEL".

2. Seção Hero (Abertura de Impacto)
Coluna 1 (Texto - Esquerda): * Tagline: "AGRICULTURA 4.0 ACESSÍVEL" em ciano.

Título Principal: "Automação Inteligente que Transforma a Avicultura Familiar."

Subtítulo: "Uma incubadora artificial de baixo custo com monitoramento em tempo real, triagem automatizada e controle climático rigoroso para garantir a máxima taxa de eclosão."

Botões: Botão principal ciano "Entrar no Sistema" e botão secundário vazado "Conhecer Tecnologia".

Coluna 2 (Imagem/Mockup - Direita): Um mockup de um smartphone flutuante mostrando uma prévia da interface do Dashboard interno (Página 2), com um leve brilho neon nas bordas.

3. Grade de Funcionalidades (Recursos Técnicos)
Layout em grade de 4 cartões (Cards) independentes com fundo ligeiramente mais claro (#112540):

Card 1: Controle Climático Autônomo – Ícone de termômetro. Explicação sobre a leitura estável com sensor DHT22 e acionamento automático de aquecimento/resfriamento via relé.

Card 2: Rolagem Periódica – Ícone de engrenagem em rotação. Detalhes sobre o sistema com servo motor que vira os ovos a cada 4 horas de forma 100% automatizada.

Card 3: Triagem Inteligente – Ícone de scanner/cor. Explicação sobre o sensor infravermelho de contagem e o sensor TCS230 para classificação colorimétrica automática.

Card 4: Impacto Sustentável – Ícone de folha. Monitoramento do coletor de resíduos orgânicos para adubo e a viabilidade do hardware livre de baixo custo.

4. Seção "Como Funciona" (O Fluxo de Dados)
Uma linha do tempo horizontal ou passos visuais enumerados de 1 a 3:

Leitura Local: Os sensores capturam o clima interno da incubadora a cada milissegundo.

Sincronização: O microcontrolador ESP32 envia os dados via Wi-Fi de forma segura para a nuvem.

Controle Remoto: O produtor monitora gráficos, relatórios e alertas de qualquer lugar pelo celular.

📄 PÁGINA 2: Painel de Controle Dedicado (Dashboard Interno)
Esta página é aberta exclusivamente quando o usuário clica em "Acessar Painel". É uma interface puramente focada em dados IoT em tempo real.

1. Header do Painel (Barra de Topo Restrita)
Esquerda: Nome "EcoIncubadora" + Indicador de status de rede: um círculo verde brilhante ao lado do texto "ESP32 Conectado via Wi-Fi".

Direita: Ícone de Modo Noturno/Claro (Sol/Lua) e um avatar/ícone de configurações de usuário.

2. Módulo de Produção e Triagem (Destaque Superior)
Design: Um card horizontal largo de visual amigável e limpo.

Elementos:

Ilustração vetorial minimalista de uma galinha à esquerda.

Contador Central: Texto com o número "245" em tamanho gigante com a legenda abaixo: "ovos coletados".

Selo de Cor (Sensor TCS230): Um pequeno indicador arredondado com uma esfera marrom ao lado do texto: "Última triagem: Marrom".

3. Módulo de Incubação Climática (Sensores DHT22)
Barra de Controle: Uma linha horizontal contendo o ícone de uma lâmpada e o texto "Lâmpada de Aquecimento", finalizando com um botão interruptor (Toggle Switch) ligado.

Sub-Grid de Clima: Dois cards quadrados simétricos posicionados lado a lado:

Card Temperatura: Ícone de termômetro laranja. Valor central grande: "37.8°C". Legenda inferior: "Temperatura ideal".

Card Umidade: Ícone de gota de água ciano. Valor central grande: "60%". Legenda inferior: "Umidade estável".

4. Módulo de Sustentabilidade (Gestão de Resíduos)
Design: Card focado no reaproveitamento ecológico da incubadora.

Elementos:

Ícone de folha verde com o título "Nível do Coletor de Adubo".

Barra de Progresso: Uma linha horizontal com preenchimento em gradiente verde-menta indicando visualmente o volume acumulado.

Métrica de Porcentagem: Texto no canto direito exibindo "75%" da capacidade total preenchida.

5. Rodapé de Ações Rápidas (Controle Manual)
Botão Principal (Ciano Preenchido): Botão largo com o ícone de reciclagem/rotação e o texto "Ativar Rolagem Manual" (para forçar o movimento do servo motor).

Botão Secundário (Outline/Vazado): Botão escrito "Ver Relatórios Históricos e Gráficos" para abrir a seção de histórico de dados.