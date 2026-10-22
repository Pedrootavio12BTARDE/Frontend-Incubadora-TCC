/**
 * API Client Service
 * 
 * Centralized service for all backend API communication
 * Handles requests to the Express backend running on localhost:3001
 * 
 * Base URL uses the Vite proxy configured in vite.config.ts
 * /api/* requests are automatically proxied to http://localhost:3001/api/*
 * 
 * In production, uses VITE_BACKEND_URL environment variable
 */

const getAPIBaseURL = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_BACKEND_URL) {
    return `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '')}/api/v1`;
  }
  return '/api/v1';
};

const API_BASE_URL = getAPIBaseURL();

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed (${url}):`, error);
    throw error;
  }
}

// ============================================================================
export async function sendContactMessage(data: { name: string; email: string; message: string }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(typeof result.error === 'string' ? result.error : 'Nao foi possivel enviar sua mensagem. Tente novamente.');
  }
}
export interface ThermalSafetyStatus {
  protected: boolean;
  state: 'CRITICAL_OVERHEAT' | 'THERMAL_PROTECTION_CLEARED' | null;
  temperature: number | null;
  deviceId: string | null;
  updatedAt: string | null;
}

export async function getThermalSafetyStatus(): Promise<ThermalSafetyStatus> {
  return fetchAPI<ThermalSafetyStatus>('/devices/safety-status');
}
export interface DeviceStatus {
  deviceId: string | null;
  online: boolean;
  lastSeenAt: string | null;
}

export async function getDeviceStatus(): Promise<DeviceStatus> {
  return fetchAPI<DeviceStatus>('/devices/status');
}
// SENSOR ENDPOINTS
// ============================================================================

export interface SensorReading {
  id?: number;
  temperature?: number | null;
  humidity?: number | null;
  soilHumidity?: number | null;
  eggs?: number | null;
  fertilizer?: number | null;
  createdAt?: string;
  temperatureCreatedAt?: string | null;
  humidityCreatedAt?: string | null;
  soilHumidityCreatedAt?: string | null;
}

/**
 * Get the latest sensor readings (temperature, humidity, eggs, fertilizer)
 */
export async function getLatestSensorReading(): Promise<SensorReading | null> {
  return fetchAPI<SensorReading>('/sensors/latest');
}

/**
 * Send sensor data from ESP32 to backend
 * The backend will validate, save to database, and emit Socket.io event
 */
export async function sendSensorData(data: SensorReading): Promise<SensorReading> {
  return fetchAPI<SensorReading>('/sensors/data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================================================
// ACTUATOR ENDPOINTS
// ============================================================================

export interface ActuatorStatus {
  lamp?: boolean | 'on' | 'off' | 'unknown';
  fan?: 'on' | 'off' | 'auto';
  lastUpdated?: string;
}

/**
 * Get current status of lamp and fan
 */
export async function getActuatorStatus(): Promise<ActuatorStatus> {
  return fetchAPI<ActuatorStatus>('/actuators/status');
}

/**
 * Control the heating lamp
 * @param on - true to turn on, false to turn off
 */
export async function setLamp(on: boolean): Promise<{ success: boolean; lamp: boolean }> {
  return fetchAPI('/actuators/lamp', {
    method: 'PATCH',
    body: JSON.stringify({ on }),
  });
}

/**
 * Control the ventilator fan
 * @param state - 'on', 'off', or 'auto'
 */
export async function setFan(state: 'on' | 'off' | 'auto'): Promise<{ success: boolean; fan: string }> {
  return fetchAPI('/actuators/fan', {
    method: 'PATCH',
    body: JSON.stringify({ state }),
  });
}

export async function rotateMotor(durationMs: number = 1500): Promise<{
  ok: boolean;
  command: { id: number; durationMs: number; status: string };
}> {
  return fetchAPI('/actuators/motor/rotate', {
    method: 'POST',
    body: JSON.stringify({ durationMs }),
  });
}

export interface MotorMode {
  autoRoll: boolean;
  intervalHours: number;
}

export async function getMotorMode(): Promise<MotorMode> {
  return fetchAPI<MotorMode>('/actuators/motor/mode');
}

export async function setMotorAutoMode(autoRoll: boolean): Promise<MotorMode> {
  return fetchAPI<MotorMode>('/actuators/motor/mode', {
    method: 'PATCH',
    body: JSON.stringify({ autoRoll }),
  });
}
// ============================================================================
// PRODUCTION ENDPOINTS
// ============================================================================

export interface ProductionData {
  id?: number;
  eggs?: number;
  eggsCount: number;
  whiteEggs: number;
  brownEggs: number;
  lastColor: string | null;
  updatedAt?: string;
}

const LOCAL_STORAGE_PROD_KEY = 'ecoincubadora_production';

/**
 * Retorna dados de produção salvos localmente no navegador (fallback offline)
 */
export function getLocalProduction(): ProductionData {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROD_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.whiteEggs === 'number' && typeof parsed.brownEggs === 'number') {
        const white = Math.max(0, parsed.whiteEggs);
        const brown = Math.max(0, parsed.brownEggs);
        return {
          eggsCount: white + brown,
          whiteEggs: white,
          brownEggs: brown,
          lastColor: parsed.lastColor ?? (brown > 0 ? 'Marrom' : 'Branco'),
          updatedAt: parsed.updatedAt,
        };
      }
    }
  } catch (e) {
    // ignore
  }
  return {
    eggsCount: 245,
    whiteEggs: 140,
    brownEggs: 105,
    lastColor: 'Marrom',
  };
}

/**
 * Salva e sincroniza dados de produção localmente e notifica ouvintes
 */
export function saveLocalProduction(data: Partial<ProductionData>): ProductionData {
  const current = getLocalProduction();
  const white = typeof data.whiteEggs === 'number' ? Math.max(0, data.whiteEggs) : current.whiteEggs;
  const brown = typeof data.brownEggs === 'number' ? Math.max(0, data.brownEggs) : current.brownEggs;
  const total = white + brown;
  const lastColor = data.lastColor ?? (
    data.whiteEggs !== undefined && data.whiteEggs > current.whiteEggs
      ? 'Branco'
      : data.brownEggs !== undefined && data.brownEggs > current.brownEggs
      ? 'Marrom'
      : current.lastColor
  );

  const updated: ProductionData = {
    ...current,
    eggs: total,
    eggsCount: total,
    whiteEggs: white,
    brownEggs: brown,
    lastColor,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_PROD_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('production:local_update', { detail: updated }));
    }
  } catch (e) {
    // ignore
  }

  return updated;
}

/**
 * Get current egg production count
 */
export async function getProduction(): Promise<ProductionData> {
  try {
    const data = await fetchAPI<ProductionData>('/production');
    if (data && (typeof data.whiteEggs === 'number' || typeof data.brownEggs === 'number')) {
      return saveLocalProduction(data);
    }
  } catch {
    // Backend offline ou indisponível - usa persistência local
  }
  return getLocalProduction();
}

/**
 * Define diretamente a quantidade de ovos brancos e marrons
 */
export async function setProduction(data: {
  whiteEggs: number;
  brownEggs: number;
  lastColor?: string | null;
}): Promise<ProductionData> {
  const local = saveLocalProduction(data);
  try {
    const res = await fetchAPI<ProductionData>('/production/set', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  } catch {
    return local;
  }
}

/**
 * Increment egg count
 * @param amount - Number of eggs to add
 * @param color - Color/type classification (e.g., "Marrom", "Branco")
 */
export async function incrementProduction(
  amount: number = 1,
  color: 'Branco' | 'Marrom'
): Promise<ProductionData & { success: boolean; newCount: number }> {
  try {
    const result = await fetchAPI<ProductionData & { success: boolean; newCount: number }>('/production/increment', {
      method: 'POST',
      body: JSON.stringify({ amount, color }),
    });
    saveLocalProduction(result);
    return result;
  } catch {
    const current = getLocalProduction();
    const isWhite = color === 'Branco';
    const updated = saveLocalProduction({
      whiteEggs: current.whiteEggs + (isWhite ? amount : 0),
      brownEggs: current.brownEggs + (!isWhite ? amount : 0),
      lastColor: color,
    });
    return {
      ...updated,
      success: true,
      newCount: updated.eggsCount,
    };
  }
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

const AUTH_USER_KEY = 'authUser';

function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getStoredAuthUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    return saved ? JSON.parse(saved) as AuthUser : null;
  } catch {
    return null;
  }
}

export async function refreshProfile(): Promise<AuthUser> {
  const response = await fetchAPI<{ user: AuthUser }>('/auth/profile');
  saveAuthUser(response.user);
  return response.user;
}

export async function updateProfile(profile: { name: string; avatar: string | null }): Promise<AuthUser> {
  const response = await fetchAPI<{ user: AuthUser }>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(profile),
  });
  saveAuthUser(response.user);
  return response.user;
}

/**
 * Login with email and password
 * Returns JWT token for subsequent authenticated requests
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetchAPI<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Store token in localStorage if successful
  localStorage.setItem('authToken', response.token);
  saveAuthUser(response.user);

  return response;
}

export async function register(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetchAPI<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('authToken', response.token);
  saveAuthUser(response.user);
  return response;
}

/**
 * Get current auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Clear auth token from localStorage (logout)
 */
export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Add auth token to request headers
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================================
// REPORTS ENDPOINTS
// ============================================================================

export interface SensorHistory {
  readings: SensorReading[];
  count: number;
}

/**
 * Get historical sensor data (last 100 readings by default)
 */
export async function getSensorHistory(): Promise<SensorHistory> {
  return fetchAPI<SensorHistory>('/reports/history');
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if backend server is running
 */
export async function checkBackendHealth(): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>('/status');
}
