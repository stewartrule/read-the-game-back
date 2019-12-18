type Maybe<T> = T | undefined;

export const range = (min: number, max: number) =>
  Array.from({ length: max - min }).map((_, index) => index + min);

export const mapSeq = async <T, R>(
  items: T[],
  map: (item: T) => Promise<R>,
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

export const sample = <T>(values: T[]): T => {
  const { length } = values;

  if (length === 0) {
    throw Error('sample does not work with empty arrays');
  }

  return values[Math.floor(Math.random() * length)];
};

const MINUTE = 1000 * 60;
export const minutes = (amount: number) =>
  Math.round(Math.random() * (MINUTE * amount));
