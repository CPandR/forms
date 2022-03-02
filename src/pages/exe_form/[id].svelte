<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { onMount } from "svelte";
  import { exe_form } from "./exe_questions";
  import RadioInput from "../../components/RadioInput.svelte";
  import ErrorNotification from "../../components/ErrorNotification.svelte";
  import SuccessPage from "../../components/SuccessPage.svelte";

  metatags.title = "Exercise Form";

  const { id } = $params;
  const form_responses = {};
  let show_success = false;
  let submitting = false;

  const validateID = (async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PROD}/validate_user/${id}`
    );
    if (response.status === 200) {
      return true;
    } else {
      throw new Error(response.statusText);
    }
  })();

  const submit = () => {
    submitting = true;
    const total = Object.values(form_responses).reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    fetch(`${import.meta.env.VITE_PROD}/submit_exe_form/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total,
        form_responses,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          show_success = true;
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch(() => {
        // create new error toast
        new ErrorNotification({
          target: document.body,
          props: {
            error_message:
              "There was an error submitting your form. Please contact your cardiac coach if this error persists.",
          },
        });
      })
      .finally(() => {
        submitting = false;
      });
  };
</script>

{#if show_success}
  <SuccessPage />
{:else}
  {#await validateID}
    <div class="flex items-center justify-center">
      <div
        class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {:then}
    <div class="container mx-auto mt-1">
      <h1 class="text-3xl font-bold">Exercise & Confidence Form</h1>
      <div class="bg-white-300 my-3">
        <p class="mb-3">
          Knowing more about how you feel about right now will ensure that we
          are able to help you more effectively during your programme.
        </p>

        <p class="mb-5">
          Read each item and tick the box that comes closest to how you have
          been feeling in the past 2 weeks. Don’t take too long over your
          replies; your immediate reaction to each item will probably be more
          accurate than a long thought-out response.
        </p>
      </div>

      <form on:submit|preventDefault={submit}>
        {#each exe_form as question, x}
          <div class="mb-7" aria-label="radiogroup">
            <h2 class="text-2xl font-bold">{question.title}</h2>
            {#each question.options as option, y}
              <RadioInput
                name={question.title}
                value={y}
                bind:group={form_responses[`q${x + 1}`]}
                label={option}
              />
            {/each}
          </div>
        {/each}
        <div class="flex">
          <button
            class="{submitting
              ? 'bg-black text-white'
              : null} transition ease-in-out outline outline-1 py-1.5 px-3 mb-7 text-lg flex items-center hover:ease-in focus:bg-black focus:text-white hover:bg-black hover:text-white duration-300 focus:ring focus:ring-blue-300 {submitting}"
            type="submit"
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
        </div>
      </form>
    </div>
  {:catch}
    <div>
      <p>
        We were unable to find a form linked to this address. Please contact
        your cardiac coach if this problem persists.
      </p>
    </div>
  {/await}
{/if}
