<template>
    <div class="overflow-btn-container" tabindex="-1" @blur="blur">
        <button class="overflow-btn" @click="focus">
            <icon icon="fa-solid fa-ellipsis-vertical"/>
        </button>
        <ul class="overflow-wrapper" v-if="isOpen===true">
            <li>
                <button @mousedown="() => clickMenu('M')">수정하기</button>
            </li>
            <li>
                <button @mousedown="() => clickMenu('R')">삭제하기</button>
            </li>
            <li>
                <button @mousedown="() => clickMenu('D')">상세보기</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
    import {ref, defineEmits} from 'vue';

    const emit = defineEmits(['onModify', 'onRemove', 'onDetail'])

    let isOpen = ref(false);

    function focus(){
        isOpen.value = true;
    }
    function blur(){
        console.log("blur");
        isOpen.value = false;
    }
    function clickMenu(menu){
        if(menu == 'M'){
            emit('onModify');
            isOpen.value = false;
        }
        else if(menu == 'R'){
            emit('onRemove')
            isOpen.value = false;
        }
        else if(menu == 'D'){
            emit('onDetail')
            isOpen.value = false;
        }
    }
</script>