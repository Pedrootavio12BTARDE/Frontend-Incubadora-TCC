/**
 * GUIA DE INTEGRAÇÃO: Frontend ↔ Backend (Socket.io + REST API)
 * 
 * Este arquivo documenta como usar o sistema de comunicação em tempo real
 * entre o frontend React e o backend Node.js/Express.
 * 
 * Arquivos principais:
 * - src/services/api.ts: Cliente REST para chamadas HTTP
 * - src/services/socketio.ts: Cliente Socket.io para comunicação em tempo real
 * - src/hooks/useSocket.ts: Hook React para simplificar integração Socket.io
 * 
 * ============================================================================
 * 1. CHAMADAS REST (API HTTP)
 * ============================================================================
 * 
 * Para fazer requisições simples ao backend (sem tempo real):
 * 
 * import { getLatestSensorReading, setLamp, incrementProduction } from '@/services/api';
 * 
 * // Exemplo 1: Pegar leitura de sensor
 * try {
 *   const sensor = await getLatestSensorReading();
 *   console.log(`Temperatura: ${sensor.temperature}°C`);
 * } catch (error) {
 *   console.error('Erro:', error);
 * }
 * 
 * // Exemplo 2: Controlar lâmpada
 * await setLamp(true); // Liga a lâmpada
 * await setLamp(false); // Desliga a lâmpada
 * 
 * // Exemplo 3: Incrementar produção
 * await incrementProduction(1, 'Marrom');
 * 
 * ============================================================================
 * 2. EVENTOS SOCKET.IO EM TEMPO REAL
 * ============================================================================
 * 
 * Para receber atualizações em tempo real do backend via WebSocket:
 * 
 * import { useSocket } from '@/hooks/useSocket';
 * 
 * export function MyComponent() {
 *   // Ouve eventos 'sensor:update' em tempo real
 *   const { data, isConnected, error } = useSocket('sensor:update');
 * 
 *   if (!isConnected) return <div>Desconectado...</div>;
 *   if (error) return <div>Erro: {error.message}</div>;
 *   if (!data) return <div>Aguardando dados...</div>;
 * 
 *   return (
 *     <div>
 *       <p>Temperatura: {data.temperature}°C</p>
 *       <p>Umidade: {data.humidity}%</p>
 *     </div>
 *   );
 * }
 * 
 * ============================================================================
 * 3. EVENTOS SOCKET.IO DISPONÍVEIS
 * ============================================================================
 * 
 * O backend emite os seguintes eventos que o frontend pode ouvir:
 * 
 * a) 'sensor:update' - Novo leitura de sensor
 *    Dados recebidos:
 *    {
 *      temperature: number,
 *      humidity: number,
 *      eggs?: number,
 *      fertilizer?: number,
 *      createdAt: string (ISO datetime)
 *    }
 * 
 * b) 'actuator:update' - Mudança no estado de um atuador
 *    Dados recebidos:
 *    {
 *      actuator: 'lamp' | 'fan',
 *      state: boolean | string, // true/false para lamp, 'on'/'off'/'auto' para fan
 *      timestamp: string (ISO datetime)
 *    }
 * 
 * c) 'production:update' - Novo ovo coletado
 *    Dados recebidos:
 *    {
 *      eggsCount: number,
 *      color: string,
 *      updatedAt: string (ISO datetime)
 *    }
 * 
 * d) 'welcome' - Mensagem inicial de conexão
 *    Dados recebidos:
 *    {
 *      message: string,
 *      timestamp: string
 *    }
 * 
 * ============================================================================
 * 4. EXEMPLO PRÁTICO: Dashboard em Tempo Real
 * ============================================================================
 * 
 * import { useSocket } from '@/hooks/useSocket';
 * import { setLamp, incrementProduction } from '@/services/api';
 * 
 * export function Dashboard() {
 *   // Ouve 3 eventos simultaneamente
 *   const { data: sensorData } = useSocket('sensor:update');
 *   const { data: actuatorData } = useSocket('actuator:update');
 *   const { data: productionData } = useSocket('production:update');
 *   const { isConnected } = useSocket('connected');
 * 
 *   const handleLampClick = async () => {
 *     await setLamp(true);
 *     // Não precisa fazer setState - o Socket.io vai emitir 'actuator:update'
 *     // e atualizar automaticamente via useSocket
 *   };
 * 
 *   const handleCollectEgg = async () => {
 *     await incrementProduction(1, 'Marrom');
 *     // Socket.io emitirá 'production:update' automaticamente
 *   };
 * 
 *   return (
 *     <div>
 *       <p>Status: {isConnected ? '🟢 Online' : '🔴 Offline'}</p>
 *       
 *       {sensorData && (
 *         <div>
 *           <p>🌡️ {sensorData.temperature}°C</p>
 *           <p>💧 {sensorData.humidity}%</p>
 *         </div>
 *       )}
 *       
 *       <button onClick={handleLampClick}>Ligar Lâmpada</button>
 *       <button onClick={handleCollectEgg}>Coletar Ovo</button>
 *     </div>
 *   );
 * }
 * 
 * ============================================================================
 * 5. FLUXO DE DADOS COMPLETO (ESP32 → Backend → Frontend)
 * ============================================================================
 * 
 * ESP32 (Sensor):
 *   1. Lê dados do sensor (temperatura, umidade)
 *   2. Envia POST /api/v1/sensors/data
 *   ↓
 * Backend (Express):
 *   3. Recebe os dados
 *   4. Valida e salva no banco de dados
 *   5. Emite Socket.io event 'sensor:update' para TODOS os clientes conectados
 *   ↓
 * Frontend (React):
 *   6. Hook useSocket('sensor:update') recebe os dados
 *   7. Componentes atualizam automaticamente em tempo real
 *   8. Usuário vê dashboard atualizado instantaneamente ⚡
 * 
 * ============================================================================
 * 6. CONEXÃO E CICLO DE VIDA
 * ============================================================================
 * 
 * Conexão automática:
 * - useSocket automaticamente conecta ao backend na primeira chamada
 * - useSocket pode ser chamado varias vezes em diferentes componentes
 * - A conexão Socket.io é compartilhada (singleton)
 * 
 * Desconexão:
 * - Automática quando o último componente com useSocket é desmontado
 * - Ou manualmente: useSocketConnection().disconnect()
 * 
 * Reconexão:
 * - Socket.io reconecta automaticamente se perder conexão
 * - Configurable em src/services/socketio.ts (reconnectionAttempts, etc)
 * 
 * ============================================================================
 * 7. TRATAMENTO DE ERROS
 * ============================================================================
 * 
 * import { useSocket } from '@/hooks/useSocket';
 * 
 * export function MyComponent() {
 *   const { data, isConnected, error } = useSocket('sensor:update');
 * 
 *   if (error) {
 *     return <div className=\"error\">Erro de conexão: {error.message}</div>;
 *   }
 * 
 *   if (!isConnected) {
 *     return <div className=\"warning\">Aguardando conexão...</div>;
 *   }
 * 
 *   return <div>Dados: {JSON.stringify(data)}</div>;
 * }
 * 
 * ============================================================================
 * 8. CONFIGURAÇÃO DO PROXY VITE
 * ============================================================================
 * 
 * O arquivo vite.config.ts já está configurado com proxy para /api:
 * 
 * server: {
 *   proxy: {
 *     '/api': {
 *       target: 'http://localhost:3001',
 *       changeOrigin: true,
 *     },
 *   },
 * }
 * 
 * Isso significa:
 * - Frontend em http://localhost:5173 pode chamar /api/*
 * - Vite automaticamente roteia para http://localhost:3001/api/*
 * - Socket.io conecta direto a http://localhost:3001
 * 
 * ============================================================================
 * 9. TESTANDO A INTEGRAÇÃO
 * ============================================================================
 * 
 * Terminal 1 - Backend:
 * $ cd backend
 * $ npm run dev
 * Backend rodando em http://localhost:3001
 * 
 * Terminal 2 - Frontend:
 * $ npm run dev
 * Frontend rodando em http://localhost:5173
 * 
 * Testar com curl (Terminal 3):
 * 
 * # Enviar dado de sensor (vai emitir 'sensor:update' via Socket.io)
 * $ curl -X POST http://localhost:3001/api/v1/sensors/data \\
 *   -H "Content-Type: application/json" \\
 *   -d '{"temperature": 38.5, "humidity": 75}'
 * 
 * # Ver o dashboard React atualizar em tempo real! ⚡
 * 
 * ============================================================================
 * 10. PRÓXIMOS PASSOS
 * ============================================================================
 * 
 * ✅ Proxy Vite configurado
 * ✅ Serviço de API REST criado
 * ✅ Socket.io integrado
 * ✅ Hooks React para Socket.io criados
 * ✅ IncubationCard integrado com Socket.io
 * ✅ ProductionCard integrado com Socket.io
 * 
 * Próximos:
 * □ Integrar LoginScreen com API /auth/login
 * □ Integrar ReportsScreen com /reports/history
 * □ Testar com backend rodando
 * □ Testar com ESP32 enviando dados reais
 * □ Deploy em produção
 * 
 */

// Este arquivo é apenas documentação. Para usar as funcionalidades,
// importe dos arquivos reais:
// - import { ... } from '@/services/api';
// - import { ... } from '@/services/socketio';
// - import { useSocket } from '@/hooks/useSocket';
