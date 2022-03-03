<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { had_form } from "../../questions/had_questions.js";
  import RadioInput from "../../components/RadioInput.svelte";
  import ErrorNotification from "../../components/ErrorNotification.svelte";
  import SuccessPage from "../../components/SuccessPage.svelte";
  import LoadingSpinner from "../../components/LoadingSpinner.svelte";
  import SubmitButton from "../../components/SubmitButton.svelte";
  import ErrorPage from "../../components/ErrorPage.svelte";

  metatags.title = "HADS | CP+R";

  const form_responses = {};
  const { id } = $params;

  let submitting = false;
  let show_success = false;

  const validateID = (async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PROD}/validate_had_link/${id}`
    );
    if (response.status === 202) {
      return true;
    } else if (response.status === 409) {
      show_success = true;
    } else {
      throw new Error();
    }
  })();

  const submit = () => {
    submitting = true;

    const total = Object.values(form_responses).reduce((acc, cur) => {
      return acc + cur;
    }, 0);

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
        if (response.status === 201) {
          show_success = true;
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch(() => {
        new ErrorNotification({
          target: document.body,
          props: {
            error_message:
              "There was an error submitting your form. Please contact your Cardiac Coach if this error persists.",
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
        {#each had_form as { title, options, scores }, x}
          <div class="mb-7">
            <h2 class="text-2xl font-bold">{title}</h2>
            {#each options as option, y}
              <RadioInput
                name={title}
                value={scores[y]}
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
    <ErrorPage
      error_message={"We were unable to find a form linked to this URL. Please contact your Cardiac Coach if this problem persists."}
    />
  {/await}
{/if}
