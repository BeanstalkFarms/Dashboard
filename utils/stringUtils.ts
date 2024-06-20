export function shortenAddress(str: string): string {
  if (str.length > 10) {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  } else {
    return str;
  }
}