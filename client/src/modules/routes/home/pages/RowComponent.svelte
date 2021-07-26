<script lang='ts'>
  import type { IColumn } from '../../../common/table/components/types'
  import TableCell from '../../../common/table/components/TableCell.svelte'

  export let index: number
  export let row: Record<string, any>
  export let columns: IColumn[]

</script>

{#if index == 0}
  <tr class="full-row" >
    <td colspan=3><button class="btn">Action</button></td>
  </tr>
{:else}
  <tr class={row.class || ''} >
    {#each columns as column }
      <TableCell row={row} cell={column} />
    {/each}
  </tr>
{/if}

<style>
  .full-row {
    background-color: rgba(255, 255, 255, 0.274);
  }
</style>