<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { onMount } from "svelte";
  import { had_form } from "./had_questions.js";
  import RadioInput from "../../components/RadioInput.svelte";
  import ErrorNotification from "../../components/ErrorNotification.svelte";
  import SuccessPage from "../../components/SuccessPage.svelte";

  metatags.title = "HAD Form";

  const form_responses = {};
  const { id } = $params;

  let submitting = false;

  let show_success = false;

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

    // make a post request to the server
    fetch(`${import.meta.env.VITE_PROD}/submit_had_form/${id}`, {
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
      <h1 class="text-3xl font-bold">HAD Scale Form</h1>
      <div class="bg-white-300 my-3">
        <p class="mb-3">
          Here at CP+R® we are aware that emotions and how you feel play an
          important part in your overall health. Knowing more about how you feel
          will ensure that we are able to help you as effectively as possible.
          Read each item and tick the box that comes closest to how you have
          been feeling in the past week.
        </p>
        <p class="mb-5">
          Don’t take too long over your replies; your immediate reaction to each
          item will probably be more accurate than a long thought-out response.
        </p>
      </div>
      <form on:submit|preventDefault={submit}>
        {#each had_form as question, x}
          <div class="mb-7">
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
            class="bg-yellow-300 py-1 px-2 mb-7 mx-auto text-lg flex items-center"
            type="submit"
            disabled={submitting}
          >
            Submit
            {#if submitting}
              <div
                class="ml-2 spinner-border animate-spin inline-block w-6 h-6 border-3 rounded-full text-white"
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
