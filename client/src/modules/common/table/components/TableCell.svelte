<script lang="ts">
 
  export let row: Record<string, any>
  export let cell: {
    id: string
    class: string
    cellFormat: any
  }

</script>

{#if cell.cellFormat}
  <svelte:component this={cell.cellFormat} />
{:else}
  <td class={cell.class || ''} id={cell.id}>
    {row[cell.id]}
  </td>
{/if}

