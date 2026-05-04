def serialize_client(client):
    return {
        "Address": client.Address,
        "Name": client.Name,
        "Tax_ID": client.Tax_ID,
    }

def serialize_provider(provider):
    return {
        "Address": provider.Address,
        "Email": provider.Email or None,
        "Name": provider.Name,
        "Personnel_Name": provider.Personnel_Name or None,
        "Tax_ID": provider.Tax_ID,
    }

def serialize_catalog(catalog):
    if not catalog:
        return None
    return {
        "Type": catalog.Type,
        "Code": catalog.Code or None,
        "Name": catalog.Name,
        "Unit_Price": catalog.Unit_Price if catalog.Unit_Price is not None else None,
        "Description": catalog.Description or None,
    }

def serialize_item(item):
    return {
        "Catalog": serialize_catalog(item.Catalog) if item.Catalog else None,
        "Document_Code": item.Document_Code or None,
        "Description": item.Description,
        "Manual_Sort": item.Manual_Sort or None,
        "Quantity": item.Quantity,
        "Total": item.Total,
        "Unit_Price": item.Unit_Price,
        "id": item.id,
    }

def serialize_payment_method(pm):
    if not pm:
        return None
    return {
        "Account_Holder": pm.Account_Holder or None,
        "Account_Number": pm.Account_Number or None,
        "Bank": pm.Bank or None,
        "Branch": pm.Branch or None,
        "Name": pm.Name,
        "PromptPay": pm.PromptPay or None,
        "Type": {"Name": pm.Type.Name, "Thai_Name": pm.Type.Thai_Name or None} if pm.Type else None,
    }

def serialize_payment(payment):
    return {
        "Amount": payment.Amount,
        "Datetime": str(payment.Datetime) if payment.Datetime else "",
        "Payment_Method": serialize_payment_method(payment.Payment_Method),
        "Transaction_Number": payment.Transaction_Number or None,
    }

def serialize_vehicle(vehicle):
    if not vehicle:
        return None
    return {
        "Make": vehicle.Make,
        "Model": vehicle.Model,
        "Year": vehicle.Year,
        "Color": vehicle.Color or None,
        "VIN": vehicle.VIN or None,
        "License_Plate": vehicle.License_Plate or None,
        "Mileage": vehicle.Mileage if vehicle.Mileage is not None else None,
        "Engine_Number": vehicle.Engine_Number or None,
        "Purchase_Order_Number": vehicle.Purchase_Order_Number or None,
        "Sales_Order_Number": vehicle.Sales_Order_Number or None,
    }

def serialize_reference(ref):
    if not ref:
        return None
    return {
        "Number": ref.Number,
    }

def serialize_document_type(document_type):
    if not document_type:
        return None
    return {
        "Name": document_type.Name,
        "Abbr": document_type.Abbr or None,
        "Thai_Name": document_type.Thai_Name or None,
    }

def serialize_record(doc):
    return {
        "Client": serialize_client(doc.Client),
        "Credit_Term": doc.Credit_Term or None,
        "Date": str(doc.Date) if doc.Date else "",
        "Document_Type": serialize_document_type(doc.Document_Type),
        "Items": [serialize_item(item) for item in doc.Items],
        "Number": doc.Number,
        "Payment_Method": serialize_payment_method(doc.Payment_Method),
        "Payments": [serialize_payment(payment) for payment in doc.Payments] if doc.Payments else None,
        "Provider": serialize_provider(doc.Provider),
        "Reference": serialize_reference(doc.Reference),
        "Remarks": doc.Remarks or None,
        "Signed_Document_URL": doc.Signed_Document_URL or None,
        "Tax": doc.Tax,
        "Vehicle": serialize_vehicle(doc.Vehicle) if doc.Vehicle else None,
    }

return serialize_record(rec)