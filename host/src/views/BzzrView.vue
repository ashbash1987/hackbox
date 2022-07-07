<script setup lang="ts">
import { reactive, computed } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";
import type { Message } from "@/types";

interface GameState {
  players: {
    [id: string]: {
      id: string;
      name: string;
      locked: boolean;
      score: number;
    };
  };
  buzzer: {
    active: boolean;
  };
}

const { socket, state } = initializeHostSocket(router);
const gameState: GameState = reactive({
  players: {},
  buzzer: {
    active: false,
  },
});

const buzzerComponent = () => ({
  type: "BuzzerButton",
  props: {
    label: gameState.buzzer.active ? "BUZZ" : "Wait",
    backgroundColor: gameState.buzzer.active ? "red" : "blue",
    active: gameState.buzzer.active,
  },
});

const addMemberToGame = (userId: string) => {
  gameState.players[userId] = {
    id: userId,
    name: state.members[userId].name,
    locked: false,
    score: 0,
  };

  socket.emit("update player", {
    to: userId,
    data: {
      theme: {},
      ui: {
        main: {
          align: "end",
          components: [buzzerComponent()],
        },
      },
    },
  });
};

const removePlayerFromGame = (userId: string) => {
  delete gameState.players[userId];

  socket.emit("update player", {
    to: userId,
    data: {
      ui: {
        main: {
          components: [{ type: "TextBox", props: { text: "Kicked" } }],
        },
      },
    },
  });
};

const unlockPlayers = async (userIds: string | string[]) => {
  const to = [userIds].flat();
  await Promise.all(
    to.map((playerId) => {
      gameState.players[playerId].locked = true;
      socket.emit("update player", {
        to: playerId,
        data: {
          ui: {
            main: {
              components: [buzzerComponent()],
            },
          },
        },
      });
    })
  );
};

const lockPlayers = async (userIds: string | string[]) => {
  const to = [userIds].flat();
  await Promise.all(
    to.map((playerId) => {
      gameState.players[playerId].locked = true;
      socket.emit("update player", {
        to: playerId,
        data: {
          ui: {
            main: {
              components: [
                { type: "TextBox", props: { text: "You are locked out." } },
              ],
            },
          },
        },
      });
    })
  );
};

const toggleLock = async (userId: string) => {
  gameState.players[userId].locked
    ? unlockPlayers(userId)
    : lockPlayers(userId);
};

const activateBuzzer = () => {
  gameState.buzzer.active = true;

  socket.emit("update player", {
    to: Object.keys(gameState.players).filter(
      (key: string) => !gameState.players[key].locked
    ),
    data: {
      ui: {
        main: {
          align: "end",
          components: [buzzerComponent()],
        },
      },
    },
  });
};

const deactivateBuzzer = () => {
  gameState.buzzer.active = false;

  socket.emit("update player", {
    to: Object.keys(gameState.players).filter(
      (key: string) => !gameState.players[key].locked
    ),
    data: {
      ui: {
        main: {
          align: "end",
          components: [buzzerComponent()],
        },
      },
    },
  });
};

const toggleBuzzer = () => {
  gameState.buzzer.active ? deactivateBuzzer() : activateBuzzer();
};

const latestMessages = computed(() =>
  Object.keys(gameState.players).reduce((acc, key) => {
    acc[key] = state.messages.find((msg) => msg.from === key);
    return acc;
  }, {} as { [key: string]: Message | undefined })
);
</script>

<template>
  <div class="about">
    <h1>{{ router.currentRoute.value.params.roomCode }}</h1>
    <button @click="toggleBuzzer">
      {{ gameState.buzzer.active ? "Deactivate buzzer" : "Activate buzzer" }}
    </button>
    <h3>Players</h3>
    <p v-if="!Object.keys(gameState.players).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>User ID</th>
        <th>Last Message</th>
        <th>Actions</th>
      </tr>
      <tr v-for="key in Object.keys(gameState.players)" :key="key">
        <td>{{ gameState.players[key].name }}</td>
        <td>{{ gameState.players[key].id }}</td>
        <td>{{ latestMessages[key]?.message }}</td>
        <td>
          <button @click="() => toggleLock(key)">
            {{ gameState.players[key].locked ? "Unlock" : "Lock" }}
          </button>
          <button @click="() => removePlayerFromGame(key)">
            Remove from game
          </button>
        </td>
      </tr>
    </table>

    <h3>Room Members</h3>
    <p v-if="!Object.keys(state.members).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>User ID</th>
        <th>Toggle</th>
      </tr>
      <tr v-for="key in Object.keys(state.members)" :key="key">
        <td>{{ state.members[key].name }}</td>
        <td>{{ state.members[key].id }}</td>
        <td>
          <button
            :disabled="!!gameState.players[key]"
            @click="() => addMemberToGame(key)"
          >
            Add to game
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
