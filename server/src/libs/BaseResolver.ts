import { GraphQLError, GraphQLScalarType, GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'
import Schema from './Schema'
import Auth from './Auth'
import { IServerRequest, IApp } from './types'

export default class BaseResolver {

  private app!: IApp

  constructor(app: IApp) {
    this.app = app
  }

  /**
   * Types
   */
  static types(schema: Schema) { }

  /**
   * Resolve
   */
  static resolve(Resolver: any, func: string): GraphQLFieldResolver<any, any, any> {
    return (_source: any, args: Record<string, any>, _context: any, info: GraphQLResolveInfo) => {
      const resolve = new Resolver({ args, info })
      return resolve[func]()
    }
  }

  /**
   * Get Auth
   */
  getAuth(): Auth {
    return this.app.info.rootValue.auth
  }

  /**
   * Get Request
   */
  getRequest(): IServerRequest {
    return this.app.info.rootValue.request
  }

  /**
   * Get Args
   */
  getArgs() {
    return this.app.args
  }

  /**
   * Get Info
   */
  getInfo() {
    return this.app.info
  }
  
}
