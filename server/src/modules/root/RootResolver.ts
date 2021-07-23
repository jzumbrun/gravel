import { Kind, GraphQLString,
  GraphQLInputObjectType, GraphQLNonNull, GraphQLInt } from 'graphql'
import BaseResolver from '../../libs/BaseResolver'
import Schema from '../../libs/Schema'

export default class RootResolver extends BaseResolver {

  /**
   * Types
   */
  static types({ inputTypes, scalarTypes, createScalarType }: Schema) {
    // Inputs
    inputTypes.Collation = new GraphQLInputObjectType({
      name: 'Collation',
      fields: () => ({ 
        limit: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        sortBy: { type: GraphQLString},
        sortDirection: { type:  GraphQLInt },
        searchBy: { type: GraphQLString},
        searchValue: { type: GraphQLString},
      })
    })

    scalarTypes.Date = createScalarType({
      name: 'Date',
      description: 'Date is not valid.',
      kind: Kind.STRING,
      serialize: (v: any) => new Date(v).toJSON(),
      validate: (v: any) => !isNaN((new Date(v)).getTime()),
      format: (v: any) => new Date(v)
    })

  }

    
}
