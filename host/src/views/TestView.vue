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
        "textColor": "black",
        "backgroundColor": "#FAA516"
      },
      "main": {
        "backgroundColor": "black"
      }
    },
    "presets": {
      "Question": {
        "type": "TextBox",
        "props": {
          "textColor": "white",
          "backgroundColor": "black",
          "borderColor": "#7391CA"
        }
      },
      "Answer": {
        "type": "SelectButton",
        "props": {
          "align": "start",
          "textColor": "white",
          "backgroundColor": "black",
          "borderColor": "#7391CA",
          "hoverBackgroundColor": "#FAA516",
          "hoverTextColor": "black"
        }
      }
    },
    "ui": {
      "header": {
        "text": "CARPENTER"
      },
      "main": {
        "align": "start",
        "components": [
          {
            "type": "Question",
            "props": {
              "text": "Which of these US presidents appeared on the television series 'Laugh-In'?"
            }
          },
          {
            "type": "Answer",
            "props": {
              "label": "A: Lyndon Johnson",
              "value": "A"
            }
          },
          {
            "type": "Answer",
            "props": {
              "label": "B: Richard Nixon",
              "value": "B"
            }
          },
          {
            "type": "Answer",
            "props": {
              "label": "C: Jimmy Carter",
              "value": "C"
            }
          },
          {
            "type": "Answer",
            "props": {
              "label": "D: Gerald Ford",
              "value": "D"
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
  socket?.emit("update player", {
    to: userId,
    data: json,
  });
};

const members = computed(() =>
  Object.keys(state.members).map((key) => state.members[key])
);

const latestMessages = computed(() =>
  Object.keys(state.members).reduce((acc, key) => {
    acc[key] = state.messages.find((msg) => msg.from === key);
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
