export type ITypes = 'blob' | 'tree';
export interface IEntry {
  name: string;
  oid: string;
  type: ITypes;
  __typename: string;
}
