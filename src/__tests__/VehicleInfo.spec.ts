import { describe, expect, it } from 'vite-plus/test'

import { mount } from '@vue/test-utils'
import VehicleInfo from '../components/VehicleInfo.vue'
import type { GristRecord } from '../types/document-schema'

function createRecord(makeName: string): GristRecord {
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
      Document_Type: { Name: 'Car Sale Agreement' },
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
      Number: 'CSA-001',
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
      Vehicle: {
        Make: { Name: makeName },
        Model: 'Corolla Cross',
        Year: 2023,
        Color: 'White Pearl',
        VIN: 'MR2KZ1234P0001234',
        License_Plate: '4กข 1234',
        Mileage: 32500,
        Engine_Number: '2ZR-FBE-987654',
        Purchase_Order_Number: 'PO-2023-00456',
        Sales_Order_Number: 'SO-2023-00789',
      },
      Financing: null,
    },
  }
}

describe('VehicleInfo', () => {
  it('renders the Make reference Name in the vehicle title', () => {
    const wrapper = mount(VehicleInfo, {
      props: { record: createRecord('Toyota') },
    })

    expect(wrapper.text()).toContain('Toyota Corolla Cross - White Pearl (2023)')
  })
})