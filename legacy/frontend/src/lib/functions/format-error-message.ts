/**
 * Function to format error message with <strong> tag depending on prefix character.
 *
 * @param error_str - Error message
 * @param prefix - Regex to target for formatting
 */
export function format_error_message_with_bold_prefix(error_str: string, prefix: string) {
  const regex = new RegExp(`${prefix}\\/([a-zA-Z0-9_]+)`, 'g');
  return error_str.replace(regex, `<strong>${prefix}/$1</strong>`);
}
