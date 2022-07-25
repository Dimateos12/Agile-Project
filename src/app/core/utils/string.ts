/* String utils */
declare global {
  interface String {
    withEllipsis(maxLength: number): string;
  }
}

String.prototype.withEllipsis = function (maxLength?: number) {
  const value = String(this);
  const size = maxLength || 300;
  if (value.length > size) {
    return value.substring(0, size) + "...";
  }
  return value;
};


export {}