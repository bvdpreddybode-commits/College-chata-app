export function getNameInitials(name) {
  if (!name) return "S";
  const splitName = name.toUpperCase().split(" ");

  if (splitName.length > 1 && splitName[1][0]) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
}

export function transformToArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.keys(val);
}

export function transformToArrWithId(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return Object.keys(val).map((id) => ({
    ...val[id],
    id,
  }));
}

export function groupBy(array, groupingKeyFn) {
  if (!array || !Array.isArray(array)) return {};
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFn(item);

    if (!result[groupingKey]) {
      result[groupingKey] = [];
    }

    result[groupingKey].push(item);

    return result;
  }, {});
}
