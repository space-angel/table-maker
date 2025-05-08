import {
  Plugin,
  Modal,
  MarkdownView,
  Notice,
  App
} from 'obsidian';

interface TableData {
  headers: string[];
  rows: string[][];
}


const STYLES = {
  // 모달 배경 투명화
  MODAL_BG: `
    opacity: 0 !important;
  `,

  // 모달 컨테이너 스타일
  MODAL_CONTAINER: `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 75% !important;
    height: 75% !important;
    max-width: 1200px !important;
    max-height: 800px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent !important; /* 배경을 완전히 투명하게 설정 */
  `,

  // 모달 본체 스타일
  MODAL: `
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: white;
    font-family: 'SUIT', 'Apple SD Gothic Neo', 'sans-serif';
    pointer-events: auto; /* 모달 자체는 클릭 이벤트 활성화 */
  `,

  TOP_BAR: `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background:rgb(255, 255, 255);
  border-bottom: 1px solid #eaecef;
  width: 100%;
`,

  // 테이블 제목 스타일
  TABLE_TITLE: `
    font-size: 20px;
    font-weight: 600;
    color: #1f2328;
    margin-right: 16px;
  `,

  // 좌측 툴바 스타일
  LEFT_TOOLBAR: `
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-start;
    flex: 1;
  `,

  // 우측 툴바 스타일
  RIGHT_TOOLBAR: `
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  // 버튼 기본 스타일
  BUTTON: `
    padding: 6px 12px;
    font-size: 13px;
    border-radius: 6px;
    background: #f1f3f5;
    color: #1f2328;
    transition: background 0.2s ease;
    cursor: pointer;
    border: none !important;
  `,

  // 버튼 호버 스타일
  BUTTON_HOVER: `
    background: #e6e8eb;
  `,

  // 프라이머리 버튼 스타일
  PRIMARY_BUTTON: `
    background: #3182f6;
    color: white;
    border: none;
  `,

  // 아웃라인 버튼 스타일
  OUTLINE_BUTTON: `
    border: 1px solid #d0d7de;
    background: #fff;
    color: #1f2328;
  `,

  // 드롭다운 버튼 스타일
  DROPDOWN_BUTTON: `
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    background: white !important;
    color: #1f2328;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #e5e8ed;
  `,

  // 드롭다운 화살표 스타일
  DROPDOWN_ARROW: `
    font-size: 10px;
    margin-left: 5px;
  `,

  // 체크박스 래퍼 스타일
  CHECKBOX_WRAPPER: `
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  // 닫기 버튼 스타일
  CLOSE_BUTTON: `
    font-size: 20px;
    background: white !important;
    border: none;
    cursor: pointer;
    color: #98a4b3;
    padding: 0 6px;
  `,

  // 하단 바 스타일
  BOTTOM_BAR: `
    padding: 16px 24px;
    border-top: 1px solid #eaecef;
    text-align: center;
    background: white;
    display: flex;
    justify-content: center;
  `,

  // 삽입 버튼 스타일 (세그먼티드 컨트롤 스타일)
  INSERT_BUTTON: `
    padding: 8px 24px;
    font-size: 14px;
    background: white !important;
    color: #1f2328;

    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    border: none !important;
  `,

  // 삽입 버튼 호버 스타일 (세그먼티드 컨트롤 스타일)
  INSERT_BUTTON_HOVER: `
    background: #f1f3f5;
  `,

  // 테이블 컨테이너 스타일 (스크롤 처리)
  TABLE_CONTAINER: `
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    padding: 0 24px;
    background: white;
  `,

  // 테이블 기본 스타일
  TABLE: `
    border-collapse: collapse;
    width: auto;
    margin: 24px 0;
    font-size: 13px;
    color: #1f2328;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    table-layout: fixed;
  `,

  // 테이블 셀 공통 스타일
  TABLE_CELL: `
    box-sizing: border-box;
    border: 1px solid #eaecef;
    padding: 8px 12px;
    text-align: left;
    background: transparent;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 150px;
    min-width: 150px;
    max-width: 150px;
  `,

  // 테이블 헤더 셀 스타일
  TABLE_HEADER: `
    background: #f9fafb;
    font-weight: 500;
    color: #1f2328;
    height: 36px; /* 헤더 높이 고정 */
    position: sticky;
    top: 0;
    z-index: 2;
  `,

  // 행 핸들 스타일
  ROW_HANDLE: `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    width: 100%;
    height: 100%;
    justify-content: center;
    cursor: move;
  `,

  // 행 핸들 셀 스타일
    ROW_HANDLE_CELL: `
      width: 10px;
      min-width: 10px;
      max-width: 10px;
      border-right: 1px solid #eaecef;
      background: #f9fafb;
      position: sticky;
      left: 0;
      z-index: 1;
    `,

  // 점 스타일
  DOT: `
    width: 3px;
    height: 3px;
    background-color: #98a4b3;
    border-radius: 50%;
  `,

  // 코너 셀 스타일
  CORNER_CELL: `
    background: #f9fafb;
    border-right: 1px solid #eaecef;
    border-bottom: 1px solid #eaecef;
    width: 10px !important;
    min-width: 10px !important;
    max-width: 10px !important;
    height: 36px;
    position: sticky;
    left: 0;
    top: 0;
    z-index: 3;
  `,

  // 드래그 중인 셀 스타일
  DRAGGING_CELL: `
    opacity: 0.7;
    box-shadow: 0 0 0 2px #3182f6;
    position: relative;
    z-index: 10;
  `,

  // 드래그 중인 행 스타일
  DRAGGING_ROW: `
    border: 2px solid #3182f6;
    background-color: rgba(49, 130, 246, 0.08);
  `,

  // 드래그 오버 스타일
  DRAG_OVER: `
    background-color: #e6e8eb;
    border: 2px dashed #3182f6;
  `,

  // 선택된 셀 스타일
  SELECTED_CELL: `
    box-shadow: 0 0 0 2px #3182f6;
    position: relative;
    z-index: 1;
  `,

  // 테이블 데이터 셀 스타일
  TABLE_DATA_CELL: `
    height: 36px; /* 데이터 셀 높이 고정 */
  `
};

