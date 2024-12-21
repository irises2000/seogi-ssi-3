const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/13kWyDNR5larvdzYubROyb9KlqocmFr1_mxDmWAWbqHA/gviz/tq?tqx=out:csv";

// 데이터를 가져오는 함수
async function fetchData() {
  const response = await fetch(SHEET_URL);
  const data = await response.text();
  return parseCSV(data);
}

// CSV 데이터를 파싱하는 함수
function parseCSV(data) {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      complete: function (results) {
        resolve(results.data);
      },
      header: true, // 첫 번째 줄을 헤더로 사용
      skipEmptyLines: true,
    });
  });
}

// 날짜 목록을 생성하는 함수
function createDateList(data) {
  const dateList = document.getElementById("date-list");

  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("date-item");
    div.innerText = item.date;
    div.dataset.index = index;

    // 클릭 이벤트 추가
    div.addEventListener("click", () => {
      scrollToItem(index, data);
    });

    dateList.appendChild(div);
  });
}

// 선택된 아이템을 활성화하는 함수
function activateItem(index, data) {
  const items = document.querySelectorAll(".date-item");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });

  const content = data[index];
  const leftImage = document.getElementById("left-image");
  const leftContent = document.getElementById("left-content");
  const leftFootnote = document.getElementById("left-footnote");
  const rightImage = document.getElementById("right-image");
  const rightContent = document.getElementById("right-content");
  const rightFootnote = document.getElementById("right-footnote");

  // 좌측 박스 데이터
  leftImage.innerHTML =
    content.writer === "JY" && content.img
      ? `<img src="${content.img}" alt="Left Image" style="max-width: 100%; max-height: 100%;">`
      : "";
  leftContent.innerText = content.writer === "JY" ? content.content : "";
  leftFootnote.innerText =
    content.writer === "JY" && content.footnote ? content.footnote : "";

  // 우측 박스 데이터
  rightImage.innerHTML =
    content.writer === "HY" && content.img
      ? `<img src="${content.img}" alt="Right Image" style="max-width: 100%; max-height: 100%;">`
      : "";
  rightContent.innerText = content.writer === "HY" ? content.content : "";
  rightFootnote.innerText =
    content.writer === "HY" && content.footnote ? content.footnote : "";
}

// 자석 스냅 스크롤 구현
function scrollToItem(index, data) {
  const items = document.querySelectorAll(".date-item");
  const targetItem = items[index];

  // scrollIntoView를 사용해 자석 스냅 스크롤 구현
  targetItem.scrollIntoView({
    behavior: "smooth",
    block: "center", // 화면 중앙에 맞추기
  });

  activateItem(index, data);
}

// 스크롤 이벤트 리스너 설정
function setupScrollListener(data) {
  const dateList = document.getElementById("date-list");

  dateList.addEventListener("scroll", () => {
    const items = document.querySelectorAll(".date-item");
    let closestItem = null;
    let closestDistance = Infinity;

    // 각 아이템의 중심과 화면 중앙의 차이를 계산하여 가장 가까운 항목 찾기
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = window.innerHeight / 2;
      const distance = Math.abs(rect.top + rect.height / 2 - center);

      // 가장 가까운 항목 찾기
      if (distance < closestDistance) {
        closestItem = item;
        closestDistance = distance;
      }
    });

    if (closestItem) {
      activateItem(parseInt(closestItem.dataset.index), data);
    }
  });
}

// 페이지 로드 시 첫 번째 아이템을 활성화하는 함수
function activateInitialItem(data) {
  const dateList = document.getElementById("date-list");

  const items = document.querySelectorAll(".date-item");
  let closestItem = null;
  let closestDistance = Infinity;

  // 첫 번째 활성화 항목을 선택하기 위해 가장 가까운 아이템 찾기
  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const distance = Math.abs(rect.top + rect.height / 2 - center);

    if (distance < closestDistance) {
      closestItem = item;
      closestDistance = distance;
    }
  });

  if (closestItem) {
    activateItem(parseInt(closestItem.dataset.index), data);
  }
}

// 초기화 함수
(async function init() {
  const data = await fetchData();
  createDateList(data);
  setupScrollListener(data);
  // 첫 번째 활성화 아이템 설정
  activateInitialItem(data);
})();
