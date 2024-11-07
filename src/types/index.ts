export type HttpErrors = Record<string, string[]>;

export type User = {
    id: number;
    name: string;
    email: string;
    updated_at: string;
    created_at: string;
    tasks: Task[];
};

export type Task = {
    id: number;
    title: string;
    status: 'to-do' | 'in-progress' | 'done';
    user_id: User['id'];
    created_at: string;
    updated_at: string;
};

// Schema Validation
type PrimitivesMap = {
    string: string;
    number: number;
    boolean: boolean;
    null: null;
    undefined: undefined;
};

export type Optional<T, K extends keyof T> = Resolve<Omit<T, K> & Partial<T>>;
export type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };

export type BaseSchema = ReadonlyArray<any> | Record<string, any>;

export type SchemaToType<Type extends BaseSchema> = Type extends ReadonlyArray<any>
    ? ResolveValueType<Type[0]>[]
    : ResolveObjectSchema<ResolveOptional<Type>>;

type ResolveObjectSchema<T> = Resolve<{
    -readonly [Key in keyof T as Key extends `${infer OptionalKey}?`
        ? OptionalKey
        : Key]: ResolveValueType<T[Key]>;
}>;

type ResolveValueType<T> = T extends string
    ? StringToType<T>
    : T extends BaseSchema
    ? SchemaToType<T>
    : never;

type ResolveOptional<T> = Optional<T, OptionalKeys<keyof T>>;
type OptionalKeys<T> = T extends `${string}?` ? T : never;

type StringTypeUnion<Type> = Type extends `${infer T1 extends keyof PrimitivesMap}|${infer T2}`
    ? PrimitivesMap[T1] | StringToType<T2>
    : Type extends `:${infer T1}|${infer T2}`
    ? T1 | StringToType<T2>
    : never;

type StringToType<TypeName extends string> = TypeName extends keyof PrimitivesMap
    ? PrimitivesMap[TypeName]
    : TypeName extends `${string}|${string}`
    ? StringTypeUnion<TypeName>
    : TypeName extends `:${infer CustomType}`
    ? CustomType
    : never;
