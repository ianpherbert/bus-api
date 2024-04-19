export function normaliseStringToArray<T>(string: string, delimiter = ",") {
    return string.split(delimiter).map(it => it.toLocaleLowerCase().trim() as keyof T);
}

export function normaliseString(str: string) {
    return str
        .normalize("NFD")
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ß/g, 'ss')
        .replace(/ł/g, 'l')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^A-Za-z0-9 ]/g, '');
}