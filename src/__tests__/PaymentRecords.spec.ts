import { describe, expect, it } from 'vite-plus/test'

import { mount } from '@vue/test-utils'
import PaymentRecords from '../components/PaymentRecords.vue'
import type { GristRecord } from '../types/document-schema'

function createRecord(payments: GristRecord['Record']['Payments']): GristRecord {
  return {
    id: 1,
    Record: {
      Client: {
        Address: '123 Test Street',
        Name: 'Test Client Co., Ltd.',
        Tax_ID: '1234567890123',
      },
      Credit_Term: null,
      Date: '2025-08-09T00:00:00.000Z',
      Document_Type: { Name: 'Invoice' },
      Items: [
        {
          Description: 'Test Item',
          Manual_Sort: 1,
          Quantity: 1,
          Total: 1000,
          Unit_Price: 1000,
          id: 3,
        },
      ],
      Number: 'TEST-001',
      Payment_Method: null,
      Payments: payments,
      Provider: {
        Address: '456 Provider Road',
        Email: 'provider@example.com',
        Name: 'Test Provider Co., Ltd.',
        Personnel_Name: 'Test Provider',
        Tax_ID: '9876543210987',
      },
      Reference: null,
      Remarks: null,
      Signed_Document_URL: '',
      Tax: 0,
    },
  }
}

describe('PaymentRecords', () => {
  const linkedPaymentMethod = {
    Type: { Name: 'Bank Transfer' as const, Thai_Name: 'โอนเงิน' },
    Account_Holder: 'นาย ทด สอบ',
    Account_Number: '111-1-11111-1',
    Bank: 'ธนาคารไทยพาณิชย์',
    Branch: 'เซ็นทรัลเวิลด์',
    Name: 'บัญชีหลัก',
    PromptPay: '0891234567',
  }

  it('renders nothing when there are no payment records', () => {
    const wrapper = mount(PaymentRecords, {
      props: { record: createRecord(null) },
    })

    expect(wrapper.find('[data-testid="payment-records"]').exists()).toBe(false)
  })

  it('renders all payment rows', () => {
    const record = createRecord([
      { Amount: 500, Datetime: '2025-08-09T10:00:00.000Z', Payment_Method: { Type: { Name: 'Cash', Thai_Name: 'เงินสด' }, Name: 'เงินสด' } },
      {
        Amount: 300,
        Datetime: '2025-08-09T11:00:00.000Z',
        Payment_Method: {
          ...linkedPaymentMethod,
          Type: { Name: 'Cheque', Thai_Name: 'เช็ค' },
          Bank: 'ธนาคารกรุงเทพ',
          Branch: 'สีลม',
        },
        Transaction_Number: 'CHQ-9999',
      },
      {
        Amount: 200,
        Datetime: '2025-08-09T12:00:00.000Z',
        Payment_Method: linkedPaymentMethod,
      },
    ])

    const wrapper = mount(PaymentRecords, { props: { record } })

    const rows = wrapper.findAll('[data-testid="payment-record-row"]')
    expect(rows).toHaveLength(3)
  })

  it('shows type-specific details for Cheque', () => {
    const record = createRecord([
      {
        Amount: 5000,
        Datetime: '2025-08-09T10:00:00.000Z',
        Payment_Method: {
          ...linkedPaymentMethod,
          Type: { Name: 'Cheque', Thai_Name: 'เช็ค' },
          Bank: 'ธนาคารกรุงเทพ',
          Branch: 'สีลม',
        },
        Transaction_Number: 'CHQ-1234',
      },
    ])

    const wrapper = mount(PaymentRecords, { props: { record } })

    expect(wrapper.text()).toContain('CHQ-1234')
    expect(wrapper.text()).toContain('ธนาคารกรุงเทพ')
  })

  it('shows type-specific details for Credit Card', () => {
    const record = createRecord([
      {
        Amount: 3000,
        Datetime: '2025-08-09T10:00:00.000Z',
        Payment_Method: { Type: { Name: 'Credit Card', Thai_Name: 'บัตรเครดิต' }, Name: 'Visa' },
      },
    ])

    const wrapper = mount(PaymentRecords, { props: { record } })

    expect(wrapper.text()).toContain('Visa')
  })

  it('shows type-specific details for Bank Transfer', () => {
    const record = createRecord([
      {
        Amount: 4000,
        Datetime: '2025-08-09T10:00:00.000Z',
        Payment_Method: {
          ...linkedPaymentMethod,
          Account_Number: '222-2-22222-2',
        },
      },
    ])

    const wrapper = mount(PaymentRecords, { props: { record } })

    expect(wrapper.text()).toContain('222-2-22222-2')
    expect(wrapper.text()).toContain('ธนาคารไทยพาณิชย์')
  })

  it('calculates totalPaid and balance correctly', async () => {
    // Tax=0 so document total = item total = 1000
    const record = createRecord([
      { Amount: 400, Datetime: '2025-08-09T10:00:00.000Z', Payment_Method: { Type: { Name: 'Cash', Thai_Name: 'เงินสด' }, Name: 'เงินสด' } },
      {
        Amount: 300,
        Datetime: '2025-08-09T11:00:00.000Z',
        Payment_Method: linkedPaymentMethod,
      },
    ])

    const wrapper = mount(PaymentRecords, { props: { record } })

    const totalPaidEl = wrapper.find('[data-testid="total-paid"]')
    const balanceEl = wrapper.find('[data-testid="balance"]')

    expect(totalPaidEl.exists()).toBe(true)
    expect(balanceEl.exists()).toBe(true)

    // Total paid = 700, balance = 1000 - 700 = 300
    // Formatted as Thai currency (฿700.00 etc.)
    expect(totalPaidEl.text()).toContain('700')
    expect(balanceEl.text()).toContain('300')
  })

  it('updates when record prop changes', async () => {
    const firstRecord = createRecord([
      { Amount: 200, Datetime: '2025-08-09T10:00:00.000Z', Payment_Method: { Type: { Name: 'Cash', Thai_Name: 'เงินสด' }, Name: 'เงินสด' } },
    ])
    const secondRecord = createRecord([
      { Amount: 500, Datetime: '2025-08-09T10:00:00.000Z', Payment_Method: { Type: { Name: 'Cash', Thai_Name: 'เงินสด' }, Name: 'เงินสด' } },
      {
        Amount: 300,
        Datetime: '2025-08-09T11:00:00.000Z',
        Payment_Method: { Type: { Name: 'Credit Card', Thai_Name: 'บัตรเครดิต' }, Name: 'Mastercard' },
      },
    ])

    const wrapper = mount(PaymentRecords, { props: { record: firstRecord } })

    expect(wrapper.findAll('[data-testid="payment-record-row"]')).toHaveLength(1)

    await wrapper.setProps({ record: secondRecord })

    expect(wrapper.findAll('[data-testid="payment-record-row"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Mastercard')
  })
})
