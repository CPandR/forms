<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { onMount } from "svelte";
  import { exe_form } from "./exe_questions";
  import RadioInput from "../../components/RadioInput.svelte";
  import ErrorNotification from "../../components/ErrorNotification.svelte";
  import SuccessPage from "../../components/SuccessPage.svelte";
  import LoadingSpinner from "../../components/LoadingSpinner.svelte";
  import SubmitButton from "../../components/SubmitButton.svelte";

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
    <LoadingSpinner />
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
        <SubmitButton {submitting} />
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