class TableBuilderModal extends Modal {
  rowCount: number;
  colCount: number;
  tableEl: HTMLTableElement;
  tableData: TableData;
  selectedCell: HTMLElement | null = null;
  draggedElement: HTMLElement | null = null; // 드래그 중인 요소를 추적
  tableContainer: HTMLElement | null = null; // 테이블 컨테이너 요소


// 생성자 수정 - 배열 길이 오류 방지
constructor(app: App, rowCount = 0, colCount = 0) {
  super(app);
  this.rowCount = Math.max(0, rowCount);
  this.colCount = Math.max(0, colCount);
  
  // 초기 테이블 데이터 생성
  this.tableData = {
    headers: Array(this.colCount).fill('').map((_, i) => `헤더 ${i + 1}`),
    rows: this.rowCount > 0 ? Array(this.rowCount).fill(null).map(() => Array(this.colCount).fill('')) : []
  };
}
// onOpen 메서드 수정 - 제목 텍스트와 닫기 버튼 제거
onOpen() {
  const { contentEl } = this;
  contentEl.empty();

  // 모달 컨테이너에 스타일 적용
  this.modalEl.classList.add('modal-container');
  this.modalEl.style.width = '100%';
  this.modalEl.style.display = 'flex';
  this.modalEl.style.flexDirection = 'column';

  // 모달 내부 콘텐츠가 전체 영역을 채우도록 modal 클래스 추가
  this.contentEl.classList.add('modal');

  // 상단 툴바 생성
  const topBar = contentEl.createDiv({ cls: 'table-top-bar' });

  // 왼쪽 툴바 버튼들
  const leftToolbar = topBar.createDiv({ cls: 'left-toolbar' });

  // 일반: 리스트 드롭다운
  const listTypeBtn = leftToolbar.createEl('button', { cls: 'toolbar-dropdown' });
  listTypeBtn.innerHTML = '일반: 리스트 <span class="dropdown-arrow">▼</span>';

  // + 열·세로, + 행·가로 버튼
  const addColBtn = leftToolbar.createEl('button', { text: '+ 열·세로', cls: 'toolbar-button' });
  addColBtn.onclick = () => this.addCol();

  const addRowBtn = leftToolbar.createEl('button', { text: '+ 행·가로', cls: 'toolbar-button' });
  addRowBtn.onclick = () => this.addRow();

  const rightToolbar = topBar.createDiv({ cls: 'right-toolbar' });
  const closeBtn = rightToolbar.createEl('button', { cls: 'close-button' });
  closeBtn.innerText = '×';
  closeBtn.onclick = () => this.close();
  // 테이블 컨테이너 생성 - 스크롤을 위한 래퍼
  this.tableContainer = contentEl.createDiv({ cls: 'table-container' });
  
  // 테이블 생성
  this.tableEl = this.tableContainer.createEl('table');
  this.tableEl.classList.add('generated-table');

  this.renderTable();

  // 테이블 삽입 버튼 (하단)
  const bottomBar = contentEl.createDiv({ cls: 'table-bottom-bar' });
  const insertButton = bottomBar.createEl('button', { text: '테이블 삽입', cls: 'insert-button' });
  insertButton.onclick = () => {
    const markdown = this.toMarkdown();
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      view.editor.replaceSelection(markdown);
      new Notice('마크다운 테이블이 삽입되었습니다');
      this.close();
    }
  };

