/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

    if (size === undefined) return string;

    let result = '';
    let current = '';
    let counter = 0;

    for (const i of string) {
        if (current !== i) {
            current = i;
            counter = 0;
        }        
        if (counter++ < size) result = result + i;
    }
    return result; 
           
}