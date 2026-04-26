import { z } from 'zod'

export const PaymentMethodSchema = z.object({
  Account_Holder: z.string().nullish(),
  Account_Number: z.string().nullish(),
  Bank: z.string().nullish(),
  Branch: z.string().nullish(),
  Name: z.string(), // Internal use only, not displayed
  PromptPay: z.string().nullish(),
})

export const ClientSchema = z.object({
  Address: z.string(),
  Name: z.string(),
  Tax_ID: z.string(),
})

export const ProviderSchema = z.object({
  Address: z.string(),
  Email: z.string().nullish(),
  Name: z.string(), // Brand name
  Personnel_Name: z.string().nullish(), // Optional, for signature (ลงชื่อ)
  Tax_ID: z.string(),
})

export const CatalogTypeSchema = z.enum(['product', 'service', 'document'])

export const CatalogSchema = z.object({
  Type: CatalogTypeSchema,
  Code: z.string().nullish(),
  Name: z.string(),
  Unit_Price: z.number().nullish(),
  Description: z.string().nullish(),
})

export const ItemSchema = z.object({
  Catalog_Ref: CatalogSchema.nullish(),
  Description: z.string(),
  Manual_Sort: z.number().nullish(),
  Quantity: z.number(),
  Total: z.number(),
  Unit_Price: z.number(),
  id: z.number(),
})

export const VehicleSchema = z.object({
  Make: z.string(),
  Model: z.string(),
  Year: z.number(),
  Color: z.string().nullish(),
  VIN: z.string().nullish(),
  License_Plate: z.string().nullish(),
  Mileage: z.number().nullish(),
  Engine_Number: z.string().nullish(),
})

export const DocumentTypeSchema = z.enum(['Quotation', 'Invoice', 'Receipt', 'Credit Note'])

export const DocumentTypeListSchema = z.preprocess((value) => {
  return Array.isArray(value) ? value : [value]
}, z.array(DocumentTypeSchema).length(1))

export const ReferenceSchema = z
  .object({
    Number: z.string(),
  })
  .nullish()

export const PaymentTypeSchema = z.enum(['Cash', 'Cheque', 'Credit Card', 'Bank Transfer'])

export const PaymentRecordSchema = z.object({
  Type: PaymentTypeSchema,
  Amount: z.number(),
  Datetime: z.string(),
  // Cheque + Bank Transfer
  Bank: z.string().nullish(),
  Branch: z.string().nullish(),
  // Cheque only
  Transaction_Number: z.string().nullish(),
  // Credit Card only
  Card_Type: z.string().nullish(),
  // Bank Transfer only
  Account_Number: z.string().nullish(),
})

export const RecordDataSchema = z.object({
  Client: ClientSchema,
  Credit_Term: z.string().nullish(),
  Date: z.string(), // ISO date string
  Document_Type: DocumentTypeListSchema,
  Items: z.array(ItemSchema),
  Number: z.string(),
  Payment_Method: PaymentMethodSchema.nullish(),
  Payments: z.array(PaymentRecordSchema).nullish(),
  Provider: ProviderSchema,
  Reference: ReferenceSchema,
  Remarks: z.string().nullish(),
  Tax: z.number(),
  Signed_Document_URL: z.union([z.url(), z.literal('')]).nullish(),
  Vehicle: VehicleSchema.nullish(),
})

export const GristRecordSchema = z.object({
  id: z.number(),
  Record: RecordDataSchema,
})

// TypeScript types derived from Zod schemas
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type Client = z.infer<typeof ClientSchema>
export type Provider = z.infer<typeof ProviderSchema> // includes Personnel_Name
export type CatalogType = z.infer<typeof CatalogTypeSchema>
export type Catalog = z.infer<typeof CatalogSchema>
export type Item = z.infer<typeof ItemSchema>
export type Vehicle = z.infer<typeof VehicleSchema>
export type DocumentType = z.infer<typeof DocumentTypeSchema>
export type Reference = z.infer<typeof ReferenceSchema>
export type PaymentType = z.infer<typeof PaymentTypeSchema>
export type PaymentRecord = z.infer<typeof PaymentRecordSchema>
export type RecordData = z.infer<typeof RecordDataSchema>
export type GristRecord = z.infer<typeof GristRecordSchema>
