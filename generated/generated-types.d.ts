/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */


import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    json<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  FindInputType: { // input type
    limit?: number | null; // Int
    query?: any | null; // JSON
    skip?: number | null; // Int
    sort?: any | null; // JSON
  }
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  Collection: { // root type
    count: number; // Int!
    name: string; // String!
  }
  Database: { // root type
    empty: boolean; // Boolean!
    name: string; // String!
  }
  Mutation: {};
  Query: {};
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  JSON: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  FindInputType: NexusGenInputs['FindInputType'];
}

export interface NexusGenFieldTypes {
  Collection: { // field return type
    count: number; // Int!
    name: string; // String!
  }
  Database: { // field return type
    empty: boolean; // Boolean!
    name: string; // String!
  }
  Mutation: { // field return type
    addServer: any; // JSON!
  }
  Query: { // field return type
    checkServer: boolean; // Boolean!
    listCollections: NexusGenRootTypes['Collection'][] | null; // [Collection!]
    listDatabases: NexusGenRootTypes['Database'][] | null; // [Database!]
    query: any; // JSON!
    servers: string; // String!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    addServer: { // args
      uri: string; // String!
    }
  }
  Query: {
    checkServer: { // args
      uri: string; // String!
    }
    listCollections: { // args
      database: string; // String!
      uri: string; // String!
    }
    listDatabases: { // args
      uri: string; // String!
    }
    query: { // args
      collection: string; // String!
      database: string; // String!
      params?: NexusGenInputs['FindInputType'] | null; // FindInputType
      uri: string; // String!
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Collection" | "Database" | "Mutation" | "Query";

export type NexusGenInputNames = "FindInputType";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "JSON" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}