import { describe, expect, it } from 'vite-plus/test'

import { mount } from '@vue/test-utils'
import PrintableDocument from '../components/PrintableDocument.vue'
import type { GristRecord } from '../types/document-schema'

function createRecord(documentTypeName: 'Quotation' | 'Car Sale Agreement' | 'Invoice'): GristRecord {
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
      Document_Type: { Name: documentTypeName },
      Items: [
        {
          Description: 'รถยนต์พร้อมอุปกรณ์มาตรฐาน',
          Manual_Sort: 1,
          Quantity: 1,
          Total: 654000,
          Unit_Price: 654000,
          id: 3,
        },
      ],
      Number: 'QT-001',
      Payment_Method: null,
      Payments: null,
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
      Vehicle: null,
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
            Document_Code: 'DOC-101',
            Description: 'ฟิล์ม Lamina',
            Manual_Sort: 1,
            id: 101,
          },
          {
            Catalog: null,
            Document_Code: null,
            Description: 'กรอบป้ายทะเบียน',
            Manual_Sort: 2,
            id: 102,
          },
          {
            Catalog: null,
            Document_Code: null,
            Description: 'พรมพื้นรถ',
            Manual_Sort: 3,
            id: 103,
          },
        ],
      },
    },
  }
}

describe('PrintableDocument financing and accessories sections', () => {
  it('renders financing above items and accessories below items for car sale agreement', () => {
    const wrapper = mount(PrintableDocument, {
      props: { record: createRecord('Car Sale Agreement') },
    })

    const html = wrapper.html()
    const financingIndex = html.indexOf('data-testid="financing-section"')
    const itemsIndex = html.indexOf('class="items-section"')
    const accessoriesIndex = html.indexOf('data-testid="accessories-section"')

    expect(financingIndex).toBeGreaterThan(-1)
    expect(itemsIndex).toBeGreaterThan(-1)
    expect(accessoriesIndex).toBeGreaterThan(-1)
    expect(financingIndex).toBeLessThan(itemsIndex)
    expect(accessoriesIndex).toBeGreaterThan(itemsIndex)

    const accessoryRows = wrapper.findAll('[data-testid="accessory-item"]')
    expect(accessoryRows).toHaveLength(3)
  })

  it('renders financing and accessories sections when financing data exists, even for other document types', () => {
    const wrapper = mount(PrintableDocument, {
      props: { record: createRecord('Invoice') },
    })

    expect(wrapper.find('[data-testid="financing-section"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="accessories-section"]').exists()).toBe(true)
  })
})
