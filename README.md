# bizdocgen

A custom [Grist widget](https://support.getgrist.com/widget-custom/) for generating business documents.

![Screenshot](example.png)

Currently supports 3 types of documents:

- **Quotation** (ใบเสนอราคา)
- **Invoice** (ใบแจ้งหนี้)
- **Receipt** (ใบเสร็จรับเงิน)

Features:

- Withholding tax (ภาษีหัก ณ ที่จ่าย)
- PromptPay with QR code in invoice

I use it when dealing with event sponsorships and occasional consulting work, while my friends use it for issuing [business documents related to freelance work](https://mennstudio.com/2014/design-business-forms/).

## Set up

### Hosted Grist (easiest)

This is the easiest way to instantly try it out for free.

1. [**Click here to open the template**](https://bizdocgen.getgrist.com/cq6sb6WHRMre/bizdocgen-template) (no need to sign in).
2. Feel free to make changes (this will [create an unsaved copy](https://support.getgrist.com/glossary/#fiddle-mode) for you to try out).
3. To save it to your own workspace, click **Use This Template** or **Save Copy** (this is where you'll need to sign up or sign in).

> [!TIP]
> Grist has a [generous free tier](https://www.getgrist.com/pricing/) that comes with 5,000 rows per document — more than enough.

### Self-Hosted

For self-managed Grist, download the template file from this repository and import it into your instance:

1. Download the Grist template file: [template.grist](template.grist)
2. Open the template in your Grist account.

> [!TIP]
> You can [self‑host](https://support.getgrist.com/self-managed/) your own Grist instance for better data sovereignty, unlimited rows, and no API rate limits.

## Technology Stack

- **Frontend**: Vue 3 with Composition API + TypeScript
- **Build Tool**: Vite+
- **Package Manager**: pnpm (managed through Vite+)

## Development

Set up [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

```bash
# Clone the repository
git clone https://github.com/dtinth/TypeScriptAccount.git
cd TypeScriptAccount

# Install dependencies
vp install

# Start development server
vp dev
```

## License

MIT

## Adding Fields to the Document View

The document data flows from Grist → the widget through a Python formula column and a Zod schema. To add a new field, you must update both.

### 1. Update the Grist formula column (`document-schema-formula.py`)

The Python formula in Grist serialises each record into a JSON object. Edit the relevant `serialize_*` function in [`src/types/document-schema-formula.py`](src/types/document-schema-formula.py) to include your new field, then paste the updated file contents into the Grist formula column.

**Example** — adding `Fax` to the provider:

```python
def serialize_provider(provider):
    return {
        "Address": provider.Address,
        "Email": provider.Email or None,
        "Fax": provider.Fax or None,        # ← new field
        "Name": provider.Name,
        "Personnel_Name": provider.Personnel_Name or None,
        "Tax_ID": provider.Tax_ID,
    }
```

### 2. Update the Zod schema (`document-schema.ts`)

Add the corresponding field to the matching schema in [`src/types/document-schema.ts`](src/types/document-schema.ts) so the widget validates and types it correctly.

```typescript
export const ProviderSchema = z.object({
  Address: z.string(),
  Email: z.string().nullish(),
  Fax: z.string().nullish(),   // ← new field
  Name: z.string(),
  Personnel_Name: z.string().nullish(),
  Tax_ID: z.string(),
})
```

TypeScript types are derived automatically from the schemas (`z.infer<typeof ProviderSchema>`), so no separate type update is needed.

### 3. Use the field in a component

The validated record is available as `RecordData` throughout the Vue components. Reference the new field in the relevant component under `src/components/`.

### Field reference by schema

| Schema | File location | Grist table |
|---|---|---|
| `RecordDataSchema` | `document-schema.ts` | Documents table (top-level fields) |
| `ClientSchema` | `document-schema.ts` | Clients table |
| `ProviderSchema` | `document-schema.ts` | Providers table |
| `ItemSchema` | `document-schema.ts` | Items table |
| `VehicleSchema` | `document-schema.ts` | Vehicles table |
| `PaymentMethodSchema` | `document-schema.ts` | Payment Methods table |
| `PaymentRecordSchema` | `document-schema.ts` | Payments table |
| `CatalogSchema` | `document-schema.ts` | Catalog table |

## Related Documentation

- [Vite+ Guide](https://viteplus.dev/guide/)
- [Vite Configuration Reference](https://vite.dev/config/)
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zod Validation](https://zod.dev/)
- [Grist Custom Widgets Guide](https://support.getgrist.com/widget-custom/)
- [Grist Widget API Reference](https://support.getgrist.com/widget-custom-api/)
- [Grist Templates](https://templates.getgrist.com/)
