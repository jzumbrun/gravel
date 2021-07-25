<script lang="ts">
  import Dropdown from '../../dropdown/components/Dropdown.svelte'

  export let onSearchChange: (by: string, value: string) => void
  export let searchPlaceholder: string
  export let searchList: string[]
  export let by: string
  export let value: string

  function handleBy(e: Event) {
    debugger
    by = (e.target as HTMLInputElement).value
    onSearchChange(by, value)
  }

</script>

<div class="input-group">
  <input 
    type="search"
    class="form-control"
    value={value}
    placeholder={searchPlaceholder}
  />

  <Dropdown
    trigger={{label: ''}}
    buttonClass="buttonClass"
    links={searchList.map((text) => {
      return {text, handleClick: handleBy}
    })}
  />
</div>

<style>
  :global(.dropdown .buttonClass) {
    padding: 23px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>