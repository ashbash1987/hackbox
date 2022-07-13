<script setup lang="ts">
import type { GameState } from "./bzzr/types";
import type { Message } from "@/types";

import { v4 as uuid } from "uuid";
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

import { getThemeAndPresets } from "./bzzr/themes";
import sounds from "./bzzr/sounds";
import {
  textLayout,
  buzzerLayout,
  choicesLayout,
  emptyLayout,
} from "./bzzr/layouts";

const roomCode = router.currentRoute.value.params.roomCode as string;

const { socket, state } = initializeHostSocket(router);

const gameState: GameState = reactive({
  players: {},
  teams: {},
  buzzer: {
    buzzes: [],
    component: {
      type: "Buzzer",
    },
  },
});

const handleBuzzerTypeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value as string;

  gameState.buzzer.component = {
    type: value,
  };

  activateBuzzer();
};

const getLayout = () => {
  switch (gameState.buzzer.component.type) {
    case "Buzzer":
      return buzzerLayout();
    case "Choices":
      return choicesLayout();
    default:
      return buzzerLayout();
  }
};

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

socket.on("msg", (message: Message) => {
  const player = gameState.players[message.from];
  if (!player) return;

  if (
    message.event === "buzz" &&
    !gameState.buzzer.buzzes.find((buzz) => buzz.playerId === player.id)
  ) {
    if (gameState.buzzer.buzzes.length === 0) {
      sounds.beep();
    }
    gameState.buzzer.buzzes.push({
      playerId: player.id,
      value: (message.message.value as string) || "buzz",
      localSpeed: message.message.ms as number,
      timestamp: message.timestamp,
    });

    sendRoomState(gameState);
    sendMemberState(message.from, { ui: textLayout("Buzzed in!") });
  }
});

const sendRoomState = (gameState: GameState) => {
  socket.emit("room.update", gameState);
};

const sendMemberState = (userId: string | string[], data: object) => {
  socket.emit("member.update", { to: userId, data });
};

const addMemberToGame = (userId: string) => {
  gameState.players[userId] = {
    id: userId,
    name: state.members[userId].name,
    locked: false,
    score: 0,
  };

  const { theme, presets } = getThemeAndPresets("default");

  sendRoomState(gameState);
  sendMemberState(userId, {
    theme,
    presets,
    ui: getLayout(),
  });
};

const removePlayerFromGame = (userId: string) => {
  delete gameState.players[userId];

  const { theme, presets } = getThemeAndPresets("default");

  sendRoomState(gameState);
  sendMemberState(userId, {
    theme,
    presets,
    ui: emptyLayout(state.members[userId].name),
  });
};

const unlockPlayer = async (userId: string) => {
  const player = gameState.players[userId];
  player.locked = false;

  sendRoomState(gameState);
  sendMemberState(userId, { ui: getLayout() });
};

const lockPlayer = async (userId: string) => {
  const player = gameState.players[userId];
  player.locked = true;

  sendRoomState(gameState);
  sendMemberState(userId, {
    ui: textLayout("You are locked out."),
  });
};

const toggleLock = async (userId: string) => {
  gameState.players[userId].locked ? unlockPlayer(userId) : lockPlayer(userId);
};

const activateBuzzer = () => {
  gameState.buzzer.buzzes = [];
  sendRoomState(gameState);

  const playerIds = Object.keys(gameState.players).filter(
    (playerId) => !gameState.players[playerId].locked
  );

  sendMemberState(playerIds, { ui: getLayout() });
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
  const { theme, presets } = getThemeAndPresets(team?.color);

  sendRoomState(gameState);
  sendMemberState(playerId, {
    theme,
    presets,
  });
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

    const { theme, presets } = getThemeAndPresets("default");

    sendMemberState(playerId, {
      theme,
      presets,
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
  const color = target.value;
  gameState.teams[teamId].color = color;
  sendRoomState(gameState);

  const playerIds = Object.keys(gameState.players).filter(
    (playerId) => gameState.players[playerId].team === teamId
  );

  const { theme, presets } = getThemeAndPresets(color);

  sendMemberState(playerIds, {
    theme,
    presets,
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

  <label>
    Buzzer Type:
    <select
      v-model="gameState.buzzer.component.type"
      @change="handleBuzzerTypeChange"
    >
      <option value="Buzzer">Classic</option>
      <option value="Choices">Multiple Choice</option>
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
      <span v-if="gameState.buzzer.buzzes[key].value !== 'buzz'">
        {{ ` ${gameState.buzzer.buzzes[key].value}` }}
      </span>
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
    <tr v-for="[teamId, team] in Object.entries(gameState.teams)" :key="teamId">
      <th>{{ team.name }}</th>
      <th>
        <select
          v-model="team.color"
          @change="(event) => updateTeamColor(teamId, event)"
        >
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="chartreuse">Chartreuse</option>
          <option value="springgreen">Spring Green</option>
          <option value="green">Green</option>
          <option value="cyan">Cyan</option>
          <option value="azure">Azure</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="pink">Pink</option>
          <option value="rose">Rose</option>
        </select>
      </th>
      <th>
        {{
          Object.values(gameState.players)
            .filter((player) => player.team === teamId)
            .map((player) => player.name)
            .join(", ")
        }}
      </th>
      <th>
        {{
          Object.values(gameState.players)
            .filter((player) => player.team === teamId)
            .reduce((acc, player) => {
              acc += player.score;
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
    <tr
      v-for="[playerId, player] in Object.entries(gameState.players)"
      :key="playerId"
    >
      <td>{{ player.name }}</td>
      <td>
        <select
          v-model="player.team"
          @change="(event) => updatePlayerTeam(playerId, event)"
        >
          <option :value="null">None</option>
          <option
            v-for="[teamId, team] in Object.entries(gameState.teams)"
            :key="teamId"
            :value="teamId"
          >
            {{ team.name }}
          </option>
        </select>
      </td>
      <td>
        <button @click="() => decreasePlayerScore(playerId)">-</button>
        {{ player.score }}
        <button @click="() => increasePlayerScore(playerId)">+</button>
      </td>
      <td>
        <button @click="() => toggleLock(playerId)">
          {{ player.locked ? "Unlock" : "Lock" }}
        </button>
        <button @click="() => removePlayerFromGame(playerId)">Kick</button>
      </td>
    </tr>
  </table>

  <h3>Lobby</h3>
  <p
    v-if="
      Object.keys(state.members).filter(
        (memberId) => !gameState.players[memberId]
      ).length === 0
    "
  >
    None
  </p>
  <table v-else>
    <tr>
      <th>Name</th>
      <th>Toggle</th>
    </tr>
    <tr
      v-for="[memberId, member] in Object.entries(state.members).filter(
        ([memberId, member]) => !gameState.players[memberId]
      )"
      :key="memberId"
    >
      <td>{{ member.name }}</td>
      <td>
        <button
          :disabled="!!gameState.players[memberId]"
          @click="() => addMemberToGame(memberId)"
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
