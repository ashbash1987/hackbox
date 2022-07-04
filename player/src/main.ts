import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import BuzzerButton from '@/components/BuzzerButton.vue'

const app = createApp(App)

app.use(router);
app.component('BuzzerButton', BuzzerButton)

app.mount('#app')
