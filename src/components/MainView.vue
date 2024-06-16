<script setup>
    import {ref, onMounted, onBeforeMount} from 'vue';
    import axios from 'axios';
    import OverflowButton from './OverflowButton.vue';
    
    let today = ref("");
    let lunchAmount = ref(0);
    let dinnerAmount = ref(0);
    let price = ref(0.0);
    let noticeArr = ref([]);
    let todayCustomerArr = ref([]);
    let allCustomers = ref([]);

    let searchStr = ref("");
    /* add */
    let addRow = ref(null);
    /*edit*/
    let editRow = ref(null);
    
    onBeforeMount(() => {
        setToday();
    });
    onMounted(async () => {
        await getOrderInfo();
        await getAllCustomers();
        await getTodayPaymentInfo();
    })

    async function getOrderInfo(){
        let _date = new Date();
        let today = `${_date.getFullYear()}-${_date.getMonth()+1}-${_date.getDate()}`;
        try{
            const response = await axios.get(`http://localhost:3000/order/${today}`);
            console.log(response.data);
            if(response.data.success && response.data.data && response.data.data.length > 0){
                todayCustomerArr.value = response.data.data;
            }

            lunchAmount.value = response.data.data.reduce((sum, item) => sum + item.lunch_count, 0);
            dinnerAmount.value = response.data.data.reduce((sum, item) => sum + item.dinner_count, 0);
            price.value = response.data.data.reduce((sum, item) => sum + item.total_price, 0);
        }
        catch(err){
            console.log(err);
        }
    }
    async function getTodayPaymentInfo(){
        let _date = new Date();
        let date = _date.getDate();
        try{
            const response = await axios.get(`http://localhost:3000/today/payments/${date}`);
            console.log(response.data);
            if(response.data.success && response.data.data && response.data.data.length > 0){
                noticeArr.value = response.data.data;
            }
        }
        catch(err){
            console.log(err);
        }
    }

    async function getAllCustomers(){
        try{
            const response = await axios.get(`http://localhost:3000/customers`);
            console.log(response.data);
            
            if(response.data.success && response.data.data && response.data.data.length > 0){
                allCustomers.value = response.data.data;
            }
        }
        catch(err){
            console.log(err);
        }
    }

    function setToday(){
        let _date = new Date();
        let year = _date.getFullYear();
        let month = _date.getMonth() + 1;
        let date = _date.getDate();
        let day = _date.getDay();
        let dayStr = "";
        if(day == 0) dayStr = "일";
        else if(day == 1) dayStr = "월";
        else if(day == 2) dayStr = "화";
        else if(day == 3) dayStr = "수";
        else if(day == 4) dayStr = "목";
        else if(day == 5) dayStr = "금";
        else if(day == 6) dayStr = "토";

        today.value = `${year}년 ${month}월 ${date}일 (${dayStr})`;
    }

    function getTotalPrice(row){
        let customerInfo = allCustomers.value.map(x => x.id==row.id);
        let lunchPrice = 0;
        let dinnerPrice = 0;
        if(customerInfo && customerInfo.length > 0){
            lunchPrice = customerInfo[0].lunch_price;
            dinnerPrice = customerInfo[0].dinner_price;
        }

        return (row.lunch_count*lunchPrice) + (row.dinner_count*dinnerPrice);
    }

    function addCustomerRow(){
        addRow.value = {};
    }
    function onAddChange(e){
        let data = allCustomers.value.map(x => x.id == parseInt(e.target.value));
        if(data && data.length > 0){
            let selected = data[0];
            addRow.value = {
                company_name: selected.company_name,
                location:selected.location,
                phone_number: selected.phone_number,
                lunch_count : addRow.value.lunch_count,
                dinner_cuunt : addRow.value.dinner_count,
                payment_method: selected.payment_method,
                payment_date: selected.payment_date,
                total_price: getTotalPrice(addRow.value)
            }
        }
    }
    function cancelAddRow(){
        addRow.value = null;
    }
    function saveAddRow(){
        console.log(addRow);
        cancelAddRow();
    }

    function editCustomerRow(item){
        editRow.value = item;
    }
    function onEditChange(e){
        let data = allCustomers.value.map(x => x.id == parseInt(e.target.value));
        if(data && data.length > 0){
            let selected = data[0];
            editRow.value = {
                company_name: selected.company_name,
                location:selected.location,
                phone_number: selected.phone_number,
                lunch_count : editRow.value.lunch_count,
                dinner_cuunt : editRow.value.dinner_count,
                payment_method: selected.payment_method,
                payment_date: selected.payment_date,
                total_price: getTotalPrice(editRow.value)
            }
        }
    }
    function cancelEditRow(){
        editRow.value = null;
    }
    function saveEditRow(){
        console.log(editRow);
        cancelEditRow();
    }
    function removeCustomerRow(){
        console.log("remove");
    }
    function showDetail(){
        console.log("detail");
    }

    function onKeyup(e){
        if(e.key === 'Enter'){
            search();
        }
    }
    function search(){
        console.log(searchStr.value);
    }
