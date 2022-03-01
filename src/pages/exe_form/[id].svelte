<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { onMount } from "svelte";

  metatags.title = "Exercise Form";

  const form_data = [
    {
      title: "How confident do you feel about exercising?",
      options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    },
    {
      title: "How would you rate your overall general confidence level?",
      options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    },
    {
      title: "How would you rate your current overall health?",
      options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    },
    {
      title: "How much of your time do you focus specifically on your health?",
      options: ["All", "A lot", "Some", "Not Much", "None"],
    },
    {
      title:
        "What is the hardest physical activity you could do for at least 30 minutes?",
      options: [
        "Very heavy e.g. Fast walk up a slight hill/jog/fast cycle",
        "Heavy e.g. Fast walk",
        "Moderate e.g. Medium pace walk up hill",
        "Light e.g. Medium pace walk",
        "Very Light e.g. Slow walk or less",
      ],
    },
    {
      title:
        "When walking up stairs, how many flights could you do continuously before feeling out of breath?",
      options: ["4 or more", "3", "2", "1", "None"],
    },
    {
      title:
        "How much are you bothered by stress, emotional problems such as feeling anxious, depressed, irritable or sad?",
      options: [
        "Not at all",
        "Slightly",
        "Moderate",
        "Quite a bit",
        "Extremely",
      ],
    },
    {
      title:
        "Does your physical or emotional health limit your social activities with family and friends?",
      options: [
        "Not at all",
        "Slightly",
        "Moderate",
        "Quite a bit",
        "Extremely",
      ],
    },
  ];

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
    console.log("I'm the validate() function");
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
    <h1 class="text-3xl font-bold my-1">HAD Scale</h1>
    <div class="bg-white-300">
      <p>
        Knowing more about how you feel about right now will ensure that we are
        able to help you more effectively during your programme.
      </p>

      <p>
        Read each item and tick the box that comes closest to how you have been
        feeling in the past 2 weeks. Don’t take too long over your replies; your
        immediate reaction to each item will probably be more accurate than a
        long thought-out response.
      </p>
    </div>

    <form on:submit|preventDefault={submit}>
      {#each form_data as question, x}
        <div class="mb-2">
          <h2 class="text-2xl font-bold">{question.title}</h2>
          {#each question.options as option, y}
            <div>
              <label>
                <input
                  class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="radio"
                  name={`${question.title}`}
                  value={y}
                  bind:group={form_responses[`question_${x}`]}
                />
                {option}
              </label>
            </div>
          {/each}
        </div>
      {/each}
      <button type="submit">Submit</button>
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
