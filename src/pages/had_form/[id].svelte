<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { onMount } from "svelte";
  import { had_form } from "./had_questions.js";
  import RadioInput from "../../components/RadioInput.svelte";

  metatags.title = "HAD Form";

  const form_responses = {};

  const validateID = (async () => {
    const { id } = $params;

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
    console.log(form_responses);
  };
</script>

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
    <h1 class="text-3xl font-bold my-1">HAD Scale Form</h1>
    <div class="bg-white-300">
      <p>
        Here at CP+R® we are aware that emotions and how you feel play an
        important part in your overall health.
      </p>

      <p>
        Knowing more about how you feel will ensure that we are able to help you
        as effectively as possible. Read each item and tick the box that comes
        closest to how you have been feeling in the past week.
      </p>

      <p>
        Don’t take too long over your replies; your immediate reaction to each
        item will probably be more accurate than a long thought-out response.
      </p>
    </div>

    <form on:submit|preventDefault={submit}>
      {#each had_form as question, x}
        <div class="mb-2">
          <h2 class="text-2xl font-bold">{question.title}</h2>
          {#each question.options as option, y}
            <RadioInput
              name={question.title}
              value={y}
              bind:group={form_responses[`question_${x}`]}
              label={option}
            />
          {/each}
        </div>
      {/each}
      <button class="bg-yellow-300 py-1 px-2 my-2" type="submit">Submit</button>
    </form>
  </div>
{:catch}
  <div>
    <p>
      We were unable to find a form linked to this address. Please contact your
      cardiac coach if this problem persists.
    </p>
  </div>
{/await}
