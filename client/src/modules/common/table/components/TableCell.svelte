<script lang="ts">
  import type { IColumn } from './types'

  export let row: Record<string, any>
  export let cell: IColumn

</script>

{#if cell.component}
  <svelte:component this={cell.component} row={row} cell={cell}/>
{:else}
  <td class={cell.class || ''} id={cell.id}>
    <div class="thead">{cell.title}</div>
    {row[cell.id]}
  </td>
{/if}


<style>
  @media screen and (min-width: 39.9375em) {
    .thead {
      display: none;
    }
  }

  @media screen and (max-width: 39.9375em) {

    .thead {
      text-align: center;
    }
    td {
      display: block;
      width: 400px;
      text-align: center;
    }
  }

</style>
