import { describe, expect, it } from 'vite-plus/test'

import { GristRecordSchema, PaymentRecordSchema } from '../types/document-schema'

function createRecord(documentType: unknown) {
  return {
    id: 1,
    Record: {
      Client: {
        Address: '123 Test Street',
        Name: 'Test Client Co., Ltd.',
        Tax_ID: '1234567890123',
        id: 2,
      },
      Credit_Term: null,
      Date: '2025-08-09T00:00:00.000Z',
      Document_Type: documentType,
      Items: [
        {
          Description: 'Test Item',
          Document: { tableId: 'Documents', rowId: 1 },
          Manual_Sort: 1,
          Quantity: 1,
          Total: 100,
          Unit_Price: 100,
          id: 3,
        },
      ],
      Number: 'TEST-001',
      Payment_Method: null,
      Provider: {
        Address: '456 Provider Road',
        Email: 'provider@example.com',
        Name: 'Test Provider Co., Ltd.',
        Personnel_Name: 'Test Provider',
        Tax_ID: '9876543210987',
        id: 4,
      },
      Reference: null,
      Remarks: null,
      Signed_Document_URL: '',
      Tax: 0.07,
      id: 5,
    },
  }
}

describe('GristRecordSchema', () => {
  it('parses a Document_Type reference object with Name and Abbr', () => {
    const parsed = GristRecordSchema.parse(createRecord({ Name: 'Receipt', Abbr: 'RCPT' }))

    expect(parsed.Record.Document_Type).toEqual({ Name: 'Receipt', Abbr: 'RCPT' })
  })

  it('parses a Document_Type reference object without Abbr', () => {
    const parsed = GristRecordSchema.parse(createRecord({ Name: 'Quotation' }))

    expect(parsed.Record.Document_Type).toEqual({ Name: 'Quotation' })
  })

  it('rejects an unknown Document_Type Name', () => {
    const result = GristRecordSchema.safeParse(createRecord({ Name: 'Purchase Order' }))

    expect(result.success).toBe(false)
  })

  it('accepts Credit Note as a valid Document_Type', () => {
    const parsed = GristRecordSchema.parse(createRecord({ Name: 'Credit Note', Abbr: 'CN' }))

    expect(parsed.Record.Document_Type).toEqual({ Name: 'Credit Note', Abbr: 'CN' })
  })

  it('accepts Debit Note as a valid Document_Type', () => {
    const parsed = GristRecordSchema.parse(
      createRecord({ Name: 'Debit Note', Abbr: 'DN', Thai_Name: 'ใบเพิ่มหนี้' }),
    )

    expect(parsed.Record.Document_Type).toEqual({
      Name: 'Debit Note',
      Abbr: 'DN',
      Thai_Name: 'ใบเพิ่มหนี้',
    })
  })

  it('accepts Car Sale Agreement as a valid Document_Type', () => {
    const parsed = GristRecordSchema.parse(
      createRecord({
        Name: 'Car Sale Agreement',
        Abbr: 'CSA',
        Thai_Name: 'สัญญาซื้อขายรถยนต์',
      }),
    )

    expect(parsed.Record.Document_Type).toEqual({
      Name: 'Car Sale Agreement',
      Abbr: 'CSA',
      Thai_Name: 'สัญญาซื้อขายรถยนต์',
    })
  })

  it('parses car sale agreement financing with accessory objects', () => {
    const parsed = GristRecordSchema.parse({
      ...createRecord({ Name: 'Car Sale Agreement' }),
      Record: {
        ...createRecord({ Name: 'Car Sale Agreement' }).Record,
        Financing: {
          Net_Selling_Price: 654000,
          Down_Payment_Percentage: 20,
          Down_Payment_Amount: 130800,
          Hire_Purchase_Amount: 523200,
          Installment_Plan_Term_Months: 60,
          Installment_Plan_Interest_Rate: 3.69,
          Installment_Plan_Monthly_Payment: 9892,
          Insurance_Company: 'วิริยะประกันภัย',
          Insurance_Sum_Assured: 530000,
          Insurance_Premium: 0,
          Accessories: [
            {
              Catalog: { Type: 'Product', Code: 'ACC-001', Name: 'ฟิล์ม Lamina' },
              Description: 'ฟิล์ม Lamina',
              Manual_Sort: 2,
              id: 101,
            },
            {
              Catalog: null,
              Description: 'กรอบป้ายทะเบียน',
              Manual_Sort: 3,
              id: 102,
            },
          ],
        },
      },
    })

    expect(parsed.Record.Financing?.Accessories).toHaveLength(2)
    expect(parsed.Record.Financing?.Accessories?.[0]?.Catalog?.Code).toBe('ACC-001')
  })

  it('rejects accessory object without Description', () => {
    const result = GristRecordSchema.safeParse({
      ...createRecord({ Name: 'Quotation' }),
      Record: {
        ...createRecord({ Name: 'Quotation' }).Record,
        Financing: {
          Net_Selling_Price: 654000,
          Down_Payment_Percentage: 20,
          Down_Payment_Amount: 130800,
          Hire_Purchase_Amount: 523200,
          Installment_Plan_Term_Months: 60,
          Installment_Plan_Interest_Rate: 3.69,
          Installment_Plan_Monthly_Payment: 9892,
          Insurance_Company: null,
          Insurance_Sum_Assured: null,
          Insurance_Premium: null,
          Accessories: [
            {
              Catalog: null,
              Manual_Sort: 1,
              id: 777,
            },
          ],
        },
      },
    })

    expect(result.success).toBe(false)
  })
})

