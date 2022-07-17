<script setup lang="ts">
import { reactive, computed } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";
import type { Message } from "@/types";

const { socket, state } = initializeHostSocket(router);

const playerStateInput = reactive({
  input: `{
    "theme": {
      "header": {
        "color": "black",
        "background": "#FAA516"
      },
      "main": {
        "background": "black"
      }
    },
    "presets": {
      "Question": {
        "type": "Text",
        "props": {
          "color": "white",
          "background": "black",
          "border": "4px solid #7391CA"
        }
      },
      "Answers": {
        "type": "Choices",
        "props": {
          "multiSelect": true,
          "align": "start",
          "color": "white",
          "background": "black",
          "border": "2px solid #7391CA",
          "submit": {
            "label": "Final Answer",
            "align": "center"
          },
          "hover": {
            "background": "#FAA516",
            "color": "black"
          }
        }
      }
    },
    "ui": {
      "header": {
        "text": "CAPTAIN"
      },
      "main": {
        "align": "start",
        "components": [
          {
            "type": "Question",
            "props": {
              "text": "Put these words in alphabetical order."
            }
          },
          {
            "type": "Answers",
            "props": {
              "choices": [
                { "label": "A: Great", "value": "A", "keys": ["A", "1"] },
                { "label": "B: Zebra", "value": "B", "keys": ["B", "2"] },
                { "label": "C: London", "value": "C", "keys": ["C", "3"] },
                { "label": "D: Country", "value": "D", "keys": ["D", "4"] }
              ]
            }
          }
        ]
      }
    }
  }`,
});

const linterUrl = computed(() => {
  const encodedJson = encodeURIComponent(playerStateInput.input);
  return `https://jsonlint.com/?json=${encodedJson}`;
});

const updateMemberState = (userId: string) => {
  const json = JSON.parse(playerStateInput.input);
  socket?.emit("member.update", {
    to: userId,
    data: json,
  });
};

const members = computed(() =>
  Object.keys(state.members).map((key) => state.members[key])
);

const latestMessages = computed(() =>
  Object.keys(state.members).reduce((acc, key) => {
    const userMessages = state.messages.filter((msg) => msg.from === key);
    const latestMessage = userMessages.at(-1);
    acc[key] = latestMessage;
    return acc;
  }, {} as { [key: string]: Message | undefined })
);
</script>

<template>
  <div class="about">
    <h1>Hosting {{ router.currentRoute.value.params.roomCode }}</h1>
    <textarea v-model="playerStateInput.input"></textarea>
    <a class="lint-link" :href="linterUrl" target="_blank"> Validate JSON </a>
    <h3>Members</h3>
    <p v-if="!Object.keys(state.members).length">None</p>
    <table v-else>
      <tr>
        <th>Send Message</th>
        <th>Name</th>
        <th>User ID</th>
        <th>Last response</th>
        <th>Received at</th>
      </tr>
      <tr v-for="player in members" :key="player.id">
        <td>
          <button @click="() => updateMemberState(player.id)">Update</button>
        </td>
        <td>{{ player.name }}</td>
        <td>{{ player.id }}</td>
        <td>
          {{ latestMessages[player.id]?.message.value }}
        </td>
        <td>
          {{ latestMessages[player.id]?.timestamp }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style>
textarea {
  height: 500px;
  min-width: 400px;
  max-width: 600px;
  width: 100%;
  margin: 10px;
}

.lint-link {
  display: block;
}
</style>
