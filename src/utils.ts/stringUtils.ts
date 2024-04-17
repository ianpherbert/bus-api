export function normaliseStringToArray<T>(string: string, delimiter = ",") {
    return string.split(delimiter).map(it => it.toLocaleLowerCase().trim() as keyof T);
}