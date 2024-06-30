<template>
  <div class="calendar-container">
    <vue-cal
      :events="events"
      @cell-click="addEvent"
      @event-click="editEvent"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import 'vue-cal/dist/vuecal.css';
import VueCal from 'vue-cal';

const events = ref([
  { start: new Date(), end: new Date(), title: 'Today\'s event' },
  { start: new Date(new Date().setDate(new Date().getDate() + 1)), end: new Date(new Date().setDate(new Date().getDate() + 1)), title: 'Tomorrow\'s event' }
]);

const addEvent = (day) => {
  const title = prompt('Enter event title:');
  if (title) {
    events.value.push({ start: day, end: day, title });
  }
};

const editEvent = (event) => {
  const title = prompt('Edit event title:', event.title);
  if (title) {
    event.title = title;
  }
};
</script>