<template>
    <div class="container add-customer-container">
        <div class="title-wrapper">
            <h3>고객추가</h3>
        </div>
        <!--고객 추가-->
        <div class="form">
            <div class="field-wrapper">
                <label for="company_name">업체명</label>
                <input type="text" id="company_name" v-model="customerInfo.company_name"/>
            </div>
            <div class="field-wrapper">
                <label for="location">위치</label>
                <input type="text" id="location" v-model="customerInfo.location"/>
            </div>
            <div class="field-wrapper">
                <label for="phone_number">전화번호</label>
                <input type="text" id="phone_number" v-model="customerInfo.phone_number"/>
            </div>
            <div class="field-wrapper">
                <label for="vat_number">사업자등록번호</label>
                <input type="text" id="vat_number" v-model="customerInfo.vat_number" placeholder="- 를 제외하고 작성해주세요." v-numeric-only/>
            </div>
            <div class="field-wrapper">
                <label for="email">이메일주소</label>
                <input type="email" id="email" v-model="customerInfo.email"/>
            </div>
            <div class="field-wrapper">
                <label for="lunch_price">중식 가격</label>
                <input type="text" id="lunch_price" v-model="customerInfo.lunch_price" v-numeric-only/>
            </div>
            <div class="field-wrapper">
                <label for="dinner_price">석식 가격</label>
                <input type="text" id="dinner_price" v-model="customerInfo.dinner_price" v-numeric-only/>
            </div>
            <div class="field-wrapper">
                <label for="company_name">결제방법</label>
                <select v-model="customerInfo.payment_method">
                    <option value="card">카드</option>
                    <option value="reciept">세금계산서</option>
                </select>
            </div>
            <div class="field-wrapper">
                <label for="payment_date">결제일</label>
                <div class="flex-col">
                    <select @change="onChange" v-model="selectedPaymentDate">
                        <option value="day">매일</option>
                        <option value="month">매월</option>
                    </select>

                    <input v-if="selectedPaymentDate === 'month'" type="text" id="payment_date" v-model="customerInfo.payment_date" v-numeric-only/>
                </div>
            </div>

            <div class="btn-wrapper">
                <router-link to="/customer" type="button" class="btn btn-gray-8">
                    취소
                </router-link>
                <button v-if="!customer_id || customer_id === ''" type="button" @click="onSubmit" class="btn btn-blue-5">
                    저장
                </button>
                <button v-else type="button" class="btn btn-warning" @click="onUpdate">
                    수정
                </button>
            </div>
        </div>
    </div>    
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {numericOnly} from '../directives/numericOnly.js';
import axios from 'axios'

let selectedPaymentDate = ref("");
let customerInfo = ref({});

const route = useRoute();
const router = useRouter();
const customer_id = computed(() => route.params.id);

onMounted(async () => {
    if(customer_id.value){
        await getCustmerById();
    }
});

async function getCustmerById(){
    try{
        let res = await axios.get(`http://localhost:3000/customer/${customer_id.value}`);
        let data = res.data;
        console.log(data);
        if(data.success){
            customerInfo.value = data.data;
            if(data.data.payment_date > 0){
                selectedPaymentDate.value = "month";
            }
        }
        else{
            alert("오류가 발생했습니다.");
            router.push({path:"/customer"});
        }
    }
    catch(err){
        alert("오류가 발생했습니다.");
        router.push({path:"/customer"});
    }
}

async function onUpdate(){
    let isValid = validation();
    if(!isValid) return;

    try{
        let res = await axios.put("http://localhost:3000/customer/update", customerInfo.value);
        let data = res.data;
        console.log(data);
        if(data.success){
            alert("수정되었습니다.");
            router.push({path:"/customer"});
        }
        else{
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    }
    catch(err){
        console.log(err);
        alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
}

function onChange(e){
    selectedPaymentDate.value = e.target.value;
}
async function onSubmit(){
    //validation
    let isValid = validation();

    if(!isValid) return;

    try{
        const res = await axios.post(`http://localhost:3000/customer/add`, customerInfo.value);
        if(res.data.success){
            alert("저장하였습니다.");
            customerInfo.value = {};
        }
        else{
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    }
    catch(err){
        alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
}
function validation(){
    if(!customerInfo.value.company_name){
        alert("업체명 입력해주세요.")
        return false;
    }
    if(!customerInfo.value.location){
        alert("위치 입력해주세요.")   
        return false;
    }
    if(!customerInfo.value.phone_number){
        alert("전화번호 입력해주세요.")   
        return false;
    }
    if(!customerInfo.value.vat_number){
        alert("사업자등록번호 입력해주세요.")  
        return false; 
    }
    if(customerInfo.value.vat_number){
        if(customerInfo.value.vat_number.length != 10){
            alert("사업자등록번호가 길이가 잘못되었음. 다시 확인 ㄱㄱ");
            return false;
        }
    }
    if(!customerInfo.value.lunch_price){
        alert("중식 가격 입력해주세요.")   
        return false;
    }
    if(!customerInfo.value.dinner_price){
        alert("석식 가격 입력해주세요.")   
        return false;
    }
    if(!customerInfo.value.payment_method){
        alert("결제방법 입력해주세요.")   
        return false;
    }
    if(customerInfo.value.payment_method == "card" && selectedPaymentDate.value == "day"){
        customerInfo.value.payment_date = 0;
    }
    else{
        if(customerInfo.value.payment_date <= 0 || customerInfo.value.payment_date > 31){
            alert("결제일을 입력해주세요.");
        }
    }
    return true;
}
</script>

<script>
export default{
    directives:{
        numericOnly
    }
}
</script>