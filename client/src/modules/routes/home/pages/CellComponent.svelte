<script lang='ts'>
  import type { IColumn } from '../../../common/table/components/types'

  export let row: Record<string, any>
  export let cell: IColumn
</script>

<td class={cell.class || ''} id={cell.id}>
  <div class="thead">{cell.title}</div>
  <a href="mailto:{row[cell.id]}">{row[cell.id]}</a>
</td>

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