describe('PaymentRecordSchema', () => {
  it('parses a Cash payment record with only required fields', () => {
    const result = PaymentRecordSchema.safeParse({
      Amount: 5000,
      Datetime: '2025-07-21T09:00:00.000Z',
      Payment_Method: { Type: { Name: 'Cash', Thai_Name: 'เงินสด' }, Name: 'เงินสด' },
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error('Expected Cash payment record to parse successfully')
    }

    expect(result.data.Payment_Method?.Type?.Name).toBe('Cash')
    expect(result.data.Amount).toBe(5000)
  })

  it('parses a Cheque payment record with all fields', () => {
    const result = PaymentRecordSchema.safeParse({
      Amount: 10000,
      Datetime: '2025-07-21T09:00:00.000Z',
      Payment_Method: {
        Type: { Name: 'Cheque', Thai_Name: 'เช็ค' },
        Bank: 'ธนาคารกรุงเทพ',
        Branch: 'สีลม',
        Name: 'ธนาคารกรุงเทพ',
      },
      Transaction_Number: 'CHQ-001',
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error('Expected Cheque payment record to parse successfully')
    }

    expect(result.data.Transaction_Number).toBe('CHQ-001')
  })

  it('parses a Credit Card payment record', () => {
    const result = PaymentRecordSchema.safeParse({
      Amount: 8500,
      Datetime: '2025-07-21T10:00:00.000Z',
      Payment_Method: { Type: { Name: 'Credit Card', Thai_Name: 'บัตรเครดิต' }, Name: 'Mastercard' },
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error('Expected Credit Card payment record to parse successfully')
    }

    expect(result.data.Payment_Method?.Name).toBe('Mastercard')
  })

  it('parses a Bank Transfer payment record', () => {
    const result = PaymentRecordSchema.safeParse({
      Amount: 20000,
      Datetime: '2025-07-22T08:00:00.000Z',
      Payment_Method: {
        Type: { Name: 'Bank Transfer', Thai_Name: 'โอนเงิน' },
        Account_Holder: 'นาย โปร แก้ได้หมด',
        Account_Number: '111-1-11111-1',
        Bank: 'ธนาคารไทยพาณิชย์',
        Branch: 'เซ็นทรัลเวิลด์',
        Name: 'บัญชีหลัก',
        PromptPay: '0891234567',
      },
    })

    expect(result.success).toBe(true)
    if (!result.success) {
      throw new Error('Expected Bank Transfer payment record to parse successfully')
    }

    expect(result.data.Payment_Method?.Account_Number).toBe('111-1-11111-1')
  })

  it('rejects an unknown payment type', () => {
    const result = PaymentRecordSchema.safeParse({
      Amount: 500,
      Datetime: '2025-07-22T08:00:00.000Z',
      Payment_Method: { Type: { Name: 'Crypto' as never, Thai_Name: null }, Name: 'Crypto' },
    })

    expect(result.success).toBe(false)
  })

  it('rejects a record missing Amount', () => {
    const result = PaymentRecordSchema.safeParse({
      Datetime: '2025-07-22T08:00:00.000Z',
      Payment_Method: { Type: { Name: 'Cash', Thai_Name: 'เงินสด' }, Name: 'เงินสด' },
    })

    expect(result.success).toBe(false)
  })
})
