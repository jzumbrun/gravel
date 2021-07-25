<script lang="ts">
  export let onLimitChange: (e: Event) => void
  export let limit: number
  const limits = [20, 50, 100, 250, 500]
</script>

<select class="form-control" bind:value={limit} on:click={onLimitChange} >
  {#each limits as lim}
    <option value={lim}>{lim}</option>
  {/each}
</select>
