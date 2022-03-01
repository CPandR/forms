<script>
  export let error_message = "An error occured";

  let nodeRef;
</script>

<div class="fixed top-0 right-0 m-2" bind:this={nodeRef}>
  <div class="bg-red-500 text-white">
    <hr />
    <div class="p-4">
      <button on:click={() => nodeRef.parentNode.removeChild(nodeRef)}>
        x
      </button>
      {error_message}
    </div>
  </div>
</div>
