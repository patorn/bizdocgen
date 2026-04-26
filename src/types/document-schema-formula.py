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
        "Catalog_Ref": serialize_catalog(item.Catalog_Ref) if item.Catalog_Ref else None,
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
    }

def serialize_reference(ref):
    if not ref:
        return None
    return {
        "Number": ref.Number,
    }

def serialize_record(doc):
    return {
        "Client": serialize_client(doc.Client),
        "Credit_Term": doc.Credit_Term or None,
        "Date": str(doc.Date) if doc.Date else "",
        "Document_Type": doc.Document_Type,
        "Items": [serialize_item(item) for item in doc.Items],
        "Number": doc.Number,
        "Payment_Method": serialize_payment_method(doc.Payment_Method),
        "Provider": serialize_provider(doc.Provider),
        "Reference": serialize_reference(doc.Reference),
        "Remarks": doc.Remarks or None,
        "Signed_Document_URL": doc.Signed_Document_URL or None,
        "Tax": doc.Tax,
        "Vehicle": serialize_vehicle(doc.Vehicle) if doc.Vehicle else None,
    }