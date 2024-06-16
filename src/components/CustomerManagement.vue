<template>
    <div class="container main-container">
        <div class="title-wrapper">
            <h3>고객관리</h3>
            <div class="quick-btn-wrapper">
                <router-link to="/calendar">캘린더 보기</router-link>
                <router-link to="/">오늘의 고객관리</router-link>
            </div>
        </div>
        <div class="summary-wrapper">
            <div class="today-notice" v-if="noticeArr.length > 0">
                <p>오늘은 OOO의 결제일입니다.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';
let noticeArr = ref([]);
</script>