<script lang="ts">

  export let onChange: (e: Event, name: string) => void
  export let pageInfo: string
  export let page = 1
  export let pages = 0

  let prevUnavailable = page == 1 ? 'unavailable' : 'available'
  let nextUnavailable = page >= pages ? 'unavailable' : 'available'

</script>

<div class="pagination-centered">
  <ul class="pagination">
    <li class={'arrow ' + prevUnavailable}>
      <button on:click={(e) => onChange(e, 'first')}>«</button>
    </li>
    <li class={'table-button-prev ' + prevUnavailable}>
      <button onClick={(e) => onChange(e, 'previous')}>&lt;</button>
      </li>
    <li class="table-info unavailable" >
      {pageInfo}
    </li>
    <li class={'table-button-next ' + nextUnavailable}>
      <button onClick={(e) => onChange(e, 'next')}>&gt;</button>
    </li>
    <li class={'arrow ' + nextUnavailable}>
      <button onClick={(e) => onChange(e, 'last')}>»</button>
    </li>
  </ul>
</div>
