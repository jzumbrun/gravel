<script lang="ts">
  import { userStore } from  '../../users/stores/UserStore'
  import { onMount } from 'svelte'
  import { modalStore } from '../../../common/modals/stores/ModalStore'
  import ThingOneModal from '../modals/ThingOneModal.svelte'
  import ThingTwoModal from '../modals/ThingTwoModal.svelte'
  import Table from '../../../common/table/components/Table.svelte'
  import CellFormat from './CellComponent.svelte';
import RowComponent from './RowComponent.svelte';

  const query = 'query users($collation: Collation){ users(collation: $collation ) { _id firstName email } <total>usersTotal(collation: $collation)</total> }'

  onMount(() => {
    userStore.validateAuth()
  })

  
</script>

<main>
  <ThingOneModal />
  <ThingTwoModal />
  <h1>Hello Mates!</h1>
  <div class="row row-cols-auto">
    <div class="col">
      <button class="btn btn-secondary" on:click={() => modalStore.show('thingOne')}>Thing One Modal</button>
    </div>
    <div class="col">
      <button class="btn btn-outline-secondary" on:click={() => modalStore.show('thingTwo')}>Thing Two Modal</button>
    </div>
  </div>
  <Table
    id="home"
    title="things"
    columns={[
      { id: '_id', title: 'Id'},
      { id: 'email', title: 'Email', sortable: true, component: CellFormat },
      { id: 'firstName', title: 'First Name', sortable: true }
    ]}
    query={query}
    rowComponent={RowComponent}
  />

  <div class="row mt-2">
    <a href="/about">About</a>
  </div>
</main>
