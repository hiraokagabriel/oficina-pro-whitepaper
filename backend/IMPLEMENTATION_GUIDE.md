# 🛠️ GUIA DE IMPLEMENTAÇÃO - Controllers Restantes

## 🎯 OBJETIVO

Este guia mostra como implementar os controllers restantes seguindo o padrão já estabelecido.

---

## 📖 PADRÃO ESTABELECIDO

### **Estrutura de um Controller:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

// 1. Schemas de validação (Zod)
const createSchema = z.object({
  // campos...
});

const updateSchema = createSchema.partial();

// 2. Controller class
export class EntityController {
  
  // 3. LIST - GET /entities
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      const entities = await prisma.entity.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        where: search ? {
          // filtros de busca
        } : undefined,
      });
      
      const total = await prisma.entity.count();
      
      res.json({
        success: true,
        data: entities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }
  
  // 4. GET ONE - GET /entities/:id
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const entity = await prisma.entity.findUnique({
        where: { id },
        include: {
          // relações...
        },
      });
      
      if (!entity) {
        throw new AppError('Entity not found', 404);
      }
      
      res.json({
        success: true,
        data: entity,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // 5. CREATE - POST /entities
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSchema.parse(req.body);
      
      const entity = await prisma.entity.create({
        data,
      });
      
      res.status(201).json({
        success: true,
        data: entity,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // 6. UPDATE - PUT /entities/:id
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateSchema.parse(req.body);
      
      const entity = await prisma.entity.update({
        where: { id },
        data,
      });
      
      res.json({
        success: true,
        data: entity,
      });
    } catch (error) {
      next(error);
    }
  }
  
  // 7. DELETE - DELETE /entities/:id
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      await prisma.entity.delete({
        where: { id },
      });
      
      res.json({
        success: true,
        message: 'Entity deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## 📝 CONTROLLERS A IMPLEMENTAR

### **1️⃣ ClientController**

**Arquivo:** `src/controllers/client.controller.ts`

**Schema:**
```typescript
const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  cpf: z.string().length(11).optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});
```

**Métodos:**
- `list()` - Listar clientes (com busca por nome/telefone/CPF)
- `getById()` - Detalhes do cliente + veículos
- `create()` - Criar cliente
- `update()` - Atualizar cliente
- `delete()` - Excluir cliente (soft delete)

**Rota:** `src/routes/client.routes.ts`
```typescript
import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
const controller = new ClientController();

router.use(authenticate);

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authorize('ADMIN', 'RECEPTIONIST'), controller.create);
router.put('/:id', authorize('ADMIN', 'RECEPTIONIST'), controller.update);
router.delete('/:id', authorize('ADMIN'), controller.delete);

export default router;
```

---

### **2️⃣ VehicleController**

**Arquivo:** `src/controllers/vehicle.controller.ts`

**Schema:**
```typescript
const createVehicleSchema = z.object({
  clientId: z.string().uuid(),
  brand: z.string().min(2),
  model: z.string().min(2),
  year: z.number().int().min(1900).max(2030).optional(),
  plate: z.string().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
  mileage: z.number().int().optional(),
  notes: z.string().optional(),
});
```

**Métodos:**
- `list()` - Listar veículos (filtrar por clientId)
- `getById()` - Detalhes do veículo
- `create()` - Criar veículo
- `update()` - Atualizar veículo
- `delete()` - Excluir veículo

---

### **3️⃣ WorkOrderController**

**Arquivo:** `src/controllers/workOrder.controller.ts`

**Schema:**
```typescript
const createWorkOrderSchema = z.object({
  clientId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  vehicleDesc: z.string(),
  status: z.enum(['ESTIMATE', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  publicNotes: z.string().optional(),
  internalNotes: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
  items: z.array(z.object({
    type: z.enum(['SERVICE', 'PART']),
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })).optional(),
});
```

**Métodos:**
- `list()` - Listar O.S. (filtrar por status, cliente, mecânico)
- `getById()` - Detalhes da O.S. + itens
- `create()` - Criar O.S.
- `update()` - Atualizar O.S.
- `updateStatus()` - Mudar status (PATCH /work-orders/:id/status)
- `delete()` - Excluir O.S.
- `addItem()` - Adicionar item
- `removeItem()` - Remover item

---

### **4️⃣ ServiceController**

**Arquivo:** `src/controllers/service.controller.ts`

**Schema:**
```typescript
const createServiceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  estimatedTime: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
});
```

**Métodos:**
- `list()` - Listar serviços (filtrar por categoria)
- `getById()` - Detalhes do serviço
- `create()` - Criar serviço
- `update()` - Atualizar serviço
- `delete()` - Excluir serviço (soft delete)

---

### **5️⃣ PartController**

**Arquivo:** `src/controllers/part.controller.ts`

**Schema:**
```typescript
const createPartSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive(),
  cost: z.number().positive().optional(),
  stock: z.number().int().default(0),
  minStock: z.number().int().default(0),
  maxStock: z.number().int().optional(),
  location: z.string().optional(),
  supplierId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});
```

**Métodos:**
- `list()` - Listar peças (filtrar por categoria, fornecedor, estoque baixo)
- `getById()` - Detalhes da peça
- `create()` - Criar peça
- `update()` - Atualizar peça
- `delete()` - Excluir peça
- `adjustStock()` - Ajustar estoque (POST /parts/:id/stock)

---

### **6️⃣ LedgerController**

**Arquivo:** `src/controllers/ledger.controller.ts`

**Schema:**
```typescript
const createLedgerSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().positive(),
  description: z.string().min(2),
  category: z.string().optional(),
  date: z.string().datetime(),
  workOrderId: z.string().uuid().optional(),
  isPaid: z.boolean().default(false),
  paymentMethod: z.string().optional(),
});
```

**Métodos:**
- `list()` - Listar lançamentos (filtrar por tipo, data, categoria)
- `getSummary()` - Resumo financeiro (GET /ledger/summary)
- `getById()` - Detalhes do lançamento
- `create()` - Criar lançamento
- `update()` - Atualizar lançamento
- `delete()` - Excluir lançamento

---

### **7️⃣ AppointmentController**

**Arquivo:** `src/controllers/appointment.controller.ts`

**Schema:**
```typescript
const createAppointmentSchema = z.object({
  clientName: z.string().min(2),
  clientPhone: z.string().min(10),
  vehicleInfo: z.string(),
  scheduledAt: z.string().datetime(),
  duration: z.number().int().positive().default(60),
  notes: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
});
```

**Métodos:**
- `list()` - Listar agendamentos (filtrar por data, status, mecânico)
- `getById()` - Detalhes do agendamento
- `create()` - Criar agendamento
- `update()` - Atualizar agendamento
- `updateStatus()` - Mudar status
- `delete()` - Excluir agendamento

---

## 📝 EXEMPLO PRÁTICO

### **ClientController Completo:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  cpf: z.string().length(11).optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

const updateClientSchema = createClientSchema.partial();

export class ClientController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search } = req.query;

      const where = search
        ? {
            OR: [
              { name: { contains: String(search), mode: 'insensitive' } },
              { phone: { contains: String(search) } },
              { cpf: { contains: String(search) } },
            ],
          }
        : undefined;

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          where,
          include: {
            _count: {
              select: { vehicles: true, workOrders: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.client.count({ where }),
      ]);

      res.json({
        success: true,
        data: clients,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          vehicles: true,
          workOrders: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!client) {
        throw new AppError('Client not found', 404);
      }

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createClientSchema.parse(req.body);

      // Check if CPF already exists
      if (data.cpf) {
        const existing = await prisma.client.findUnique({
          where: { cpf: data.cpf },
        });
        if (existing) {
          throw new AppError('CPF already registered', 400);
        }
      }

      const client = await prisma.client.create({
        data,
      });

      res.status(201).json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = updateClientSchema.parse(req.body);

      const client = await prisma.client.update({
        where: { id },
        data,
      });

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Soft delete
      await prisma.client.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'Client deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Para cada controller:

- [ ] Criar arquivo `entity.controller.ts`
- [ ] Definir schemas Zod
- [ ] Implementar métodos CRUD
- [ ] Criar arquivo `entity.routes.ts`
- [ ] Adicionar autenticação/autorização
- [ ] Importar rota em `routes/index.ts`
- [ ] Testar endpoints
- [ ] Documentar no Swagger

---

## 🚀 PRÓXIMOS PASSOS

1. **Implementar controllers** (2-3 horas)
2. **Criar services layer** (optional, mas recomendado)
3. **Adicionar testes** (Jest)
4. **Deploy** (Docker + Cloud)

---

**BOA SORTE!** 🚀
