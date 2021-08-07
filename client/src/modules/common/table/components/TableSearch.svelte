<script lang="ts">
  import Dropdown from '../../dropdown/components/Dropdown.svelte'
  import type { IDropdownLink } from '../../dropdown/components/types'
  import type { IColumn } from './types'

  export let onChange: (by: string, value: string) => void
  export let searchPlaceholder: string
  export let columns: IColumn[]
  let value: string = ''

  function handleBy(link: IDropdownLink) {
    if(value)
      onChange(link.value, value)
  }

  function handleClear(link: IDropdownLink) {
      value = ''
      onChange('', '')
  }

</script>

<div class="input-group">
  <input 
    class="search form-control"
    bind:value={value}
    placeholder={searchPlaceholder}
  />

  <Dropdown
    trigger={{label: ''}}
    buttonClass="buttonClass"
    links={columns.map((col) => {
      return {label: col.title, value: col.id, handleClick: handleBy}
    }).concat([{label: '[Clear]', value: '', handleClick: handleClear}])}
  />
</div>

<style>
  :global(.dropdown .buttonClass) {
    padding: 23px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
</style>