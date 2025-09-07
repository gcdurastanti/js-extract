// Type definitions for js-extract v3

declare type QueryString = string;
declare type QueryObject = Record<string, Array<string | QueryObject>>;
declare type QueryArray = string[];
declare type Query = QueryString | QueryObject | QueryArray;

declare type ExtractResult = Record<string, any>;

declare function extract(query: Query): {
  selectors: string[];
  from: (data: Record<string, any>) => ExtractResult;
};

export = extract;
