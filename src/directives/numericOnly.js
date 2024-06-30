export const numericOnly = {
    beforeMount(el) {
        el.addEventListener('input', function(event) {
            const value = event.target.value;
            // 숫자만 남기고 필터링
            event.target.value = value.replace(/[^0-9]/g, '');
            el.dispatchEvent(new Event('input'));
        });
    }
};
