/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const strArr = path.split(".");

  return function (obj) {
    let res = obj;

    for (const key of strArr) {
      if (!res?.hasOwnProperty(key)) {
        return;
      }
      res = res[key];
    }

    return res;
  };
}
