type FormDataValue = File | string | boolean | Array<unknown> | object | null | undefined;
export type FormDataObject = Record<string, FormDataValue>;

export function create_form_data(body: FormDataObject): FormData {
  const fd = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    if (value instanceof File || typeof value === 'string') {
      fd.set(key, value);
    } else if (typeof value === 'boolean') {
      fd.set(key, String(value));
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        fd.append(key, item.toString());
      });
    } else if (value !== undefined && value !== null) {
      fd.set(key, JSON.stringify(value));
    }
  });

  return fd;
}
