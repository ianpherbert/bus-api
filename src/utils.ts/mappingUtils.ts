export function DbToApi<D, A extends D>(dbObject: D, apiObjectValues: {key: keyof A; value: any}[]){
    const apiObject = dbObject as A;
    for(const {key, value} of apiObjectValues){
        apiObject[key] = value;
    }
    return apiObject;
}