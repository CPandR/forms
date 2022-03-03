<script>
  export let error_message = `It looks like you've taken a wrong turn. If you were expecting to submit a
    form, please try following the link sent via email again or contact your
    Cardiac Coach.`;
</script>

<div class="error w-full flex flex-col items-center">
  <div class="text-5xl mb-4 font-bold">Uh oh!</div>
  <p class="description">
    {error_message}
  </p>
</div>

<style>
  .error {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .description {
    max-width: 800px;
    font-size: 1.1rem;
  }
</style>
