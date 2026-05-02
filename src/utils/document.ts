import type { DocumentType, DocumentTypeName, Item } from '../types/document-schema'

export function getDocumentTypeName(
  type: DocumentType | DocumentTypeName | DocumentTypeName[] | null | undefined,
): DocumentTypeName | null {
  if (!type) {
    return null
  }

  if (typeof type === 'string') {
    return type
  }

  if (Array.isArray(type)) {
    return type[0] ?? null
  }

  return type.Name
}

export function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    const sortA = a.Manual_Sort ?? 0
    const sortB = b.Manual_Sort ?? 0
    return sortA - sortB
  })
}

export function getDocumentTypeInThai(type: DocumentType): string {
  return type.Thai_Name ?? type.Name
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function calculateSubtotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.Total, 0)
}
