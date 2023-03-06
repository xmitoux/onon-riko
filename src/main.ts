import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';

const app = createApp(App);

app.use(router);

const vuetify = createVuetify();
app.use(vuetify);

app.mount('#app');
