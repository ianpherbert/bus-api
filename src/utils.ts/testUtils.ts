export const waitFor = async (fn: Function, timeout = 500) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            fn();
            resolve(null);
        }, timeout)
    })
}
