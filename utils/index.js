// Create our number formatter.
export const formatMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0,
  //maximumFractionDigits: 0,
});

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function computeAvgNetTons(group) {
  let sum = 0;
  let itemsFound = 0;
  const len = group && group.length;
  let item = null;
  for (let i = 0; i < len; i++) {
    item = group[i];
    if (item) {
      sum = item.netTons + sum;
      itemsFound++;
    }
    return sum / itemsFound;
  }
}

export function computeAvgContractPrice(group) {
  let sum = 0;
  let itemsFound = 0;
  const len = group && group.length;
  let item = null;
  for (let i = 0; i < len; i++) {
    item = group[i].contract;
    if (item) {
      sum = item.contractPrice + sum;
      itemsFound++;
    }
    return sum / itemsFound;
  }
}
export function computeAvgSalePrice(group) {
  let sum = 0;
  let itemsFound = 0;
  const len = group && group.length;
  let item = null;
  for (let i = 0; i < len; i++) {
    item = group[i].contract;

    if (item) {
      sum = item.salePrice + sum;
      itemsFound++;
    }
    return sum / itemsFound;
  }
}

export function computeSum(group) {
  let sum = 0;
  let item = null;
  let len = group && group.length;
  for (let i = 0; i < len; i++) {
    item = group[i];
    if (item) {
      sum = item.netTons + sum;
    }
  }

  return Number.parseFloat(sum).toFixed(2);
}

export function truncateString(str, num) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + "...";
}
