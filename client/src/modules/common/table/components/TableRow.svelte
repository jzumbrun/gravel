<script lang="ts">
  import type { SvelteComponent } from 'svelte'
  import TableCell from './TableCell.svelte'
  import type { IColumn } from './types'

  export let row: Record<string, any>
  export let index: number = 0
  export let columns: IColumn[]
  export let component: typeof SvelteComponent

</script>

{#if component}
  <svelte:component this={component} columns={columns} row={row} index={index}/>
{:else}
  <tr class={row.class || ''} >
    {#each columns as column }
      <TableCell row={row} cell={column} />
    {/each}
  </tr>
{/if}
