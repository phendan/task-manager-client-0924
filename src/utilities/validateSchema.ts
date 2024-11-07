import type { BaseSchema, SchemaToType } from '../types';

const validateSchema = <Schema extends BaseSchema>(
    subject: unknown,
    schema: Schema
): subject is SchemaToType<Schema> => {
    // console.log(subject, schema);
    if (subject === null || (typeof subject !== 'object' && !Array.isArray(subject))) {
        return false;
    }

    if (Array.isArray(schema)) {
        if (!Array.isArray(subject)) return false;

        const itemSchema = schema[0];

        // Looking for primitive types in subject
        if (typeof itemSchema === 'string') {
            const allowedTypes = itemSchema.split('|');

            for (let item of subject) {
                if (item === null && !allowedTypes.includes('null')) {
                    return false;
                } else if (!allowedTypes.includes(typeof item)) {
                    return false;
                }
            }
        }

        // Looking for complex types in subject
        if (typeof itemSchema === 'object' || Array.isArray(itemSchema)) {
            for (let item of subject) {
                if (typeof item !== 'object' && !Array.isArray(item)) return false;
                if (!validateSchema(item, itemSchema)) return false;
            }
        }
    }

    if (typeof schema === 'object') {
        if (typeof subject !== 'object' || subject === null) return false;

        for (let [key, valueSchema] of Object.entries(schema)) {
            const isOptional = key.endsWith('?');
            key = isOptional ? key.slice(0, -1) : key;

            if (!subject.hasOwnProperty(key)) {
                if (isOptional) continue;
                else return false;
            }

            const value: unknown = (subject as any)[key];

            if (typeof valueSchema === 'string') {
                const allowedTypes = valueSchema.split('|');
                if (isOptional) allowedTypes.push('undefined');

                if (value === null && !allowedTypes.includes('null')) {
                    return false;
                } else if (value !== null && !allowedTypes.includes(typeof value)) {
                    return false;
                }
            }

            if (typeof valueSchema === 'object' || Array.isArray(valueSchema)) {
                if (typeof value !== 'object' && !Array.isArray(value)) return false;
                if (!validateSchema(value, valueSchema)) return false;
            }
        }
    }

    return true;
};

const response: { data: unknown } = {
    data: [
        {
            id: 1,
            title: 'test',
            content: 'test',
            lastSaved: null,
            authors: ['me'],
            comments: [{ id: 1, message: 'string' }]
        }
    ]
};

// type ResponseType = {
//     id: number | string;
//     title: string;
//     content: string;
//     lastSaved: number | null;
//     comments?: { id: number; message: string }[];
// }[];

const noteSchema = [
    {
        id: 'number|string',
        title: 'string',
        content: 'string',
        lastSaved: 'number|null|undefined',
        authors: ['string|number'],
        'comments?': [{ id: 'number', message: 'string' }]
    }
] as const;

export const result = validateSchema(response.data, noteSchema);

if (validateSchema(response.data, noteSchema)) {
    response.data[0].title;
}

export default validateSchema;
