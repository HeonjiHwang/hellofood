<template>
    <div class="dialog-container">
        <div class="dialog-header">
            <h4>
                주문정보
            </h4>
            <button @click="onClose" class="btn icon-only">
                <icon icon="fas fa-xmark"></icon>
            </button>
        </div>
        <div class="dialog-content">
            <div class="table-container">
                <table>
                    <tr>
                        <th>업체명</th>
                        <td>{{item.company_name}}</td>
                    </tr>
                    <tr>
                        <th>위치</th>
                        <td>{{item.location}}</td>
                    </tr>
                    <tr>
                        <th>전화번호</th>
                        <td>{{item.phone_number}}</td>
                    </tr>
                    <tr>
                        <th>이메일</th>
                        <td>{{item.email}}</td>
                    </tr>
                    <tr>
                        <th>중식 개수 / 중식 가격</th>
                        <td>{{item.lunch_count}} / {{formatCurrency(item.lunch_price)}}</td>
                    </tr>
                    <tr>
                        <th>석식 개수 / 석식 가격</th>
                        <td>{{item.dinner_count}} / {{formatCurrency(item.dinner_price)}}</td>
                    </tr>
                    <tr>
                        <th>지불방법</th>
                        <td>
                            <span v-if="item.payment_method == 'card'">카드</span>
                            <span v-else>세금명세서</span>
                        </td>
                    </tr>
                    <tr>
                        <th>결제일</th>
                        <td>
                            <span v-if="item.payment_date <= 0">매일</span>
                            <span v-else>{{item.payment_date}} 일</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="total-price">
                <p>총 금액 : {{formatCurrency(item.total_price)}}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import  { defineProps, defineEmits } from 'vue';
defineProps({
    item: Object
});
const emit = defineEmits(['onClose'])

const formatCurrency = (value, locale = 'ko-KR', currency = 'KRW') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

const onClose = () => {
    emit('onClose');
}

</script>