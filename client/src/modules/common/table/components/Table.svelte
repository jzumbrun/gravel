<script lang="ts">
  import { onMount, afterUpdate, SvelteComponent } from 'svelte' 
  import { subscribe } from '../../../lib/helpers'
  import { tableStore } from '../stores/TableStore'
  import TablePagination from './TablePagination.svelte'
  import TableLimit from './TableLimit.svelte'
  import TableSearch from './TableSearch.svelte'
  import TableRow from './TableRow.svelte'
  import TableHeader from './TableHeader.svelte'
  import type { IColumn, ICollation } from './types'

  let start: number = 0
  let limit: number = 20
  let total: number = 0
  let page: number = 1
  let pages: number = 0
  let searchBy: string = ''
  let searchValue: string = ''
  let pageInfo: string = 'no results'
  let show: boolean = true
  let rows = []

  export let id: string = ''
  export let query: string = ''
  export let variables: Record<string, any> = {}
  export let emptyResults: string = 'No results found'
  export let columns: IColumn[] = []
  export let callbacks: any = {}
  export let sortBy: string = columns[0].id
  export let sortDirection: number = 1
  export let title: string = ''
  export let showHead: boolean = true
  export let showPagination: boolean = true
  export let showSearch: boolean = true
  export let showEmpty: boolean = true
  export let searchPlaceholder: string = 'Search'
  export let rowComponent: typeof SvelteComponent = undefined
  
  subscribe(tableStore, onDataSuccess, [`getData.success.${id}`, `setData.success.${id}`])
  subscribe(tableStore, onRefresh, `refresh.success.${id}`)

  onMount(() => {
    loadSettings()
    loadData(true)
  })

  afterUpdate(() => {
    const key = `${id}.table.settings`
	  localStorage.setItem(key, JSON.stringify({
      limit, page, sortBy, sortDirection, searchBy, searchValue
    }))
  })

  function onRefresh() {
    loadData(true)
  }

  function loadSettings() {
    const key = `${id}.table.settings`
    const settingsObjStorage = localStorage.getItem(key)
    let settingsObj: ICollation = {}
    if(settingsObjStorage) {
      try {
        settingsObj = JSON.parse(settingsObjStorage) as ICollation
      } catch(err) {
        settingsObj = {}
      }
    } else {
      settingsObj = {}
    }
    limit = settingsObj.limit || limit
    page = settingsObj.page || page
    sortBy = settingsObj.sortBy || sortBy
    sortDirection = settingsObj.sortDirection || sortDirection
    searchBy = settingsObj.searchBy || searchBy
    searchValue = settingsObj.searchValue || searchValue

  }

  function loadData(getTotal: boolean = false) {
    const collation = { limit: limit, skip: (page - 1) * limit, sortBy, sortDirection, searchBy, searchValue}
    tableStore.loadData({ 
      id,
      query: getTotal ? query.replace('<total>', '').replace('</total>', '') : query.replace(query.match(/<total>(.*)<\/total>/m)[0], ''),
      variables: {...variables, collation} 
    })
  }

  function onDataSuccess(){
    const data = tableStore.getData(id)
    rows = onData(data.rows)
    total = data.total
    show = !showEmpty && total === 0 ? false : true
    setPageInfo()
  }

  function onData<T>(r): T {

    if (callbacks.onData) {
      r = callbacks.onData(r)
    }

    return r
  }

  function handleLimitChange(e: InputEvent) {
    
    limit = parseInt((e.target as HTMLInputElement).value)
    start = 0
    page = 1
    loadData()
  }

  function handleSearchChange(by, value) {
    searchBy = by
    searchValue = value
    start = 0
    page = 1
    loadData(true)

  }

  function setPageInfo() {

    pages = Math.ceil(total / limit)

    if(start < 0) start = 0

    page = start > 0 ? ((start / limit) + 1) : 1

    let indexFirst = start + 1
    let indexLast = start + limit
    indexLast = total < indexLast ? total : indexLast
    pageInfo = `${indexFirst}-${indexLast} of ${total}`
  }

  function handlePageChange(e, direction) {

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

    setPageInfo()
    loadData()
  }

  function handleSortChange(by: string, direction: number) {
    sortBy = by
    sortDirection = direction

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
            columns={columns}
            onChange={handleSearchChange}
          />
        </div>
      {/if}
      {#if showPagination}
        <div class="col">
          <TableLimit
            onChange={handleLimitChange}
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
              {#each columns as column}
                <TableHeader 
                  column={column}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onChange={handleSortChange}
                />
              {/each}
            </tr>
          </thead>
        {/if}
        <tbody>
          {#if rows.length}
            {#each rows as row, index}
              <TableRow
                index={index}
                row={row}
                columns={columns}
                component={rowComponent}
              />
            {/each}
          {:else}
            <tr><td colSpan={columns.length}>{emptyResults}</td></tr>
          {/if}
        </tbody>
      </table>

    </div>

    {#if showPagination && total > limit}
      <TablePagination
        pageInfo={pageInfo}
        onChange={handlePageChange}
        page={page}
        pages={pages}
      />
    {/if}
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