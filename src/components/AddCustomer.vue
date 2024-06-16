<template>
    <div class="container add-customer-container">
        <div class="title-wrapper">
            <h3>고객추가</h3>
        </div>
        <!--고객 추가-->
        <form @submit="onSubmit">
            <div class="field-wrapper">
                <label for="company_name">업체명</label>
                <input type="text" id="company_name"/>
            </div>
            <div class="field-wrapper">
                <label for="location">위치</label>
                <input type="text" id="location"/>
            </div>
            <div class="field-wrapper">
                <label for="phone_number">전화번호</label>
                <input type="text" id="phone_number"/>
            </div>
            <div class="field-wrapper">
                <label for="vat_number">사업자등록번호</label>
                <input type="text" id="vat_number"/>
            </div>
            <div class="field-wrapper">
                <label for="email">이메일주소</label>
                <input type="email" id="email"/>
            </div>
            <div class="field-wrapper">
                <label for="lunch_price">중식 가격</label>
                <input type="text" id="lunch_price"/>
            </div>
            <div class="field-wrapper">
                <label for="dinner_price">석식 가격</label>
                <input type="text" id="dinner_price"/>
            </div>
            <div class="field-wrapper">
                <label for="company_name">결제방법</label>
                <select>
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

                    <input v-if="selectedPaymentDate === 'month'" type="text" id="payment_date"/>
                </div>
            </div>

            <button type="submit" class="btn btn-blue-5">
                저장하기
            </button>
        </form>
    </div>    
</template>

<script setup>
import {ref} from 'vue';
let selectedPaymentDate = ref("");

function onChange(e){
    selectedPaymentDate.value = e.target.value;
    console.log(e.target.value);
}
function onSubmit(){

}
</script>