import Store from '../../../lib/Store'
import { alertStore } from '../../alerts/stores/AlertStore'

interface ITableStore {
	tables?: {
		[key: string]: Record<string, any>[]
	}
}

interface ILoadData {
	id: string
	query?: string
	variables?: Record<string, any>
}

class TableStore extends Store<ITableStore> {

	constructor() {
		super({ tables: undefined })
	}

	setData(id: string, data: Record<string, any>[]) {
		this.update(s => {
			if(!s.tables) s.tables = { [id]: data }
			else s.tables[id] = data
			return s
		}, `setData.success.${id}`)
	}

	getData(id: string) {
		const data = this.get().tables
		if(!data) return []
		return this.get().tables[id]
	}

	async loadData({ id, query, variables }: ILoadData) {

		// Get data from server
		if(query) {
			const results = await this.graphQl<Record<string, unknown[]>>(query, variables)
			if(results.errors.length) alertStore.add(results.errors)
			this.update(s => {
				s.tables[id] = Object.values(results.data)[0] || [{}]
				return s
			}, `getData.success.${id}`)
		} else {
			this.update(s => s, `getData.success.${id}`)
		}
	}

	refresh(id){
		this.update(s => s, `refresh.success.${id}`)
	}

}

export const tableStore = new TableStore()
