<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import config from "@/config/config.json";
import dateFormat from "@/lib/utils/dateFormat.ts";
import { humanize, slugify } from "@/lib/utils/textConverter";
import Fuse from "fuse.js";
import { IconCalendar1, IconTags } from "@iconify-prerendered/vue-lucide";

const { summary_length } = config.settings;

interface SearchItem {
  slug: string;
  data: any;
  content: any;
}

interface Props {
  searchList: SearchItem[];
}

const props = defineProps<Props>();
const inputRef = ref<HTMLInputElement | null>(null);
const inputVal = ref("");
const searchResults = ref<any[]>([]);

const fuse = new Fuse(props.searchList, {
  keys: ["data.title", "data.categories", "data.tags"],
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.5,
});

onMounted(() => {
  const searchUrl = new URLSearchParams(window.location.search);
  const searchStr = searchUrl.get("q");
  if (searchStr) inputVal.value = searchStr;
});

watch(inputVal, (newVal) => {
  const results = newVal.length > 2 ? fuse.search(newVal) : [];
  searchResults.value = results;

  if (newVal.length > 0) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("q", newVal);
    const newRelativePathQuery =
      window.location.pathname + "?" + searchParams.toString();
    history.pushState(null, "", newRelativePathQuery);
  } else {
    history.pushState(null, "", window.location.pathname);
  }
});
</script>

<template>
  <div class="min-h-[45vh]">
    <input
      class="form-input w-full text-center"
      placeholder="Enter term to search all posts"
      type="text"
      name="search"
      v-model="inputVal"
      autocomplete="off"
      autofocus
      ref="inputRef"
    />

    <div v-if="inputVal.length > 1" class="my-6 text-center">
      Found {{ searchResults.length }}
      {{ searchResults.length === 1 ? " result" : " results" }}
      for '{{ inputVal }}'
    </div>

    <div class="row">
      <div
        v-for="{ item } in searchResults"
        :key="item.slug"
        class="col-12 mb-8 sm:col-6"
      >
        <a
          v-if="item.data.image"
          :href="`/${item.slug}`"
          class="rounded-lg block hover:text-primary overflow-hidden group"
        >
          <img
            class="group-hover:scale-[1.03] transition duration-300 w-full"
            :src="item.data.image"
            :alt="item.data.title"
            width="445"
            height="230"
          />
        </a>

        <ul class="mt-6 mb-4 flex flex-wrap items-center text-text">
          <li class="mr-5 flex items-center flex-wrap font-medium">
<!--            <Icon name="tabler:calendar" class="mr-1 h-5 w-5 text-gray-600" />-->
            <IconCalendar1 class="mr-1 h-5 w-5 text-gray-500" />
            <span>{{ dateFormat(item.data.date) }}</span>
          </li>
          <li class="mr-5 flex items-center flex-wrap">
            <IconTags class="mr-1 h-[18px] w-[18px] text-gray-500" />
            <ul>
              <li
                v-for="(category, i) in item.data.categories"
                :key="i"
                class="inline-block"
              >
                <a
                  :href="`/categories/${slugify(category)}`"
                  class="mr-2 hover:text-primary font-medium"
                >
                  {{ humanize(category) }}
                  {{ i !== item.data.categories.length - 1 ? "," : "" }}
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <h3 class="mb-2">
          <a
            :href="`/${item.slug}`"
            class="block hover:text-primary transition duration-300"
          >
            {{ item.data.title }}
          </a>
        </h3>
        <p class="text-text">
          {{ item.content?.slice(0, Number(summary_length)) }}...
        </p>
      </div>
    </div>
  </div>
</template>
