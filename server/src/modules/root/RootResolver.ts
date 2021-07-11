import { GraphQLObjectType, GraphQLString, GraphQLType,
  GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql'
import BaseResolver from '../../libs/BaseResolver'
import Schema from '../../libs/Schema'

export default class RootResolver extends BaseResolver {

  /**
   * Types
   */
  static types({ outputTypes, inputTypes, scalars, queries, mutations }: Schema) {

    // Outputs
    outputTypes.Paginated = (outputType: GraphQLType) => new GraphQLObjectType({
      name: 'Paginated',
      fields: () => ({ 
        rows: { type: GraphQLList(outputType) },
        count: { type: GraphQLInt }
      })
    })
    
    // Inputs
    inputTypes.Pagination = new GraphQLInputObjectType({
      name: 'Pagination',
      fields: () => ({ 
        limit: { type: GraphQLNonNull(GraphQLInt) },
        skip: { type: GraphQLNonNull(GraphQLInt) },
        sort: { type: GraphQLNonNull(GraphQLString) }
      })
    })

  }

    
}
