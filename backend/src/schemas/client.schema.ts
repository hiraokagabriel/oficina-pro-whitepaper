import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    phone: z.string().min(10, 'Telefone inválido'),
    email: z.string().email('Email inválido').optional(),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos').optional(),
    cnpj: z.string().length(14, 'CNPJ deve ter 14 dígitos').optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional().nullable(),
    cpf: z.string().length(11).optional().nullable(),
    cnpj: z.string().length(14).optional().nullable(),
    address: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});
