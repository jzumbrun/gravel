import { GraphQLOutputType, GraphQLInputObjectType, GraphQLScalarType,
  GraphQLFieldConfigMap } from 'graphql'

const specific = <T>() => <U extends T>(argument: U) => argument;


export default class Schema {
  outputTypes: Record<string, ((...args: any[]) => GraphQLOutputType) | GraphQLOutputType> = {}
  inputTypes: Record<string, ((...args: any[]) => GraphQLInputObjectType) | GraphQLInputObjectType> = {}
  scalars: Record<string, ((...args: any[]) => GraphQLScalarType) | GraphQLScalarType> = {}
  queries: GraphQLFieldConfigMap<any, any> = {}
  mutations: GraphQLFieldConfigMap<any, any> = {}
}
