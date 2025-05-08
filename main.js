// value 추가
const addIdInput = document.getElementById('add-id');
const addValueInput = document.getElementById('add-value');
const addBtn = document.getElementById('add-btn');

// 테이블 바디
const tableBody = document.getElementById('table-value');

// 내부 상태 저장
const data = {};

addBtn.addEventListener('click', () => {
    const id = addIdInput.value.trim();
    const value = addValueInput.value.trim();

    // ID 입력 여부
    if(id === ''){
        alert('ID를 입력하세요.');
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

    // 입력값 초기화
    addIdInput.value = '';
    addValueInput.value = '';
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
        valueInput.dataset.id = id;
        valueCell.appendChild(valueInput);

        // 삭제 버튼 셀
        const deleteCell = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent= '삭제';
        deleteBtn.addEventListener('click', () => {
            delete data[id];
            renderTable();
        })
        deleteCell.appendChild(deleteBtn);

        // 자식 노드 추가하기기
        row.appendChild(idCell);
        row.appendChild(valueCell);
        row.appendChild(deleteCell);
        tableBody.appendChild(row);
    }
}
