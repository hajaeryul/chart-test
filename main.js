// value 추가
const addIdInput = document.getElementById('add-id');
const addValueInput = document.getElementById('add-value');
const addBtn = document.getElementById('add-btn');

// 테이블
const tableBody = document.getElementById('table-value');
const tableApplyBtn = document.getElementById('table-apply-btn');
// 차트
const barChart = document.getElementById('bar-chart');
// 고급 값 편집
const advancedTextarea = document.getElementById('advanced-textarea');
const advancedApplyBtn = document.getElementById('advanced-apply-btn')

// 내부 상태 저장
let data = {};

// 값 추가 버튼 클릭 이벤트
addBtn.addEventListener('click', () => {
    const id = addIdInput.value.trim();
    const value = addValueInput.value.trim();

    // ID 입력 여부
    if(id === ''){
        alert('ID를 입력하세요.');
        return;
    }

    // value 입력 여부
    if(value === '') {
        alert('값을 입력하세요.');
        return;
    }

    // 음수 or 0 검증
    if(Number(id) <= 0 || isNaN(Number(id))){
        alert('ID는 1이상 양수여야 합니다.');
        return;
    }

    // ID 중복 확인
    if(data[id] !== undefined){
        alert('이미 해당 ID가 존재합니다.');
        return;
    }

    data[id] = Number(value);
    renderTable();
    renderChart();
    updateAdvancedEditor();

    // 입력값 초기화
    addIdInput.value = '';
    addValueInput.value = '';
})

// 테이블 apply 버튼 클릭 이벤트
tableApplyBtn.addEventListener('click', () => {
    const inputs = tableBody.querySelectorAll('input[type="number"]');

    inputs.forEach(input => {
        const id = input.dataset.id;
        const newValue = Number(input.value);

        if(!isNaN(newValue)) {
            data[id] = newValue;
        }
    })

    renderTable();
    renderChart();
    updateAdvancedEditor();
})

// 테이블 렌더링
const renderTable = () => {
    tableBody.innerHTML = '';

    for(const [id, value] of Object.entries(data)) {
        const row = document.createElement('tr');

        // ID 셀
        const idCell = document.createElement('td');
        idCell.textContent = id;

        // value 셀
        const valueCell = document.createElement('td');
        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.value = value;
        valueInput.className = 'no-spinner'
        valueInput.dataset.id = id;
        valueCell.appendChild(valueInput);

        // 삭제 버튼 셀
        const deleteCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent= '삭제';
        deleteBtn.addEventListener('click', () => {
            delete data[id];
            renderTable();
            renderChart();
            updateAdvancedEditor();
        })
        deleteCell.appendChild(deleteBtn);

        // 자식 노드 추가하기기
        row.appendChild(idCell);
        row.appendChild(valueCell);
        row.appendChild(deleteCell);
        tableBody.appendChild(row);
    }
}

// 차트 렌더링
const renderChart = () => {
    barChart.innerHTML = '';

    const maxHeight = 200;
    const maxValue = 100;

    for(const [id, value] of Object.entries(data)){
        const bar = document.createElement('div');
        bar.className = 'bar';

        const barRect = document.createElement('div');
        barRect.className = 'bar-rect';
        barRect.style.height = `${(value / maxValue) * maxHeight}px`;

        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = id;
        
        bar.appendChild(barRect);
        bar.appendChild(barLabel);
        barChart.appendChild(bar);
    }
}

// 고급 값 편집
const updateAdvancedEditor = () => {
    const jsonArray = Object.entries(data).map(([id, value]) => ({
        id: Number(id),
        value
    }));

    console.log(jsonArray)

    advancedTextarea.value = JSON.stringify(jsonArray, null, 2);
}

advancedApplyBtn.addEventListener('click', () => {
    try {
        const json = JSON.parse(advancedTextarea.value);

        const newData = {};
        json.forEach(item => {
            if(typeof item.id !== 'number' || typeof item.value !== 'number') {
                throw new Error('ID와 value는 숫자만 입력 가능합니다.');
            }
            newData[item.id] = item.value;
        })

        data = newData;
        renderTable();
        renderChart();
        updateAdvancedEditor();
    } catch(e) {
        alert('JSON 형식이 올바르지 않습니다.\n' + e.message);
    }
})