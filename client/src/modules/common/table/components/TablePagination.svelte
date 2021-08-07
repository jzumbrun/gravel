<script lang="ts">

  export let onChange: (e: Event, name: string) => void
  export let pageInfo: string
  export let page = 1
  export let pages = 0

  $:prevAvailable = page !== 1
  $:nextAvailable = page < pages

</script>

<div class="pagination-centered mt-2">
  <ul class="pagination">
    {#if prevAvailable}
      <li class={'arrow'}>
        <button class="btn" on:click={(e) => onChange(e, 'first')}>«</button>
      </li>
      <li class={'button-prev'}>
        <button class="btn" on:click={(e) => onChange(e, 'previous')}>&lt;</button>
      </li>
    {/if}
    <li class="page-info unavailable" >
      {pageInfo}
    </li>
    {#if nextAvailable}
      <li class={'button-next '}>
        <button class="btn" on:click={(e) => onChange(e, 'next')}>&gt;</button>
      </li>
    
      <li class={'arrow'}>
        <button class="btn" on:click={(e) => onChange(e, 'last')}>»</button>
      </li>
    {/if}
  </ul>
</div>


<style>

  button {
    padding: 2px 8px;
    margin: 0px 3px 0px 3px;
    border: 1px solid rgba(255,255,255,.4);
    border-radius: .5rem;
  }

  .page-info {
    padding: 2px 8px;
    margin: 0px 0px 0px 0px;
  }
  
</style>