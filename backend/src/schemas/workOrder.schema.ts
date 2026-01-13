import { z } from 'zod';

export const createWorkOrderSchema = z.object({
  body: z.object({
    clientId: z.string().uuid(),
    vehicleId: z.string().uuid().optional(),
    vehicleDesc: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
    status: z.enum(['ORCAMENTO', 'APROVADO', 'EM_SERVICO', 'FINALIZADO', 'CANCELADO']).default('ORCAMENTO'),
    publicNotes: z.string().optional(),
    internalNotes: z.string().optional(),
    items: z.array(z.object({
      type: z.enum(['SERVICE', 'PART']),
      serviceId: z.string().uuid().optional(),
      partId: z.string().uuid().optional(),
      description: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().nonnegative(),
    })).optional(),
  }),
});

export const updateWorkOrderSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid().optional(),
    vehicleDesc: z.string().optional(),
    assignedToId: z.string().uuid().optional().nullable(),
    status: z.enum(['ORCAMENTO', 'APROVADO', 'EM_SERVICO', 'FINALIZADO', 'CANCELADO']).optional(),
    publicNotes: z.string().optional().nullable(),
    internalNotes: z.string().optional().nullable(),
    discountPercent: z.number().min(0).max(100).optional(),
    discountValue: z.number().nonnegative().optional(),
  }),
});
