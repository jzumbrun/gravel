import { GraphQLOutputType, GraphQLInputObjectType, GraphQLScalarType,
  GraphQLFieldConfigMap, GraphQLError } from 'graphql'

import { IParseScalarType, ICreateScalarType } from './types'

export default class Schema {
  outputTypes: Record<string, GraphQLOutputType> = {}
  inputTypes: Record<string, GraphQLInputObjectType> = {}
  scalarTypes: Record<string, GraphQLScalarType> = {}
  queries: GraphQLFieldConfigMap<any, any> = {}
  mutations: GraphQLFieldConfigMap<any, any> = {}

  /**
   * Parse Scalar
   */
  static parseScalarType({value, description, ast, kind, validate, format}: IParseScalarType): IParseScalarType['format'] {

    format = format || ((v: any) => v)
    validate = validate || ((v: any) => true)
  
    if (ast) {
      if (ast.kind === kind && validate(ast.value))
        return format(ast.value)
    }
    else if (validate(value))
      return format(value)
    throw new GraphQLError(description)
  }

  /**
   * Create Scalar Type
   */
  createScalarType({ name, description, kind, serialize, validate, format }: ICreateScalarType): GraphQLScalarType {

    return new GraphQLScalarType({
      name: name,
      description: description,
      serialize: serialize || (function (value) { return value }),
      parseValue: (value) => Schema.parseScalarType({ value, description, validate, format }) ,
      parseLiteral: (ast) => Schema.parseScalarType({ ast, kind, description, validate, format })
    })
  }

}
