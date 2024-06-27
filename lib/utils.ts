
const toString = (v: any) => v.toString();

export const parseArgs = (_o: { [key: string]: any }) => {
  const o: { [key: string]: any } = {};
  Object.keys(_o).forEach((k: string) => {
    o[k] =
      toString(_o[k]) ||
      (Array.isArray(_o[k]) ? _o[k].map((v: any) => toString(v) || v) : _o[k]);
  });
  return o;
};

export function shortenAddress(str: string): string {
  if (str.length > 10) {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  } else {
    return str;
  }
};