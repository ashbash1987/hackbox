<script setup lang="ts">
import GameState from "@/lib/GameState";
import type { Message } from "@/types";

import { v4 as uuid } from "uuid";
import { reactive, computed } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

import { getThemeAndPresets } from "./helpers/themes";
import sounds from "./helpers/sounds";
import layouts from "./helpers/layouts";
import { createRoom } from "@/lib/rooms";

const gameId = router.currentRoute.value.params.gameId as string;

const gameState = reactive(new GameState(gameId));

while (!gameState.roomCode) {
  const roomCode = await createRoom();
  if (roomCode) {
    gameState.roomCode = roomCode;
    gameState.save();
  }
}

const { socket } = initializeHostSocket(router, gameState);

const buzzes = computed(() =>
  Object.values(gameState.buzzer.buzzes).sort(
    (a, b) => a.timestamp - b.timestamp
  )
);

const handleBuzzerTypeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value as string;

  gameState.buzzer.type = value;
  gameState.save();

  activateBuzzer();
};

const getLayout = () => {
  switch (gameState.buzzer.type) {
    case "Buzzer":
      return layouts.buzzer();
    case "Choices":
      return layouts.choices();
    case "TextInput":
      return layouts.textInput();
    default:
      return layouts.buzzer();
  }
};

socket.on("msg", (message: Message) => {
  const player = gameState.players[message.from];
  if (!player) return;

  if (message.event === "buzz" && !gameState.buzzer.buzzes[player.id]) {
    if (buzzes.value.length === 0) {
      sounds.hackBuzz();
    }

    gameState.buzzer.buzzes[player.id] = {
      playerId: player.id,
      value: message.message.value as string,
      localSpeed: message.message.ms as number,
      timestamp: message.timestamp,
    };

    const value = message.message.value;
    const response = value
      ? `You answered ${Array.isArray(value) ? value.join(", ") : value}.`
      : "You buzzed in!";
    gameState.save();
    sendMemberState(message.from, { ui: layouts.text(response) });
  }
});

const sendMemberState = (userId: string | string[], data: object) => {
  socket.emit("member.update", { to: userId, data });
};

const addMemberToGame = (userId: string) => {
  gameState.players[userId] = {
    id: userId,
    name: gameState.members[userId].name,
    locked: false,
    score: 0,
  };

  const { theme, presets } = getThemeAndPresets("default");

  gameState.save();
  sendMemberState(userId, {
    theme,
    presets,
    ui: getLayout(),
  });
};

const removePlayerFromGame = (userId: string) => {
  delete gameState.players[userId];

  const { theme, presets } = getThemeAndPresets("default");

  gameState.save();
  sendMemberState(userId, {
    theme,
    presets,
    ui: layouts.empty(),
  });
};

const unlockPlayer = async (userId: string) => {
  const player = gameState.players[userId];
  player.locked = false;

  gameState.save();
  sendMemberState(userId, { ui: getLayout() });
};

const lockPlayer = async (userId: string) => {
  const player = gameState.players[userId];
  player.locked = true;

  gameState.save();
  sendMemberState(userId, {
    ui: layouts.text("You are locked out."),
  });
};

const toggleLock = async (userId: string) => {
  gameState.players[userId].locked ? unlockPlayer(userId) : lockPlayer(userId);
};

const activateBuzzer = () => {
  gameState.buzzer.buzzes = {};
  gameState.save();

  const playerIds = Object.keys(gameState.players).filter(
    (playerId) => !gameState.players[playerId].locked
  );

  sendMemberState(playerIds, { ui: getLayout() });
};

const increasePlayerScore = (userId: string) => {
  gameState.players[userId].score += 1;
  gameState.save();
};

const decreasePlayerScore = (userId: string) => {
  gameState.players[userId].score -= 1;
  gameState.save();
};

const updatePlayerTeam = (playerId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const teamId = target.value;
  const player = gameState.players[playerId];
  const team = gameState.teams[teamId];

  player.team = teamId;
  const { theme, presets } = getThemeAndPresets(team?.color);

  gameState.save();
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
  };
  teamInput.name = "";
  gameState.save();
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
  gameState.save();
};

const updateTeamColor = (teamId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const color = target.value;
  gameState.teams[teamId].color = color;
  gameState.save();

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
  const current = buzzes.value[key].timestamp;
  const first = buzzes.value[0].timestamp;
  const ms = current - first;

  return `+${(ms / 1000).toFixed(3)}s`;
};

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  sounds.updateVolume(target.value);
};
</script>

<template v-if="gameState">
  <h1>{{ gameState.roomCode }}</h1>
  <label>
    Volume:
    <select v-model="sounds.state.volume" @change="handleVolumeChange">
      <option value="off">Off</option>
      <option value="quiet">Quiet</option>
      <option value="medium">Medium</option>
      <option value="loud">Loud</option>
    </select>
  </label>
  <br />
  <label>
    Input Type:
    <select v-model="gameState.buzzer.type" @change="handleBuzzerTypeChange">
      <option value="Buzzer">Buzzer</option>
      <option value="Choices">Multiple Choice</option>
      <option value="TextInput">Text Input</option>
    </select>
  </label>

  <h3>
    Buzzes
    <button class="buzzer-control" @click="activateBuzzer">Reset</button>
  </h3>
  <p v-if="!buzzes.length">None</p>
  <table v-else>
    <tr>
      <th>Name</th>
      <th>Value</th>
      <th>Time</th>
      <th>Score</th>
    </tr>
    <tr v-for="(buzz, key) in buzzes" :key="key">
      <td>
        <strong>{{ gameState.members[buzz.playerId].name }}</strong>
      </td>
      <td>
        {{ `${buzz.value}` }}
      </td>
      <td>
        {{ timeDifferenceDisplay(key) }}
      </td>
      <td>
        <button @click="() => decreasePlayerScore(buzz.playerId)">-</button>
        {{ gameState.players[buzz.playerId].score }}
        <button @click="() => increasePlayerScore(buzz.playerId)">+</button>
      </td>
    </tr>
  </table>

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
      Object.keys(gameState.members).filter(
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
      v-for="[memberId, member] in Object.entries(gameState.members).filter(
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
