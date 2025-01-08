export type ObjectType = {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | ObjectType
    | { optional?: string }
    | { key: string; value: string }
    | Array<ObjectType>
    | Array<string>
    | Array<number>
    | Array<boolean>
    | Array<Date>;
};

export type ParsedObjectType = {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | ParsedObjectType
    | { optional?: string }
    | { key: string; value: string }
    | Array<ParsedObjectType | string | number | boolean | Date>;
};
