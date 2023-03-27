/*
receives an array of keys and returns an object with a key array of values
*/

export const objectFromArray = (fields: string[], values: never[]): { [p: string]: string[] } => {
    const object = fields.map((field) => {
        return {[field]: ['']};
    }).reduce((acc, field) => {
        return field;
    }, {});
    fields.map((field, index) => {
        object[field] = values[index]
    })
    return object
}