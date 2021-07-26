<script lang='ts'>
  import type { IColumn } from '../../../common/table/components/types'

  export let row: Record<string, any>
  export let cell: IColumn</script>

<td class={cell.class || ''} id={cell.id}>
  <a href="mailto:{row[cell.id]}">{row[cell.id]}</a>
</td>