export function hasValues(object: {}){
    return Object.values(object).some(Boolean);
}