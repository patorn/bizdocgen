import { describe, expect, it } from 'vite-plus/test'

import { mount } from '@vue/test-utils'
import PaymentInfo from '../components/PaymentInfo.vue'
import type { GristRecord } from '../types/document-schema'

function createRecord(id: number, bankName: string, promptPay: string): GristRecord {
  return {
    id,
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
          Total: 100,
          Unit_Price: 100,
          id: 3,
        },
      ],
      Number: `TEST-${id}`,
      Payment_Method: {
        Account_Holder: 'Test Holder',
        Account_Number: '111-1-11111-1',
        Bank: bankName,
        Branch: 'Main Branch',
        Name: `Method ${id}`,
        PromptPay: promptPay,
      },
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
      Tax: 0.07,
    },
  }
}

describe('PaymentInfo', () => {
  it('updates displayed payment method when record prop changes', async () => {
    const firstRecord = createRecord(1, 'First Bank', '0811111111')
    const secondRecord = createRecord(2, 'Second Bank', '0822222222')

    const wrapper = mount(PaymentInfo, {
      props: { record: firstRecord },
    })

    expect(wrapper.text()).toContain('First Bank')
    expect(wrapper.text()).toContain('0811111111')

    await wrapper.setProps({ record: secondRecord })

    expect(wrapper.text()).toContain('Second Bank')
    expect(wrapper.text()).toContain('0822222222')
    expect(wrapper.text()).not.toContain('First Bank')
    expect(wrapper.text()).not.toContain('0811111111')
  })
})
