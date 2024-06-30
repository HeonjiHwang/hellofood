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
            <div class="table-container">
                <div class="batch-wrapper">
                    <div class="search-container">
                        <input type="text" class="text-input search-input" placeholder="업체명을 검색해보세요." v-model="searchStr" @keyup="onKeyup"/>
                        <button type="button" class="btn btn-blue-5" @click="search">업체 검색</button>
                    </div>
                    <router-link to="/add" type="button" class="btn btn-blue-6">추가하기</router-link>
                </div>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>업체명</th>
                                <th>위치</th>
                                <th>전화번호</th>
                                <th>이메일</th>
                                <th>중식가격</th>
                                <th>석식가격</th>
                                <th>결제방식</th>
                                <th>결제일</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in customerArr" :key="index">
                                <td>{{item.company_name}}</td>
                                <td>{{item.location}}</td>
                                <td>{{item.phone_number}}</td>
                                <td>{{item.email}}</td>
                                <td>{{item.lunch_price}}</td>
                                <td>{{item.dinner_price}}</td>
                                <td>
                                    <span v-if="item.payment_method == 'card'">카드</span>
                                    <span v-else>세금계산서</span>
                                </td>
                                <td>
                                    <span v-if="item.payment_date > 0">
                                        {{item.payment_date}}일
                                    </span>
                                    <span v-else>매일</span>
                                </td>
                                <td class="edit-btn-wrapper">
                                    <router-link class="btn icon-only" :to="{name:'AddCustomer', params: {id:item.id}}"><icon icon="fas fa-pen"/></router-link>
                                    <button class="btn icon-only" @click="() => deleteRow(item)"><icon icon="fas fa-trash-can"/></button>
                                </td>
                            </tr>

                            <tr>
                                <td colspan="9">{{customerArr.length}} 업체</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>    
</template>

<script setup>
import {ref, onBeforeMount} from 'vue';
import axios from 'axios';
// import OverflowButton from './OverflowButton.vue';

let noticeArr = ref([]);
let customerArr = ref([]);
let searchStr = ref("");

onBeforeMount(async () => {
    await getAllCustomers();
});

async function getAllCustomers(){
    try{
        let res = await axios.get("http://localhost:3000/customers");
        let data = res.data;
        if(data.success){
            customerArr.value = data.data;
            console.log(data.data);
        }
        else{
            console.log(`문제가 발생했습니다.\n${data.apiCode} - ${data.message}`);
        }
    }
    catch(err){
        console.log(err);
        console.log(`문제가 발생했습니다.\n${err.message}`);
    }
}

function onKeyup(e){
    if(e.Key == "Enter"){
        search();
    }
}
function search(){
    
}
async function deleteRow(customer){
    if(!customer){
        alert("삭제할 업체를 선택해주세요.");
        return;
    }
    var isConfirm = confirm(`${customer.company_name}을 삭제하시겠습니까?`);
    if(!isConfirm) return;

    try{
        var res = await axios.delete(`http://localhost:3000/customer/delete/${customer.id}`);
        var data = res.data;
        if(data.success){
            alert("삭제하였습니다.");
            await getAllCustomers();
        }
        else{
            alert("문제가 발생했습니다. 다시 시도해주세요.");
        }
    }
    catch(err){
        alert("문제가 발생했습니다. 다시 시도해주세요.");
    }
}
</script>