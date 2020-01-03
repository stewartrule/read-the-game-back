export const range = (min: number, max: number) =>
  Array.from({ length: max - min }).map((_, index) => index + min);

export const mapSeq = async <T, R>(
  items: T[],
  map: (item: T, index: number) => Promise<R>,
): Promise<R[]> => {
  const initial = items.slice(0, 1);
  const rest = items.slice(1);

  const ret: R[] = initial.length
    ? await mapParallel(initial, map)
    : [];

  return rest.length ? ret.concat(await mapSeq(rest, map)) : ret;
};

export const mapParallel = <T, R>(
  items: T[],
  map: (item: T, index: number) => Promise<R>,
) => Promise.all(items.map((item, i) => map(item, i)));

export const getAge = (dob: Date) => {
  const now = new Date();
  const monthDiff = now.getMonth() - dob.getMonth();
  const age = now.getFullYear() - dob.getFullYear();

  return monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < dob.getDate())
    ? age - 1
    : age;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const chance = (value = 0.5) => Math.random() < value;

export const findOrFail = <T>(
  values: T[],
  predicate: (value: T) => boolean,
): T => {
  const value = values.find(predicate);

  if (value == null) {
    throw Error('could not find value by given predicate');
  }

  return value;
};

export const sample = <T>(values: T[]): T => {
  const { length } = values;

  if (length === 0) {
    throw Error('could not sample value on empty array');
  }

  return values[Math.floor(Math.random() * length)];
};

export const shuffle = <T>(input: T[]): T[] => {
  const output = input.slice();
  for (let i = output.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
};

const MINUTE = 1000 * 60;
export const minutes = (amount: number) =>
  Math.round(Math.random() * (MINUTE * amount));
