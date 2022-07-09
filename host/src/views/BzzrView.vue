<script setup lang="ts">
import type { GameState } from "./bzzr/types";
import type { Message } from "@/types";

import { v4 as uuid } from "uuid";
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

import { teamTheme } from "./bzzr/themes";
import sounds from "./bzzr/sounds";
import {
  textLayout,
  buzzerLayout,
  emptyLayout,
  buzzedLayout,
} from "./bzzr/layouts";

const roomCode = router.currentRoute.value.params.roomCode as string;

const { socket, state } = initializeHostSocket(router);

const gameState: GameState = reactive({
  players: {},
  teams: {},
  buzzer: {
    buzzes: [],
  },
});

socket.on("state.room", (payload) => {
  if (Object.keys(payload).length === 0) {
    // Load the initial state of the room as it hasn't been set.
    sendRoomState(gameState);
  } else {
    gameState.players = payload.players;
    gameState.teams = payload.teams;
    gameState.buzzer = payload.buzzer;
  }
});

const sendRoomState = (gameState: GameState) => {
  socket.emit("room.update", gameState);
};

const sendMemberState = (userId: string | string[], data: object) => {
  socket.emit("member.update", { to: userId, data });
};

socket.on("msg", (message: Message) => {
  if (
    message.event === "buzz" &&
    !gameState.buzzer.buzzes.find((buzz) => buzz.playerId === message.from)
  ) {
    if (gameState.buzzer.buzzes.length === 0) {
      sounds.beep();
    }
    gameState.buzzer.buzzes.push({
      playerId: message.from,
      localSpeed: message.message.ms as number,
      timestamp: message.timestamp,
    });
    sendRoomState(gameState);
    sendMemberState(message.from, { ui: buzzedLayout() });
  }
});

const addMemberToGame = (userId: string) => {
  gameState.players[userId] = {
    id: userId,
    name: state.members[userId].name,
    locked: false,
    score: 0,
  };
  sendRoomState(gameState);
  sendMemberState(userId, {
    theme: teamTheme(""),
    ui: buzzerLayout(),
  });
};

const removePlayerFromGame = (userId: string) => {
  delete gameState.players[userId];
  sendRoomState(gameState);
  sendMemberState(userId, {
    theme: teamTheme(""),
    ui: emptyLayout(state.members[userId].name),
  });
};

const unlockPlayers = async (userIds: string[]) => {
  userIds.forEach((playerId) => {
    gameState.players[playerId].locked = false;
  });
  sendRoomState(gameState);
  sendMemberState(userIds, { ui: buzzerLayout() });
};

const lockPlayers = async (userIds: string[]) => {
  userIds.forEach((playerId) => {
    gameState.players[playerId].locked = true;
  });
  sendRoomState(gameState);
  sendMemberState(userIds, { ui: textLayout("You are locked out.") });
};

const toggleLock = async (userId: string) => {
  gameState.players[userId].locked
    ? unlockPlayers([userId])
    : lockPlayers([userId]);
};

const activateBuzzer = () => {
  gameState.buzzer.buzzes = [];
  sendRoomState(gameState);

  const to = Object.keys(gameState.players).filter(
    (key: string) => !gameState.players[key].locked
  );
  sendMemberState(to, { ui: buzzerLayout() });
};

const increasePlayerScore = (userId: string) => {
  gameState.players[userId].score += 1;
  sendRoomState(gameState);
};

const decreasePlayerScore = (userId: string) => {
  gameState.players[userId].score -= 1;
  sendRoomState(gameState);
};

const updatePlayerTeam = (playerId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const teamId = target.value;
  const player = gameState.players[playerId];
  const team = gameState.teams[teamId];

  player.team = teamId;

  const headerText = team ? `${team.name}: ${player.name}` : player.name;
  sendMemberState(playerId, {
    theme: teamTheme(team.color),
    ui: {
      header: {
        text: headerText,
      },
    },
  });

  sendRoomState(gameState);
};

const teamInput = reactive({ name: "" });

const addTeam = () => {
  if (teamInput.name.trim() === "") return;
  gameState.teams[uuid()] = {
    name: teamInput.name,
    color: "red",
    members: [],
  };
  teamInput.name = "";
  sendRoomState(gameState);
};

const removeTeam = (teamId: string) => {
  const teamMembers = Object.keys(gameState.players).filter(
    (playerId) => gameState.players[playerId].team === teamId
  );

  teamMembers.forEach((playerId) => {
    const player = gameState.players[playerId];
    player.team = undefined;

    sendMemberState(playerId, {
      theme: teamTheme(""),
      ui: {
        header: {
          text: player.name,
        },
      },
    });
  });

  delete gameState.teams[teamId];
  sendRoomState(gameState);
};

