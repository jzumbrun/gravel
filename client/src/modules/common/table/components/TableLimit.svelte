<script lang="ts">
  export let onLimitChange: () => void
  export let limit: number
  const limits = [10, 25, 50, 100, 250, 500]
</script>

<select class="form-control" bind:value={limit} on:blur={onLimitChange} >
  {#each limits as lim}
    <option value={lim}>{lim}</option>
  {/each}
</select>
