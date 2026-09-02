/**
 * API Client Service
 * 
 * Centralized service for all backend API communication
 * Handles requests to the Express backend running on localhost:3001
 * 
 * Base URL uses the Vite proxy configured in vite.config.ts
 * /api/* requests are automatically proxied to http://localhost:3001/api/*
 */

const API_BASE_URL = '/api/v1';

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
// SENSOR ENDPOINTS
// ============================================================================

export interface SensorReading {
  id?: string;
  temperature: number;
  humidity: number;
  eggs?: number;
  fertilizer?: number;
  createdAt?: string;
}

/**
 * Get the latest sensor readings (temperature, humidity, eggs, fertilizer)
 */
export async function getLatestSensorReading(): Promise<SensorReading> {
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
  lamp?: boolean;
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

// ============================================================================
// PRODUCTION ENDPOINTS
// ============================================================================

export interface ProductionData {
  id?: string;
  eggsCount: number;
  lastColor?: string;
  updatedAt?: string;
}

/**
 * Get current egg production count
 */
export async function getProduction(): Promise<ProductionData> {
  return fetchAPI<ProductionData>('/production');
}

/**
 * Increment egg count
 * @param amount - Number of eggs to add
 * @param color - Color/type classification (e.g., "Marrom", "Branco")
 */
export async function incrementProduction(
  amount: number = 1,
  color?: string
): Promise<{ success: boolean; newCount: number; color: string }> {
  return fetchAPI('/production/increment', {
    method: 'POST',
    body: JSON.stringify({ amount, color }),
  });
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token?: string;
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
  if (response.token) {
    localStorage.setItem('authToken', response.token);
  }

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