const updateTeamColor = (teamId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  gameState.teams[teamId].color = target.value;
  const to = Object.keys(gameState.players).filter(
    (playerId) => gameState.players[playerId].team === teamId
  );

  sendRoomState(gameState);
  sendMemberState(to, {
    theme: teamTheme(gameState.teams[teamId].color),
  });
};

const timeDifferenceDisplay = (key: number): string => {
  const current = gameState.buzzer.buzzes[key].timestamp;
  const first = gameState.buzzer.buzzes[0].timestamp;
  const ms = current - first;

  return `+${(ms / 1000).toFixed(3)}s`;
};

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  sounds.state.volume = value;
};
</script>

<template v-if="gameState !== {}">
  <h1>{{ roomCode }}</h1>
  <label>
    Sound:
    <select v-model="sounds.state.volume" @change="handleVolumeChange">
      <option value="0">Off</option>
      <option value="0.2">Quiet</option>
      <option value="0.6">Medium</option>
      <option value="1">Loud</option>
    </select>
  </label>

  <h3>
    Buzzes
    <button class="buzzer-control" @click="activateBuzzer">Reset</button>
  </h3>
  <p v-if="!gameState.buzzer.buzzes.length">None</p>
  <ol v-else>
    <li v-for="(buzz, key) in gameState.buzzer.buzzes" :key="key">
      <strong>{{ gameState.players[buzz.playerId].name }}</strong>
      {{ timeDifferenceDisplay(key) }}
    </li>
  </ol>

  <h3>Teams</h3>
  <p v-if="!Object.keys(gameState.teams).length">None</p>
  <table v-else>
    <tr>
      <th>Name</th>
      <th>Color</th>
      <th>Members</th>
      <th>Score</th>
      <th>Actions</th>
    </tr>
    <tr v-for="teamId in Object.keys(gameState.teams)" :key="teamId">
      <th>{{ gameState.teams[teamId].name }}</th>
      <th>
        <select
          v-model="gameState.teams[teamId].color"
          @change="(event) => updateTeamColor(teamId, event)"
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
        </select>
      </th>
      <th>
        {{
          Object.keys(gameState.players)
            .filter((playerId) => gameState.players[playerId].team === teamId)
            .map((playerId) => gameState.players[playerId].name)
            .join(", ")
        }}
      </th>
      <th>
        {{
          Object.keys(gameState.players)
            .filter((playerId) => gameState.players[playerId].team === teamId)
            .reduce((acc, playerId) => {
              acc += gameState.players[playerId].score;
              return acc;
            }, 0)
        }}
      </th>
      <th>
        <button @click="() => removeTeam(teamId)">Remove</button>
      </th>
    </tr>
  </table>
  <form @submit.prevent="addTeam">
    <label>
      New Team:
      <input v-model="teamInput.name" type="text" />
    </label>
    <button type="submit">Add Team</button>
  </form>

  <h3>Players</h3>
  <p v-if="!Object.keys(gameState.players).length">None</p>
  <table v-else>
    <tr>
      <th>Name</th>
      <th>Team</th>
      <th>Score</th>
      <th>Actions</th>
    </tr>
    <tr v-for="key in Object.keys(gameState.players)" :key="key">
      <td>{{ gameState.players[key].name }}</td>
      <td>
        <select
          v-model="gameState.players[key].team"
          @change="(event) => updatePlayerTeam(key, event)"
        >
          <option :value="null">None</option>
          <option
            v-for="teamId in Object.keys(gameState.teams)"
            :key="teamId"
            :value="teamId"
          >
            {{ gameState.teams[teamId].name }}
          </option>
        </select>
      </td>
      <td>
        <button @click="() => decreasePlayerScore(key)">-</button>
        {{ gameState.players[key].score }}
        <button @click="() => increasePlayerScore(key)">+</button>
      </td>
      <td>
        <button @click="() => toggleLock(key)">
          {{ gameState.players[key].locked ? "Unlock" : "Lock" }}
        </button>
        <button @click="() => removePlayerFromGame(key)">Kick</button>
      </td>
    </tr>
  </table>

  <h3>Waiting in lobby...</h3>
  <p v-if="!Object.keys(state.members).length">None</p>
  <table v-else>
    <tr>
      <th>Name</th>
      <th>Toggle</th>
    </tr>
    <tr
      v-for="key in Object.keys(state.members).filter(
        (key) => !gameState.players[key]
      )"
      :key="key"
    >
      <td>{{ state.members[key].name }}</td>
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
</template>

<style>
.buzzer-control {
  font-size: 24px;
}
</style>
