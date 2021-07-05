export const formatJSONString = (json: string, indent = 0): string => {
  const jsonString = json || '';
  return !jsonString.trim() ? '' : JSON.stringify(JSON.parse(jsonString), null, indent);
};