  // 스타일 적용
  this.applyStyles();
}

  // 스타일을 적용하는 메서드 (분리하여 유지보수성 향상)
  applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .modal-header {
        display: none !important;
      }

      .modal-bg {
        ${STYLES.MODAL_BG}
      }

      .modal-container {
        ${STYLES.MODAL_CONTAINER}
      }
      
      .modal {
        ${STYLES.MODAL}
      }
      
      .table-top-bar {
        ${STYLES.TOP_BAR}
      }
      /* 상단 바 버튼 그림자 제거 */
      .table-top-bar button {
        box-shadow: none !important;
      }

      /* + 버튼 회색 배경, 테두리 없앰 */
      .table-top-bar .toolbar-button {
        background: #f1f3f5 !important;
        border: none !important;
        color: #1f2328 !important;
      }

      /* 드롭다운 버튼은 흰색 배경, 테두리만 유지 */
      .table-top-bar .toolbar-dropdown {
        background: white !important;
        border: 1px solid #e5e8ed !important;
        color: #1f2328 !important;
      }
      
      .table-title {
        ${STYLES.TABLE_TITLE}
      }
      
      .left-toolbar {
        ${STYLES.LEFT_TOOLBAR}
      }
      
      .right-toolbar {
        ${STYLES.RIGHT_TOOLBAR}
      }
      
      /* .toolbar-button, .toolbar-dropdown 등 broad selector 제거됨 */
      .toolbar-button:hover {
        ${STYLES.BUTTON_HOVER}
      }
      
      .toolbar-button.primary {
        ${STYLES.PRIMARY_BUTTON}
      }
      
      .toolbar-button.outline {
        ${STYLES.OUTLINE_BUTTON}
      }
      
      .dropdown-arrow {
        ${STYLES.DROPDOWN_ARROW}
      }
      
      .toolbar-checkbox-wrapper {
        ${STYLES.CHECKBOX_WRAPPER}
      }
      
      .close-button {
        ${STYLES.CLOSE_BUTTON}
      }
      
      .table-bottom-bar {
        ${STYLES.BOTTOM_BAR}
      }
      
      .table-container {
        ${STYLES.TABLE_CONTAINER}
      }
      
      .insert-button {
        ${STYLES.INSERT_BUTTON}
      }
      
      .insert-button:hover {
        ${STYLES.INSERT_BUTTON_HOVER}
      }
      
      .generated-table {
        ${STYLES.TABLE}
      }
      
      .generated-table th,
      .generated-table td {
        ${STYLES.TABLE_CELL}
      }
      
      .generated-table th {
        ${STYLES.TABLE_HEADER}
      }

      .generated-table td {
        ${STYLES.TABLE_DATA_CELL}
      }
      
      .row-handle {
        ${STYLES.ROW_HANDLE}
      }
      
      .generated-table td.row-handle-cell {
        ${STYLES.ROW_HANDLE_CELL}
      }
      
      .dot {
        ${STYLES.DOT}
      }
      
      .corner-cell {
        ${STYLES.CORNER_CELL}
      }
      
      /* 드래그 중인 요소 스타일 */
      .dragging-cell {
        ${STYLES.DRAGGING_CELL}
      }
      
      .dragging-row {
        ${STYLES.DRAGGING_ROW}
      }
      
      .drag-over {
        ${STYLES.DRAG_OVER}
      }
      
      .selected-cell {
        ${STYLES.SELECTED_CELL}
      }
    `;
    this.contentEl.appendChild(style);
  }

  addRow() {
    this.rowCount++;
    // 데이터에 새 행 추가
    this.tableData.rows.push(Array(this.colCount).fill(''));
    this.renderTable();
  }

  removeRow(rowIndex: number) {
    if (this.rowCount > 2) { // 헤더 행은 항상 유지
      this.rowCount--;
      // 지정한 행 제거
      this.tableData.rows.splice(rowIndex, 1);
      this.renderTable();
    }
  }

  addCol() {
    this.colCount++;
    // 헤더에 새 열 추가
    this.tableData.headers.push(`헤더 ${this.colCount}`);
    // 모든 행에 새 열 추가
    this.tableData.rows.forEach(row => row.push(''));
    this.renderTable();
  }

  removeCol(colIndex: number) {
    if (this.colCount > 1) {
      this.colCount--;
      // 헤더에서 지정한 열 제거
      this.tableData.headers.splice(colIndex, 1);
      // 모든 행에서 지정한 열 제거
      this.tableData.rows.forEach(row => row.splice(colIndex, 1));
      this.renderTable();
    }
  }
  
  deselectAll() {
    // 선택된 셀 및 행/열 강조 제거
    const allCells = this.tableEl.querySelectorAll('th, td');
    allCells.forEach(cell => {
      cell.classList.remove('selected-cell');
    });
    this.selectedCell = null;
  }
  
  selectCell(cell: HTMLElement) {
    this.deselectAll();
    
    // 셀 선택 표시
    cell.classList.add('selected-cell');
    this.selectedCell = cell;
  }

  renderTable() {
    if (!this.tableEl) return;
    this.tableEl.empty();

    // 헤더 행 생성
    const headerRow = this.tableEl.createEl('tr');

    // 빈 코너 셀 (왼쪽 상단)
    const cornerCell = headerRow.createEl('th', { cls: 'corner-cell' });

    // 헤더 셀 생성
    this.tableData.headers.forEach((headerText, colIndex) => {
      const th = headerRow.createEl('th');
      th.textContent = headerText;
      th.dataset.colIndex = colIndex.toString();

      // 헤더 셀 클릭 시 편집 기능
      th.addEventListener('click', (e) => {
        // 이미 편집 중이면 중복 처리 방지
        if ((e.target as HTMLElement).tagName === 'INPUT') return;

        // 편집 모드
        const input = document.createElement('input');
        input.type = 'text';
        input.value = th.textContent || '';
        input.style.width = '100%';
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.background = 'transparent';
        input.style.height = '100%';
        input.style.boxSizing = 'border-box';

        // 현재 내용 임시 저장
        const currentText = th.textContent;
        th.textContent = '';
        th.appendChild(input);
        input.focus();

        input.addEventListener('blur', () => {
          const newValue = input.value || currentText || `헤더 ${colIndex + 1}`;
          this.tableData.headers[colIndex] = newValue;
          th.textContent = newValue;
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
          else if (e.key === 'Escape') {
            input.value = currentText || '';
            input.blur();
          }
        });

        // 이벤트 전파 중지
        e.stopPropagation();
      });

      // 헤더 드래그 기능
      th.setAttribute('draggable', 'true');

      th.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', `col-${colIndex}`);
        th.classList.add('dragging-cell'); // 드래그 시작 시 스타일 추가
        this.draggedElement = th; // 드래그 중인 요소 추적
      });

      th.addEventListener('dragend', () => {
        th.classList.remove('dragging-cell'); // 드래그 종료 시 스타일 제거
        this.draggedElement = null; // 드래그 중인 요소 초기화
      });

      th.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (this.draggedElement !== th) {
          th.classList.add('drag-over'); // 드래그 오버 시 스타일 추가
        }
      });

      th.addEventListener('dragleave', () => {
        th.classList.remove('drag-over'); // 드래그 떠날 때 스타일 제거
      });

      th.addEventListener('drop', (e) => {
        e.preventDefault();
        th.classList.remove('drag-over'); // 드롭 시 스타일 제거

        const dragData = e.dataTransfer?.getData('text/plain') || '';
        if (dragData.startsWith('col-')) {
          const fromColIndex = parseInt(dragData.split('-')[1]);
          const toColIndex = colIndex;

          if (fromColIndex !== toColIndex) {
            this.swapColumns(fromColIndex, toColIndex);
            this.renderTable();
          }
        }
      });
    });

    // 데이터 행 생성
    this.tableData.rows.forEach((rowData, rowIndex) => {
      const tr = this.tableEl.createEl('tr');

      // 행 핸들 셀 (점 3개)
      const handleCell = tr.createEl('td', { cls: 'row-handle-cell' });
      const rowHandle = document.createElement('div');
      rowHandle.classList.add('row-handle');

      // 점 3개 생성
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        rowHandle.appendChild(dot);
      }

      handleCell.appendChild(rowHandle);

      // 행 드래그 기능
      tr.setAttribute('draggable', 'true');

      rowHandle.addEventListener('mousedown', () => {
        tr.draggable = true;
      });

      tr.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', `row-${rowIndex}`);
        tr.classList.add('dragging-row'); // 드래그 시작 시 스타일 추가
        this.draggedElement = tr; // 드래그 중인 요소 추적
      });

      tr.addEventListener('dragend', () => {
        tr.classList.remove('dragging-row'); // 드래그 종료 시 스타일 제거
        this.draggedElement = null; // 드래그 중인 요소 초기화
      });

      tr.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (this.draggedElement !== tr) {
          tr.classList.add('drag-over'); // 드래그 오버 시 스타일 추가
        }
      });

      tr.addEventListener('dragleave', () => {
        tr.classList.remove('drag-over'); // 드래그 떠날 때 스타일 제거
      });

      tr.addEventListener('drop', (e) => {
        e.preventDefault();
        tr.classList.remove('drag-over'); // 드롭 시 스타일 제거

        const dragData = e.dataTransfer?.getData('text/plain') || '';
        if (dragData.startsWith('row-')) {
          const fromRowIndex = parseInt(dragData.split('-')[1]);
          const toRowIndex = rowIndex;

          if (fromRowIndex !== toRowIndex) {
            this.swapRows(fromRowIndex, toRowIndex);
            this.renderTable();
          }
        }
      });

      // 일반 셀 생성
      rowData.forEach((cellData, colIndex) => {
        const td = tr.createEl('td');
        td.textContent = cellData || ''; // 셀 데이터가 있으면 표시, 없으면 빈 문자열 표시

        // 셀 클릭 시 편집 기능
        td.addEventListener('click', (e) => {
          // 이미 편집 중이면 중복 처리 방지
          if ((e.target as HTMLElement).tagName === 'INPUT') return;

          // 편집 모드
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = '텍스트';
          input.value = this.tableData.rows[rowIndex][colIndex] || '';
          input.style.width = '100%';
          input.style.border = 'none';
          input.style.outline = 'none';
          input.style.height = '100%';
          input.style.boxSizing = 'border-box';

          // 현재 내용 임시 저장
          const currentValue = this.tableData.rows[rowIndex][colIndex];

          td.textContent = '';
          td.appendChild(input);
          input.focus();

          input.addEventListener('blur', () => {
            this.tableData.rows[rowIndex][colIndex] = input.value;
            td.textContent = input.value;
          });

          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            else if (e.key === 'Escape') {
              input.value = currentValue || '';
              input.blur();
            }
          });

          // 이벤트 전파 중지
          e.stopPropagation();
        });
      });
    });

    // 8행 이상일 때 스크롤 확인
    this.checkAndEnableScroll();
  }
  
  // 스크롤 활성화 여부 확인 메서드
  checkAndEnableScroll() {
    if (this.tableContainer && this.rowCount > 8) {
      this.tableContainer.style.overflowY = 'auto';
    } else if (this.tableContainer) {
      this.tableContainer.style.overflowY = 'visible';
    }
  }
  
  swapColumns(fromIndex: number, toIndex: number) {
    // 헤더 교체
    [this.tableData.headers[fromIndex], this.tableData.headers[toIndex]] = 
      [this.tableData.headers[toIndex], this.tableData.headers[fromIndex]];
    
    // 모든 행의 해당 열 데이터 교체
    this.tableData.rows.forEach(row => {
      [row[fromIndex], row[toIndex]] = [row[toIndex], row[fromIndex]];
    });
  }
  
  swapRows(fromIndex: number, toIndex: number) {
    // 행 데이터 교체
    [this.tableData.rows[fromIndex], this.tableData.rows[toIndex]] = 
      [this.tableData.rows[toIndex], this.tableData.rows[fromIndex]];
  }

  toMarkdown(): string {
    let markdown = '';
    
    // 헤더 행
    let headerRow = '|';
    this.tableData.headers.forEach(header => {
      headerRow += ` ${header} |`;
    });
    markdown += headerRow + '\n';
    
    // 구분 행
    let separator = '|';
    for (let i = 0; i < this.colCount; i++) {
      separator += ' --- |';
    }
    markdown += separator + '\n';
    
    // 데이터 행
    this.tableData.rows.forEach(row => {
      let rowText = '|';
      row.forEach(cell => {
        rowText += ` ${cell} |`;
      });
      markdown += rowText + '\n';
    });
    
    return markdown;
  }
}

export default class TablePlugin extends Plugin {
  onload() {
    this.addCommand({
      id: 'open-table-builder',
      name: '테이블 생성기 열기',
      callback: () => {
        new TableBuilderModal(this.app).open();
      }
    });
  }
}