type SortOrder = 'asc' | 'desc';

export function parseSortParams<T extends string>(
  sort: unknown,
  order: unknown,
  allowedFields: readonly T[],
  defaultField: T
): { field: T; order: SortOrder } {
  const field =
    typeof sort === 'string' && allowedFields.includes(sort as T) ? (sort as T) : defaultField;
  const parsedOrder = order === 'asc' || order === 'desc' ? order : 'desc';
  return { field, order: parsedOrder };
}
