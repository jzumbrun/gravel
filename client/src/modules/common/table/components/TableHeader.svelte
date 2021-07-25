<script lang="ts">
  import type { IColumn } from './types'

  export let column: IColumn
  export let sortBy: string
  export let sortDirection: number
  export let onChange: (sortBy: string, sortDirection: number) => void

  $:icon = column.id !== sortBy ? '' : getIcon()

  function getIcon() {
    return sortDirection == 1 ? '▲' : '▼'
  }

  function handleChange() {
    sortDirection = sortDirection === 1 ? -1 : 1
    icon = getIcon()
    onChange(column.id, sortDirection)
  }

</script>

<th>
  
  {#if column.sortable}
    <button class={'btn'} on:click={handleChange}>{column.title}</button>
    <span>{icon}</span>
  {:else}
    {column.title}
  {/if}
</th>

<style>
  th {
    cursor: cursor;
    white-space: 'normal';
    width: width;
  }

  button {
    margin-bottom: 3px;
    padding: 0 5px;
  }
</style>
