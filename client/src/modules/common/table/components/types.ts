import type { SvelteComponent } from 'svelte'
export interface IColumn {
  id: string
  title?: string
  class?: string
  component?: typeof SvelteComponent
  sortable?: boolean
}

export interface ICollation {
  limit?: number
  page?: number
  sortBy?: string
  sortDirection?: number
  searchBy?: string
  searchValue?: string
}