<template>
    <div class="container main-container">
        <div class="title-wrapper">
            <h3>{{today}} 주문정보</h3>
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
                <button type="button" class="btn btn-blue-7" @click="addAllCustomers">모든 고객 추가하기</button>
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
                                <select @change="onAddChange" v-model="addRow.company_id">
                                    <option v-for="(item, index) in allCustomers.filter(x => !todayCustomerArr.map(y => y.company_id).includes(x.id))" :key="index" :value="item.id">
                                        {{item.company_name}}
                                    </option>
                                </select>
                            </td>
                            <td>{{addRow.location}}</td>
                            <td>{{addRow.phone_number}}</td>
                            <td><input type="number" v-model="addRow.lunch_count" @keyup="() => onAddKeyup()"/></td>
                            <td><input type="number" v-model="addRow.dinner_count" @keyup="() => onAddKeyup()"/></td>
                            <td>
                                <span v-if="addRow.payment_method === 'card'">
                                    카드
                                </span>
                                <span>
                                    세금계산서
                                </span>
                            </td>
                            <td>
                                <span v-if="addRow.payment_date && addRow.payment_date > 0">
                                    {{addRow.payment_date}}일
                                </span>
                            </td>
                            <td>{{addRow.total_price}}</td>
                            <td class="btn-wrapper icon-only">
                                <button class="btn icon-only" @click="saveAddRow"><icon icon="fas fa-floppy-disk"/></button>
                                <button class="btn icon-only" @click="cancelAddRow"><icon icon="fas fa-xmark"/></button>
                            </td>
                        </tr>

                        <tr v-for="(item, index) in todayCustomerArr" :key="index">
                            <td>
                                <span v-if="editRow == null">
                                    {{item.company_name}}
                                </span>
                                <select v-else @change="onEditChange" v-model="editRow.company_id">
                                    <option v-for="(customer, idx) in allCustomers" :key="idx" :value="customer.id">
                                        {{customer.company_name}}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <span v-if="editRow != null && editRow.id == item.id">
                                    {{editRow.location}}
                                </span>
                                <span v-else>
                                    {{item.location}}
                                </span>
                            </td>
                            <td>
                                <span v-if="editRow != null && editRow.id == item.id">
                                    {{editRow.phone_number}}
                                </span>
                                <span v-else>
                                    {{item.phone_number}}
                                </span>
                            </td>
                            <td>
                                <span v-if="editRow == null">{{item.lunch_count}}</span>
                                <input v-else type="number" v-model="editRow.lunch_count" @keyup="() => onEditKeyup()"/>
                            </td>
                            <td>
                                <span v-if="editRow == null">{{item.dinner_count}}</span>
                                <input v-else type="number" v-model="editRow.dinner_count" @keyup="() => onEditKeyup()"/></td>
                            <td>
                                <span v-if="item.payment_method == 'card'">카드</span>
                                <span v-else>세금명세서</span>
                            </td>
                            <td>
                                <span v-if="item.payment_date > 0">
                                    {{item.payment_date}}일
                                </span>
                                <span v-else>매일</span>
                            </td>
                            <td>
                                {{item.total_price}}
                            </td>
                            <td>
                                <div v-if="editRow != null && editRow.id === item.id" class="btn-wrapper icon-only">
                                    <button class="btn icon-only" @click="saveEditRow"><icon icon="fas fa-floppy-disk"/></button>
                                    <button class="btn icon-only" @click="cancelEditRow"><icon icon="fas fa-xmark"/></button>
                                </div>
                                <OverflowButton v-else @onModify="() => editCustomerRow(item)" @onRemove="removeCustomerRow(item)" @onDetail="showDetail(item)"/>
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

    <DetailModal v-if="isDetailOpen" :item="selectedRow" @onClose="onClose"/>
</template>

