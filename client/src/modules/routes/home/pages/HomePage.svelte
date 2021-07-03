<script lang="ts">
  import { userStore } from  '../../users/stores/UserStore'
  import { onMount } from 'svelte'
  import { modalStore } from '../../../common/modals/stores/ModalStore'
  import ThingOneModal from '../modals/ThingOneModal.svelte'
  import ThingTwoModal from '../modals/ThingTwoModal.svelte'
  import Table from '../../../common/table/components/Table.svelte'
  import { tableStore } from '../../../common/table/stores/TableStore'


  onMount(() => {
    userStore.validateAuth()
    tableStore.setData('home', [{
      thing1: '1',
      thing2: '2'
    }])
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
    title= "things"
    columns={[
      { id: 'thing1', title: 'Thing One' },
      { id: 'thing2', title: 'Thing Two' }
    ]}
  />

  <div class="row mt-2">
    <a href="/about">About</a>
  </div>
</main>
