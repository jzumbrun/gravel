import Store from '../../../lib/Store'
import { alertStore } from '../../alerts/stores/AlertStore'

interface ITableStore {
	tables?: {
		[key: string]: {
			rows: Record<string, any>[]
			total: number
		}
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

	setStoreTable(s: ITableStore, id: string, rows: Record<string, any>[], total: number = 0): ITableStore {
		if(!s.tables) s.tables = { [id]: { rows, total} }
		else s.tables[id] = { rows, total}
		return s
	}

	setData(id: string, rows: Record<string, any>[]) {
		this.update(s => {
			return this.setStoreTable(s, id, rows, rows.length )
		}, `setData.success.${id}`)
	}

	getData(id: string) {
		const data = this.get().tables
		if(!data) return { rows: [], total: 0}
		return this.get().tables[id]
	}

	async loadData({ id, query, variables }: ILoadData) {

		// Get data from server
		if(query) {
			const results = await this.graphQl<Record<string, unknown[]>>(query, variables)
			if(results.errors?.length) alertStore.add(results.errors)

			this.update(s => {
				const [rows, total] = Object.values(results.data) as [any[], number]
				return this.setStoreTable(s, 'home', rows || [], total !== undefined ? total: s.tables[id].total)
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