</script>

<template>
    <div class="container main-container">
        <div class="title-wrapper">
            <h3>{{today}} 고객관리</h3>
            <div class="quick-btn-wrapper">
                <router-link to="/calendar">캘린더 보기</router-link>
                <router-link to="/customer">고객관리</router-link>
            </div>
        </div>
        <div class="summary-wrapper">
            <p>{{today}} 총 매출 : {{price}}원</p>
            <p>{{today}} 총 개수 : 점심 {{lunchAmount}}개 / 저녁 {{dinnerAmount}}개</p>

            <div class="today-notice" v-if="noticeArr.length > 0">
                <p>오늘은 OOO의 결제일입니다.</p>
            </div>
        </div>
        <div class="table-container">
            <div class="batch-wrapper">
                <div class="search-container">
                    <input type="text" class="text-input search-input" placeholder="업체명을 검색해보세요." v-model="searchStr" @keyup="onKeyup"/>
                    <button type="button" class="btn btn-blue-5" @click="search">업체 검색</button>
                </div>
                <button type="button" class="btn btn-blue-6" @click="addCustomerRow">추가하기</button>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>업체명</th>
                            <th>위치</th>
                            <th>전화번호</th>
                            <th>중식</th>
                            <th>석식</th>
                            <th>지불방법</th>
                            <th>결제일</th>
                            <th>총 금액</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <!--add-->
                        <tr v-if="addRow != null">
                            <td>
                                <select @change="onAddChange" v-model="addRow.id">
                                    <option v-for="(index, item) in allCustomers" :key="index" :value="item.company_id">
                                        {{item.company_name}}
                                    </option>
                                </select>
                            </td>
                            <td>{{addRow.location}}</td>
                            <td>{{addRow.phone_number}}</td>
                            <td><input type="number"/></td>
                            <td><input type="number"/></td>
                            <td>{{addRow.payment_method}}</td>
                            <td>{{addRow.payment_date}}</td>
                            <td></td>
                            <td>
                                <button @click="saveAddRow"><icon icon="fas fa-floppy-disk"/></button>
                                <button @click="cancelAddRow"><icon icon="fas fa-xmark"/></button>
                            </td>
                        </tr>

                        <tr v-for="(index, item) in todayCustomerArr" :key="index">
                            <td>
                                <select v-if="editRow && editRow.id == item.id" @change="onEditChange" v-model="editRow.id">
                                    <option v-for="(index, customer) in allCustomers" :key="index" :value="customer.company_id">
                                        {{customer.company_name}}
                                    </option>
                                </select>
                                <span v-else>
                                    {{item.company_name}}
                                </span>
                            </td>
                            <td>
                                <span v-if="editRow && editRow.id == item.id">
                                    {{editRow.location}}
                                </span>
                                <span v-else>
                                    {{item.location}}
                                </span>
                            </td>
                            <td>
                                <span v-if="editRow && editRow.id == item.id">
                                    {{editRow.phone_number}}
                                </span>
                                <span v-else>
                                    {{item.phone_number}}
                                </span>
                            </td>
                            <td>
                                {{item.lunch_count}}
                            </td>
                            <td>
                                {{item.dinner_count}}
                            </td>
                            <td>
                                {{item.payment_method}}
                            </td>
                            <td>
                                {{item.payment_date}}
                            </td>
                            <td>
                                {{item.total_price}}
                            </td>
                            <td>
                                <div v-if="!editRow && editRow.id != item.id">
                                    <button @click="saveEditRow"><icon icon="fas fa-floppy-disk"/></button>
                                    <button @click="cancelEditRow"><icon icon="fas fa-xmark"/></button>
                                </div>
                                <OverflowButton v-else :onModify="editCustomerRow" :onRemove="removeCustomerRow" :onDetail="showDetail"/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{todayCustomerArr.length}}개 업체</td>
                            <td colspan="2"></td>
                            <td>{{lunchAmount}}개</td>
                            <td>{{dinnerAmount}}개</td>
                            <td colspan="2"></td>
                            <td colspan="2">{{price}}원</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>