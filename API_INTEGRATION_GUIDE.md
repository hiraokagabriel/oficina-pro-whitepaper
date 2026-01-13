# 🔗 GUIA DE INTEGRAÇÃO - Frontend ⇔ Backend

## 🎯 OBJETIVO

Este guia mostra como conectar o frontend React com o backend Node.js, substituindo o IndexedDB por chamadas de API.

---

## 📚 ÍNDICE

1. [Configuração Inicial](#configuração-inicial)
2. [API Service Layer](#api-service-layer)
3. [Axios Interceptors](#axios-interceptors)
4. [Adaptar DatabaseContext](#adaptar-databasecontext)
5. [Exemplo Prático](#exemplo-prático)
6. [Error Handling](#error-handling)
7. [Loading States](#loading-states)

---

## 1️⃣ CONFIGURAÇÃO INICIAL

### **Instalar Axios:**

```bash
npm install axios
```

### **Criar arquivo de configuração:**

**Arquivo:** `src/services/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (adicionar JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (tratamento de erros)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se 401, fazer logout
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
```

### **Configurar variável de ambiente:**

**Arquivo:** `.env`

```env
VITE_API_URL=http://localhost:3333/api/v1
```

---

## 2️⃣ API SERVICE LAYER

### **Estrutura:**

```
src/services/
├── api.ts              # Axios instance
├── auth.service.ts    # Autenticação
├── client.service.ts  # Clientes
├── vehicle.service.ts # Veículos
├── workOrder.service.ts # Ordens de serviço
├── ledger.service.ts  # Financeiro
└── types.ts           # TypeScript types
```

### **Exemplo: auth.service.ts**

```typescript
import { api } from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'MANAGER' | 'MECHANIC' | 'RECEPTIONIST';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
```

### **Exemplo: client.service.ts**

```typescript
import { api } from './api';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  email?: string;
  phone: string;
  cpf?: string;
  address?: string;
  notes?: string;
}

export interface ListClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const clientService = {
  async list(params?: ListClientsParams) {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/clients/${id}`);
    return response.data.data;
  },

  async create(data: CreateClientData) {
    const response = await api.post('/clients', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateClientData>) {
    const response = await api.put(`/clients/${id}`, data);
    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(`/clients/${id}`);
  },

  async getStatistics() {
    const response = await api.get('/clients/statistics');
    return response.data.data;
  },
};
```

### **Exemplo: workOrder.service.ts**

```typescript
import { api } from './api';

export interface WorkOrderItem {
  type: 'SERVICE' | 'PART';
  description: string;
  quantity: number;
  unitPrice: number;
  serviceId?: string;
  partId?: string;
}

export interface CreateWorkOrderData {
  clientId: string;
  vehicleId?: string;
  vehicleDesc: string;
  status?: 'ESTIMATE' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  publicNotes?: string;
  internalNotes?: string;
  assignedToId?: string;
  items?: WorkOrderItem[];
}

export interface ListWorkOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  clientId?: string;
  assignedToId?: string;
  priority?: string;
}

export const workOrderService = {
  async list(params?: ListWorkOrdersParams) {
    const response = await api.get('/work-orders', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/work-orders/${id}`);
    return response.data.data;
  },

  async create(data: CreateWorkOrderData) {
    const response = await api.post('/work-orders', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateWorkOrderData>) {
    const response = await api.put(`/work-orders/${id}`, data);
    return response.data.data;
  },

  async updateStatus(
    id: string,
    status: string,
    reason?: string
  ) {
    const response = await api.patch(`/work-orders/${id}/status`, {
      status,
      reason,
    });
    return response.data.data;
  },

  async addItem(id: string, item: WorkOrderItem) {
    const response = await api.post(`/work-orders/${id}/items`, item);
    return response.data.data;
  },

  async removeItem(id: string, itemId: string) {
    await api.delete(`/work-orders/${id}/items/${itemId}`);
  },

  async delete(id: string) {
    await api.delete(`/work-orders/${id}`);
  },

  async getStatistics() {
    const response = await api.get('/work-orders/statistics');
    return response.data.data;
  },
};
```

---

## 3️⃣ ADAPTAR DATABASECONTEXT

### **Antes (IndexedDB):**

```typescript
const createClient = async (data: CreateClientData) => {
  const newClient = {
    id: generateId(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  await db.clients.add(newClient);
  return newClient;
};
```

### **Depois (API):**

```typescript
import { clientService } from '../services/client.service';
import { useToast } from '../hooks/useToast';

const { success, error } = useToast();

const createClient = async (data: CreateClientData) => {
  try {
    const newClient = await clientService.create(data);
    success('Cliente criado com sucesso!');
    return newClient;
  } catch (err: any) {
    error(err.response?.data?.message || 'Erro ao criar cliente');
    throw err;
  }
};
```

---

## 4️⃣ EXEMPLO PRÁTICO COMPLETO

### **ClientsTab.tsx (ANTES vs DEPOIS):**

#### **ANTES:**
```typescript
const { clients, createClient } = useDatabase();

const handleCreateClient = async (data: CreateClientData) => {
  await createClient(data);
};
```

#### **DEPOIS:**
```typescript
import { clientService } from '../services/client.service';
import { useToast } from '../hooks/useToast';

const [clients, setClients] = useState<Client[]>([]);
const [loading, setLoading] = useState(false);
const { success, error } = useToast();

useEffect(() => {
  loadClients();
}, []);

const loadClients = async () => {
  try {
    setLoading(true);
    const response = await clientService.list();
    setClients(response.data);
  } catch (err: any) {
    error('Erro ao carregar clientes');
  } finally {
    setLoading(false);
  }
};

const handleCreateClient = async (data: CreateClientData) => {
  try {
    setLoading(true);
    await clientService.create(data);
    success('Cliente criado com sucesso!');
    await loadClients(); // Recarregar lista
  } catch (err: any) {
    error(err.response?.data?.message || 'Erro ao criar cliente');
  } finally {
    setLoading(false);
  }
};
```

---

## 5️⃣ ERROR HANDLING

### **Criar ErrorBoundary:**

```typescript
import { api } from './api';

export const handleApiError = (err: any, toast: any) => {
  const message = err.response?.data?.message || 'Erro inesperado';
  const errors = err.response?.data?.errors;

  if (errors && Array.isArray(errors)) {
    errors.forEach((error: any) => {
      toast.error(error.message || error);
    });
  } else {
    toast.error(message);
  }
};
```

### **Usar em componentes:**

```typescript
import { handleApiError } from '../utils/errorHandler';

try {
  await clientService.create(data);
  success('Cliente criado!');
} catch (err) {
  handleApiError(err, { error });
}
```

---

## 6️⃣ LOADING STATES

### **Hook customizado:**

```typescript
import { useState } from 'react';

export function useAsync<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (promise: Promise<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await promise;
      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

### **Uso:**

```typescript
const { data: clients, loading, execute } = useAsync<Client[]>();

useEffect(() => {
  execute(clientService.list());
}, []);

if (loading) return <Loading />;
```

---

## 📝 CHECKLIST DE INTEGRAÇÃO

### **Backend:**
- [x] Todos os controllers implementados
- [x] Rotas configuradas
- [x] Autenticação JWT
- [x] Validação de dados
- [x] Error handling
- [ ] CORS configurado para frontend

### **Frontend:**
- [ ] Instalar Axios
- [ ] Criar api.ts com interceptors
- [ ] Criar services (auth, client, workOrder, etc)
- [ ] Adaptar DatabaseContext
- [ ] Substituir IndexedDB por API calls
- [ ] Implementar error handling
- [ ] Adicionar loading states
- [ ] Integrar toast notifications
- [ ] Testar todos os fluxos

---

## 🚀 PRÓXIMOS PASSOS

1. Criar todos os services (3-4 horas)
2. Adaptar componentes existentes (2-3 horas)
3. Testar integração completa (1 hora)
4. Ajustes finais (1 hora)

**Tempo total estimado:** 7-9 horas

---

**Última Atualização:** 13 de Janeiro de 2026  
**Status:** ✅ **Guia completo**

---

# 🔗 PRONTO PARA INTEGRAÇÃO! 🔗
