import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/scss/index.scss";
import CarbonVue3 from '@carbon/vue';
import * as VueRouter from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisVertical, faTrashCan, faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import MainView from '@/components/MainView.vue';
import Customer from '@/components/CustomerManagement.vue';
import Calendar from '@/components/CalendarView.vue';
import AddCustomer from '@/components/AddCustomer.vue';

let iconArr = [faEllipsisVertical, faTrashCan, faFloppyDisk, faXmark];
library.add(...iconArr);

var router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {path: '/', component: MainView},
        {path:'/customer', component: Customer},
        {path:'/calendar', component:Calendar},
        {path:'/add', component:AddCustomer}
    ]
})

createApp(App).use(router).use(CarbonVue3).component('icon', FontAwesomeIcon).mount('#app')
