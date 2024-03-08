/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  let currentLetter = "";
  let counter = 0;
  let res = "";

  for (let i = 0; i < string.length; i++) {
    if (currentLetter !== string[i]) {
      currentLetter = string[i];
      counter = 1;
    } else {
      counter++;
    }

    if (counter <= size) {
      res += string[i];
    }
  }

  return res;
}
