export default <T = any>(data: string) => {
  try {
    return JSON.parse(String(data)) as T;
  } catch {
    return data as unknown as T;
  }
};
