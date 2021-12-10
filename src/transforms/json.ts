/**
 * @file JSON 处理
 * @author Surmon <https://github.com/surmon-china>
 */

export const formatJSONString = (json: string, indent = 0): string => {
  const jsonString = json || ''
  return !jsonString.trim() ? '' : JSON.stringify(JSON.parse(jsonString), null, indent)
}
