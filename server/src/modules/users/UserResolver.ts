import { GraphQLObjectType, GraphQLID, GraphQLString,
  GraphQLInputObjectType, GraphQLList, Kind,
  GraphQLNonNull, GraphQLInt } from 'graphql'
import BaseResolver from '../../libs/BaseResolver'
import Schema from '../../libs/Schema'
import Mailer from '../../libs/Mailer'
import { IApp } from '../../libs/types'
import UserModel, { User } from './UserModel'
import Config from '../../libs/Config'
import forgotEmailTemplate from './templates/email/forgot' 

export default class UserResolver extends BaseResolver {

  userModel: UserModel

  constructor(app: IApp) {
    super(app)
    this.userModel = new UserModel()
  }

  /**
   * Types
   */
  static types({ outputTypes, inputTypes, scalarTypes, queries, mutations, createScalarType }: Schema) {

    // Outputs
    outputTypes.User = new GraphQLObjectType({
      name: 'User',
      fields: () => ({
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        createdAt: { type: scalarTypes.Date },
        updatedAt: { type: scalarTypes.Date },
        deleteAt: { type: scalarTypes.Date }
      })
    })

    outputTypes.Message = new GraphQLObjectType({
      name: 'Message',
      fields: () => ({ 
        message: { type: GraphQLString }
      })
    })

    outputTypes.Token = new GraphQLObjectType({
      name: 'Token',
      fields: () => ({ 
        token: { type: GraphQLString }
      })
    })
    
    // Inputs
    inputTypes.UserSignup = new GraphQLInputObjectType({
      name: 'UserSignup',
      fields: () => ({ 
        firstName: { type: GraphQLNonNull(scalarTypes.NonEmptyString) },
        lastName: { type: GraphQLNonNull(scalarTypes.NonEmptyString) },
        email: { type: GraphQLNonNull(scalarTypes.Email) },
        password: { type: GraphQLNonNull(scalarTypes.Password) }
      })
    })

    inputTypes.UserForgotPassword = new GraphQLInputObjectType({
      name: 'UserForgotPassword',
      fields: () => ({ 
        email: { type: GraphQLNonNull(scalarTypes.Email) }
      })
    })

    inputTypes.UserSignin = new GraphQLInputObjectType({
      name: 'UserSignin',
      fields: () => ({ 
        email: { type: GraphQLNonNull(scalarTypes.Email) },
        password: { type: GraphQLNonNull(scalarTypes.Password) }
      })
    })

    inputTypes.UserUpdate = new GraphQLInputObjectType({
      name: 'UserUpdate',
      fields: () => ({ 
        firstName: { type: scalarTypes.NonEmptyString },
        lastName: { type: scalarTypes.NonEmptyString },
        email: { type: scalarTypes.Email },
        password: { type: scalarTypes.Password }
      })
    })

    // Scalars
    scalarTypes.NonEmptyString = createScalarType({
      name: 'NonEmptyString',
      description: 'Input must not be empty',
      kind: Kind.STRING,
      validate: (v: any) => v.length > 0
    })

    scalarTypes.Password = createScalarType({
      name: 'Password',
      description: 'Password must be greater than 7 and less than 50',
      kind: Kind.STRING,
      serialize: () => '********',
      validate: (v: any) => v.length > 7 && v.length < 50 
    })

    scalarTypes.Email = createScalarType({
      name: 'Email',
      description: 'Email must contain a @ and a . character',
      kind: Kind.STRING,
      validate: (v: any) => /^\S+@\S+\.\S+$/.test(v)
    })

    // Queries
    queries.users = {
      args: { collation: { type: inputTypes.Collation } },
      type: GraphQLList(outputTypes.User),
      resolve: this.resolve(UserResolver, 'resolveUsers')
    }

    queries.usersCount = {
      type: GraphQLInt,
      resolve: this.resolve(UserResolver, 'resolveUsers')
    }

    queries.self = {
      type: outputTypes.User,
      resolve: this.resolve(UserResolver, 'resolveSelf')
    }

    // Mutations
    mutations.signUp = {
      args: { user: { type: inputTypes.UserSignup } },
      type: outputTypes.Token,
      resolve: this.resolve(UserResolver, 'resolveSignup')
    }

    mutations.signIn = {
      args: { user: { type: inputTypes.UserSignin } },
      type: outputTypes.Token,
      resolve: this.resolve(UserResolver, 'resolveSignin')
    }

    mutations.forgotPassword = {
      args: { user: { type: inputTypes.UserForgotPassword } },
      type: outputTypes.Message,
      resolve: this.resolve(UserResolver, 'resolveForgotPassword')
    }

    mutations.updateSelf = {
      args: { user: { type: inputTypes.UserUpdate } },
      type: outputTypes.Token,
      resolve: this.resolve(UserResolver, 'resolveUpdateSelf')
    }
  }

  /**
  * Get Token
  */
  async getToken(user: User): Promise<{ token: string }> {
    const auth = this.getAuth()
    await auth.generateToken({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      auth: user.auth
    })
    return { token: auth.getToken() }
  }

  /**
   * Resolve Signup
   */
  async resolveSignup(): Promise<{ token: string }> {
    const user = await this.userModel.signUp(this.getArgs().user)
    return this.getToken(user)

  }

  /**
   * Resolve Signin
   */
  async resolveSignin(): Promise<{ token: string }> {
    const user = await this.userModel.signIn(this.getArgs().user)
    return this.getToken(user)

  }

  /**
   * Forgot Password
   */
  async resolveForgotPassword(): Promise<{ message: string }> {
    const user = await this.userModel.forgotPassword(this.getArgs().user)
    await this.getAuth().generateToken({ _id: user._id }, '5m')
    const mailer = new Mailer()
    const url = `${Config.get('resetPassword.url')}${encodeURIComponent(this.getAuth().getToken())}`
    const result = await mailer.send('Password reset.', forgotEmailTemplate('Jon', url), this.getArgs().user.email)
    if(result.results?.total_accepted_recipients) {
      return { message: 'Email with password reset link sent. Link expires in 5 mins.' }
    }
    throw Error('Error sending password reset link.')
  }

  /**
   * Resolve Users
   */
  resolveUsers(): Promise<Partial<User>[]> {
    const session = this.getAuth().getSession()
    if(session?.auth?.includes('admin')) {
      return this.userModel.getUsers(this.getArgs())
    }
    throw Error('Requires admin access!')
  }

  /**
   * Resolve Users Count
   */
  resolveUsersCount(): Promise<number> {
    const session = this.getAuth().getSession()
    if(session?.auth?.includes('admin'))
      return this.userModel.getUsersCount()
    throw Error('Requires admin access!')
  }

  /**
   * Resolve Self
   */
  resolveSelf(): Promise<Partial<User>> {
    const session = this.getAuth().getSession()
    return this.userModel.getUser(session?._id)
  }

  /**
   * Resolve Update Self
   */
   async resolveUpdateSelf(): Promise<{ token: string }> {
    const session = this.getAuth().getSession()
    const user = await this.userModel.updateUser(session._id, this.getArgs().user)
    return this.getToken(user)
  }
    
}
