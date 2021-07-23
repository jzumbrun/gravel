
import { Collection, FilterQuery } from 'mongodb'
import Database from './Database'
import { ICollation } from '../libs/types'


export default class BaseModel<TRecord> {

  private collection!: Collection<TRecord>

  collectionName!: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
    this.collection = Database.collection<TRecord>(collectionName)
  }

  /*
   * Get Collection
   */
  getCollection() {
    return this.collection
  }

  /**
   * Collate
   */
   collate(query: FilterQuery<TRecord>, collation: ICollation) {
    if(collation.searchBy && collation.searchValue)
      query = {...query, [collation.searchBy]: collation.searchValue}
    return this.getCollection().find(query).limit(collation.limit || 20)
      .skip(collation.skip || 0)
      .sort({[collation.sortBy || '_id']: collation.sortDirection || 1})
  }

}
