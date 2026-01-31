/**
 * @file printer.ts
 * @description Schema Zod para input raw de Printer
 * @generated P7-4 Bootstrap
 */

import { z } from 'zod';
import { SourceSchema, PriceInfoSchema, EvidenceMapSchema } from './common';

export const PrinterSpecsInputSchema = z.object({
    type: z.string().min(1),
    ppmBlack: z.string().min(1),
    hasWifi: z.boolean().optional(),
    hasDuplex: z.boolean().optional(),
    costPerPage: z.string().optional(),
    hasScanner: z.boolean().optional(),
});

export const PrinterOpusRawInputSchema = z.object({
    product: z.object({
        name: z.string().min(1),
        brand: z.string().min(1),
        model: z.string().min(1),
        categoryId: z.literal('printer'),
        asin: z.string().optional(),
    }),
    price: PriceInfoSchema,
    sources: z.array(SourceSchema).min(1),
    specs: PrinterSpecsInputSchema,
    evidence: EvidenceMapSchema,
    meta: z.object({
        cadastradoPor: z.string().default('opus'),
        cadastradoEm: z.string(),
    }).optional(),
});

export type PrinterOpusRawInput = z.infer<typeof PrinterOpusRawInputSchema>;
