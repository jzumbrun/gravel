import type { SvelteComponent } from 'svelte'
export interface IColumn{
  id: string
  title?: string
  class?: string
  component?: typeof SvelteComponent
  sortable?: boolean
}