<script lang="ts">
  export let onSearchChange: (search: string) => void
  export let searchPlaceholder: string
  export let search: string

  function handleChange(e){
    search = e.target.value
    onSearchChange(search)
  }
</script>

<input 
  type="search"
  class="form-control"
  value={search}
  placeholder={searchPlaceholder}
  on:change={handleChange}
/>
 