/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
 export function createGetter(path) {

    const pathArr = path.split('.');
    return (obj) => {
        let result = obj;
        for (const prop of pathArr) {
            result = result[prop];
            if (result === undefined) {
                return;
            } 
        } 
        return result; 
    }
    
}