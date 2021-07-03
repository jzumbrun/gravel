<script lang="ts">
  import TableCell from './TableCell.svelte'

  export let row: Record<string, any>
  export let columns: {
    id: string;
    class: string;
    cellFormat: any;
  }[]
  export let rowFormat: (key: string, row: Record<string, any>) => void

</script>

{#if rowFormat}
  <svelte:component this={rowFormat} />
{:else}
  <tr class={row.class || ''} >
    {#each columns as column }
      <TableCell row={row} cell={column} />
    {/each}
  </tr>
{/if}
