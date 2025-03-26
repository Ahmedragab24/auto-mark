/**
 * Finds an item in an array by its ID and returns its name
 * @param items Array of items to search
 * @param id ID to search for
 * @param nameField Field name to return (defaults to 'name_en')
 * @returns The name of the found item or empty string
 */
export function findItemNameById<T extends { id: number }>(
  items: T[] | undefined,
  id: number | null | undefined,
  nameField: keyof T = "name_en" as keyof T
): string {
  if (!items || !id) return "";
  const item = items.find((item) => item.id === id);
  return item ? String(item[nameField] || "") : "";
}

/**
 * Finds an item in an array by its name and returns its ID
 * @param items Array of items to search
 * @param name Name to search for
 * @param nameField Field name to search (defaults to 'name_en')
 * @returns The ID of the found item or null
 */
export function findItemIdByName<T extends { id: number }>(
  items: T[] | undefined,
  name: string | undefined,
  nameField: keyof T = "name_en" as keyof T
): number | null {
  if (!items || !name) return null;
  const item = items.find((item) => String(item[nameField]) === name);
  return item ? item.id : null;
}

/**
 * Safely gets a value from a form field
 * @param value The form field value
 * @param defaultValue Default value to return if value is undefined
 * @returns The value or default value
 */
export function safeFormValue<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}
