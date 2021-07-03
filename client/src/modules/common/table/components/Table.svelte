<script lang="ts">
  import { onMount } from 'svelte' 
  import { subscribe } from '../../../lib/helpers'
  import { tableStore } from '../stores/TableStore'
  import TablePagination from './TablePagination.svelte'
  import TableLimit from './TableLimit.svelte'
  import TableSearch from './TableSearch.svelte'
  import TableRow from './TableRow.svelte'
  import TableHeader from './TableHeader.svelte'

  let start: number = 0
  let limit: number = 10
  let total: number = 0
  let page: number = 1
  let pages: number = 1
  let filters = []
  let search: string = ''
  let pageInfo: 'no results'
  let show: boolean = true
  let rows = []

  export let id: string = ''
  export let query: string = ''
  export let variables: Record<string, any> = {}
  export let emptyResults: string = 'No results found'
  export let columns: any[] = []
  export let callbacks: any = {}
  export let sortBy: number = undefined
  export let sortDirection: string = ''
  export let width: string = ''
  export let title: string = ''
  export let showHead: boolean = true
  export let showPagination: boolean = true
  export let showSearch: boolean = true
  export let showEmpty: boolean = true
  export let searchPlaceholder: string = 'Search'
  export let rowFormat: () => void = undefined
  
  subscribe(tableStore, onDataSuccess, [`getData.success.${id}`, `setData.success.${id}`])

  subscribe(tableStore, onRefresh, `refresh.success.${id}`)

  onMount(() => {
    loadSettings()
    loadData()
  })

  function onRefresh(){
    // Kill the state first WITHOUT a setState call
    // so the table does not flash in and out
    // But only if we do not have a unique id
    if(!id) rows = []
    loadData()
  }

  function loadSettings() {

    const key = `${id}.table.settings`
    const settingsObjStorage = localStorage.getItem(key)
    let settingsObj = {}

    if(settingsObjStorage) {
      try {
        settingsObj = JSON.parse(settingsObjStorage)
      } catch(err) {
        settingsObj = {}
      }
    } else {
      settingsObj = {}
    }

    // for(const k in settingsObj) {
    //   this[k] = settingsObj[key]
    // }
  }

  // save some things to local storage
  function storeSettings() {
    let settingsObj = JSON.stringify({
      start,
      limit,
      page,
      search,
      sortBy,
      sortDirection
    })

    let key = `table.settings.${id}`

    localStorage.setItem(key, settingsObj)
  }

  function getRequestParams() {
    return {
      columns: columns.map((col) => {
        // send only column key and title
        return {
          data: col.data,
          title: col.title
        }
      }),
      start,
      limit,
      search: {
        value: search
      },
      sortBy,
      sortDirection,
      filters
    }
  }

  function loadData() {
    tableStore.loadData({ id, query, variables })
  }

  function onDataSuccess(){
    const data = tableStore.getData(id)
    total = parseInt(data.filtered)
    let indexFirst = start + 1
    let indexLast = start + limit
    indexLast = total < indexLast ? total : indexLast

    let pageInfo = `${indexFirst}-${indexLast} of ${total}`
    if(data.filtered == 0) {
      pageInfo = 'no results'
    }

    storeSettings()

    rows = onData(data)
    total = data.filtered
    pages = limit > 0 ? Math.ceil(total / limit) : 0
    show = !showEmpty && total === 0 ? false : true
  }

  function onData(data) {

    if (callbacks.onData) {
      data = callbacks.onData(data)
    }

    return data
  }

  function handleLimitChange(e) {
    
    limit = parseInt(e.target.value)
    start = 0
    page = 1
    loadData()
  }

  function handleSearchChange(e) {
    search = e.target.value
    start = 0
    page = 1
    loadData()

  }

  function handlePageChange(e, direction) {
    const pages = limit > 0 ? Math.ceil(total / limit) : 0

    switch(direction) {
      case 'first':
        start = 0
        break
      case 'previous':
        start = start - limit
        break
      case 'next':
        start = start + limit
        break
      case 'last':
        start = (pages - 1) * limit
        break
    }

    if(start < 0) {
      start = 0
    }

    page = start > 0 ? ((start / limit) + 1) : 1

    loadData()
  }

  function handleSortChange(columnIndex) {

    if(sortBy == columnIndex) {
      sortDirection = sortDirection == '' ? '-' : ''
    } else {
      sortBy = columnIndex
      sortDirection = ''
    }

    loadData()
  }

  function handleQuickFilterChange(filter) {
    filters = [filter]
    loadData()
  }

</script>


{#if show}
  <div class="table-component mt-4 mb-4">
    <div class="d-flex row row-cols-auto">
      
      {#if title}
        <div class="col flex-grow-1">
          <h2 class="title inline">{title}</h2>
        </div>
      {/if}
    
      {#if showSearch}
        <div class="col" >
          <TableSearch
            searchPlaceholder={searchPlaceholder}
            search={search}
            onSearchChange={handleSearchChange.bind(this)}
          />
        </div>
      {/if}
      {#if showPagination}
        <div class="col">
          <TableLimit
            onLimitChange={handleLimitChange.bind(this)}
            limit={limit}
          />
        </div>
      {/if}
    </div>

    <div class="container">
      <table
        id={id}
      >
        {#if showHead}
          <thead>
            <tr>
              {#each columns as column, index}
                <TableHeader 
                  index={index}
                  column={column}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
              {/each}
            </tr>
          </thead>
        {/if}
        <tbody>
          {#if rows}
            {#each rows as row}
              <TableRow
                row={row}
                columns={columns}
                rowFormat={rowFormat}
              />
            {/each}
          {:else}
            <tr><td colSpan={columns.length}>{emptyResults}</td></tr>
          {/if}
        </tbody>
      </table>

      {#if showPagination && total > limit}
        <TablePagination
          pageInfo={pageInfo}
          onChange={handlePageChange}
          page={page}
          pages={pages}
        />
      {/if}
    </div>
  </div>
{/if}

<style>

  table {
    width: 100%;
    table-layout: fixed;
    border: none;
  }

  .container {
    border: 1px solid rgba(255,255,255,.4);
    border-radius: 0.5rem;
    padding: 1em;
    margin-top: 1em;
  }

  table thead {
    border: none;
  }

  table tbody {
    border: none;
  }

  table tbody td {
    padding: 1rem .625rem 1rem;
  }

  tr {
    padding-bottom: 1em;
    border: none;
  }

  table tr:last-of-type {
    border-bottom: none;
  }

  table tr td {
    overflow: hidden;
    text-overflow: ellipsis;
    transition: 0.5s;
    border: none;
  }

  @media screen and (max-width: 39.9375em) {
    table thead {
      display: none;
    }

    table td {
      font-size: 1.10em;
      font-weight: normal;
      width: 100%;
      text-align: center;
      margin: auto;
      display: block;
    }

    table td:first-child {
      padding-top: 15px;
    }

    table td:last-child {
      padding-bottom: 15px;
    }

  }
</style>