<script>
  import { metatags } from "@roxi/routify";
  import { params } from "@roxi/routify";
  import { onMount } from "svelte";

  metatags.title = "HAD Form";

  const form_data = [
    {
      title: "I feel tense or wound up",
      options: [
        "All of the time",
        "A lot of the time",
        "Occasionally",
        "Not at all",
      ],
    },
    {
      title: "I still enjoy the things I used to enjoy",
      options: [
        "Definitely as much",
        "Not quite so much",
        "Only a little",
        "Hardly at all",
      ],
    },
    {
      title:
        "I get a sort of frightened feeling as if something awful is about to happen",
      options: [
        "Very definitely and quite badly",
        "Yes, but not too badly",
        "A little, but it doesn’t worry me",
        "Not at all",
      ],
    },
    {
      title: "I can laugh and see the funny side of things",
      options: [
        "As much as I always could",
        "Not quite so much now",
        "Definitely not so much now",
        "Not at all",
      ],
    },
    {
      title: "Worrying thoughts go through my mind",
      options: [
        "All of the time",
        "A lot of the time",
        "From time to time",
        "Only occasionally",
      ],
    },
    {
      title: "I feel cheerful",
      options: ["Not at all", "Not often", "Sometimes", "Most of the time"],
    },
    {
      title: "I can sit at ease and feel relaxed",
      options: ["Definitely", "Usually", "Not often", "Not at all"],
    },
    {
      title: "I feel as if I am slowed down",
      options: ["All the time", "Often", "Sometimes", "Not at all"],
    },
    {
      title:
        "I get a sort of frightened feeling like “butterflies” in the stomach",
      options: ["Not at all", "Occasionally", "Quite often", "All the time"],
    },
    {
      title: "I have lost interest and put less effort into my appearance",
      options: [
        "Definitely",
        "Often",
        "Sometimes",
        "I take just as much care as ever",
      ],
    },
    {
      title: "I feel restless as if I have to be on the move",
      options: [
        "Very much indeed",
        "Quite a lot",
        "Not very much",
        "Not at all",
      ],
    },
    {
      title: "I look forward with enjoyment to things",
      options: [
        "As much as I ever did",
        "Rather less than I used to",
        "Definitely less than I used to",
        "Hardly at all",
      ],
    },
    {
      title: "I get sudden feelings of panic",
      options: ["All the time", "Quite often", "Not very often", "Not at all"],
    },
    {
      title: "I can relax and enjoy a good book or radio or TV programme",
      options: ["Often", "Sometimes", "Not often", "Rarely"],
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
{:catch error}
  <div class="grid place-items-center h-screen">
    <div
      class="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
{/await}