<script setup>
    import {ref, onMounted, onBeforeMount} from 'vue';
    import axios from 'axios';
    import OverflowButton from './OverflowButton.vue';
    import DetailModal from './DetailModal.vue';
    
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
    /*details*/
    let isDetailOpen = ref(false);
    let selectedRow = ref({});
    
    onBeforeMount(async () => {
        setToday();
        
        await getOrderInfo();
        await getAllCustomers();
        await getTodayPaymentInfo();
    });
    onMounted(async () => {
    })

    const getToday = () => {
        let _date = new Date();
        return `${_date.getFullYear()}-${_date.getMonth()+1}-${_date.getDate()}`;
    }
    async function getOrderInfo(){
        let today = getToday();

        try{
            let response = await axios.get(`http://localhost:3000/order/${today}`);
            let data = response.data;
            console.log(data);
            
            if(data.success){
                todayCustomerArr.value = data.data;

                lunchAmount.value = data.data.reduce((sum, item) => sum + item.lunch_count, 0);
                dinnerAmount.value = data.data.reduce((sum, item) => sum + item.dinner_count, 0);
                price.value = data.data.reduce((sum, item) => sum + item.total_price, 0);
            }
            else{
                console.log(data);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    async function getTodayPaymentInfo(){
        let _date = new Date();
        let date = _date.getDate();
        try{
            let response = await axios.get(`http://localhost:3000/today/payments/${date}`);
            let data = response.data;
            if(data.success){
                noticeArr.value = data.data;
            }
        }
        catch(err){
            console.log(err);
        }
    }

    async function getAllCustomers(){
        try{
            let response = await axios.get(`http://localhost:3000/customers`);        
            let data = response.data;
            if(data.success){
                allCustomers.value = [{}, ...data.data];
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

    function onAddKeyup(){
        let totalPrice = getTotalPrice(addRow.value);
        addRow.value.total_price = totalPrice;
    }
    function onEditKeyup(){
        let totalPrice = getTotalPrice(editRow.value);
        editRow.value.total_price = totalPrice;
    }

    function getTotalPrice(row){
        let customerInfo = allCustomers.value.filter(x => x.id==row.company_id);
        if(!customerInfo) return 0;

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
        let data = allCustomers.value.filter(x => x.id == parseInt(e.target.value));
        
        if(data && data.length > 0){
            let selected = data[0];
            addRow.value = {
                company_id : selected.id,
                company_name: selected.company_name,
                location:selected.location,
                phone_number: selected.phone_number,
                lunch_count : addRow.value?.lunch_count ?? 0,
                dinner_count : addRow.value?.dinner_count ?? 0,
                payment_method: selected.payment_method,
                payment_date: selected.payment_date,
                total_price: getTotalPrice(selected)
            }
        }
    }
    function cancelAddRow(){
        addRow.value = null;
    }
    async function saveAddRow(){
        let isValid = addValidation();
        let today = getToday();
        addRow.value.order_date = today;

        if(!isValid) return;

        try{
            let res = await axios.post("http://localhost:3000/order/add", addRow.value);
            let data =res.data;
            
            if(data.success){
                alert("업체가 추가되었습니다.");
                cancelAddRow();
                await getOrderInfo();
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

    function editCustomerRow(item){
        editRow.value = item;
    }

    function addValidation(){
        if(!addRow.value.company_name){
            alert("업체명을 선택해주세요.");
            return false;
        }
        return true;
    }

    function onEditChange(e){
        let data = allCustomers.value.filter(x => x.id == parseInt(e.target.value));
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
    async function cancelEditRow(){
        editRow.value = null;
        await getOrderInfo();
    }
    async function saveEditRow(){
        let isValid = editValidation();
        if(!isValid) return;

        try{
            if(!editRow.value.lunch_count) editRow.value.lunch_count = 0;
            if(!editRow.value.dinner_count) editRow.value.dinner_count = 0;
            editRow.value.order_date = getToday();

            let res = await axios.put("http://localhost:3000/order/update", editRow.value);
            let data = res.data;
            
            if(data.success){
                alert("수정되었습니다.");
                cancelEditRow();
                await getOrderInfo();
            }
            else{
                alert("문제가 발생하였습니다. 다시 시도해주세요.");
            }
        }
        catch(err){
            alert("문제가 발생하였습니다. 다시 시도해주세요.");
        }
    }
    async function removeCustomerRow(item){
        let isConfirm = confirm(`${item.company_name}을 오늘의 주문에서 삭제하시겠습니까?`);
        if(!isConfirm) return;

        try{
            let res = await axios.delete(`http://localhost:3000/order/delete/${item.id}`);
            let data = res.data;

            if(data.success){
                alert("삭제되었습니다.");
                await getOrderInfo();
            }
            else{
                alert("문제가 발생하였습니다. 다시 시도해주세요.");
            }
        }
        catch(err){
            alert("문제가 발생하였습니다. 다시 시도해주세요.");
        }
    }
    function showDetail(item){
        selectedRow.value = item;
        isDetailOpen.value = true;
    }
    function onClose(){
        selectedRow.value = null;
        isDetailOpen.value = false;
    }
    function editValidation(){
        if(!editRow.value.company_name){
            alert("업체명을 확인해주세요.");
            return false;
        }
        return true;
    }

    async function addAllCustomers(){
        let customers = allCustomers.value.filter(x => !todayCustomerArr.value.map(y => y.company_id).includes(x.id));
        customers = customers.filter(x => x.id);

        if(customers.length <= 0){
            alert("모든 고객이 추가되었습니다.");
            return;
        }

        let today = getToday();

        for(const customer of customers){
            try{
                let body = {
                    company_id : customer.id,
                    lunch_count : 0,
                    dinner_count : 0,
                    order_date : today
                };
                let res = await axios.post("http://localhost:3000/order/add", body);
                let data = res.data;
                if(data.success){console.log("success")}
            }
            catch(err){
                console.log(err);
            }
        }

        await getOrderInfo();
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