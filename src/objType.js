export default function objType(obj) {
  const type = Object.prototype.toString.call(obj).slice(8, -1);
  if (type === 'Object' && typeof obj[Symbol.iterator] === 'function') {
    return 'Iterable';
  }

  if (type.includes('Array')) {
    return 'Array';
  }

  return type;
}
