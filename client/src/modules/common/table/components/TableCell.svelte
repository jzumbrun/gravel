<script lang="ts">
  import type { IColumn } from './types'

  export let row: Record<string, any>
  export let cell: IColumn

</script>

{#if cell.component}
  <svelte:component this={cell.component} row={row} cell={cell}/>
{:else}
  <td class={cell.class || ''} id={cell.id}>
    {row[cell.id]}
  </td>
{/if}

