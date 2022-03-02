<script>
  export let submitting = false;
</script>

<button
  class="{submitting
    ? 'bg-black text-white'
    : null} flex justify-center transition ease-in-out outline outline-1 py-1.5 px-3 mb-7 text-lg flex items-center hover:ease-in focus:bg-black focus:text-white hover:bg-black hover:text-white duration-300 focus:ring focus:ring-blue-300  {submitting}"
  type="submit"
  style="width: calc(12ch + 1.75rem)"
  aria-label="Submit Form"
  disabled={submitting}
>
  {submitting ? "Submitting" : "Submit"}
  {#if submitting}
    <div
      class="ml-2 spinner-border animate-spin inline-block w-5 h-5 border-2 rounded-full text-white"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  {/if}
</button>
