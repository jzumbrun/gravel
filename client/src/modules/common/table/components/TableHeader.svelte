<script lang="ts">
  export let column
  export let sortBy: string
  export let sortDirection: number

  let iconName = 'sort', 
    sortIcon = null, 
    cursor = 'inherit', 
    onClick = false, 
    width = column.width || 100

  if(column.id == sortBy) {
    iconName = (sortDirection == 1) ? 'sort-by-attributes' : 'sort-by-attributes-alt'
  }

  // if(column.sortable != false) {
  //   // if the column is sortable, make the header cell clickable
  //   sortIcon = (<span class={'pull-right ' + iconName}></span>)
  //   cursor = 'pointer'
  //   onClick = handleSortChange.bind(this, index)
  // }
</script>

<th
  class={column.headerCellClass || ''}
>
  {column.title}
  {#if column.sortable != false}
    <!--on:click={onClick}-->
    <span class={'pull-right ' + iconName}></span>
  {/if}
</th>

<style>
  th {
    cursor: cursor;
    white-space: 'normal';
    width: width;
  }
</style>
