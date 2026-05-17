const courseDB = {
  "教育基礎課程": {
    "選修": [{n:"教育概論",c:2}, {n:"教育哲學",c:2}, {n:"教育行政",c:2}, {n:"比較教育",c:2}, {n:"教育心理學",c:2}, {n:"教育社會學",c:2}, {n:"特殊教育導論",c:3}, {n:"兒童及青少年發展",c:2}, {n:"教育概論（雙語教學課程）",c:2}, {n:"教育心理學（雙語教學課程）",c:2}]
  },
  "教育方法課程": {
    "選修": [{n:"教學原理",c:2}, {n:"學習評量",c:2}, {n:"班級經營",c:2}, {n:"學習策略",c:2}, {n:"學習扶助",c:2}, {n:"教育議題專題",c:2}, {n:"課程發展與設計",c:2}, {n:"輔導原理與實務",c:2}, {n:"適性教學與科技",c:2}, {n:"教學媒體與應用",c:2}, {n:"資訊倫理與教學",c:2}, {n:"教師專業發展與倫理",c:2}, {n:"教學原理（雙語教學課程）",c:2}, {n:"課程發展與設計（雙語教學課程）",c:2}]
  },
  "教育實踐課程": {
    "必修": [{n:"國民小學教學實習",c:4},{n:"國民小學國語教材教法",c:2},{n:"國民小學數學教材教法",c:2}],
    "選修": [{n:"主題式教學與實務",c:2}, {n:"國民小學英語教材教法",c:2}, {n:"國民小學社會教材教法",c:2}, {n:"國民小學藝術教材教法",c:2}, {n:"國民小學健康與體育教法",c:2}, {n:"國民小學資訊教材教法",c:2}, {n:"國民小學本土語文教材教法",c:2}, {n:"國民小學自然科學教材教法",c:2}, {n:"國民小學綜合活動教材教法",c:2}, {n:"國民小學數學教材教法（雙語教學課程）",c:2}, {n:"國民小學體育教材教法（雙語教學課程）",c:2}]
  },
  "國民小學師資類科專門課程": {
    "必修": [{n:"國音及說話",c:2}, {n:"普通數學",c:2}, {n:"跨領域課程理論與實務",c:2}],
    "語文選修": [{n:"閱讀教育",c:2}, {n:"兒童英語",c:2}, {n:"本土語言",c:2}],
    "自然科學選修": [{n:"自然科學概論",c:2}, {n:"數位學習導論",c:2}],
    "社會選修": [{n:"社會學習領域概論",c:2}],
    "健康與體育選修": [{n:"健康與體育",c:2}, {n:"樂趣化體育",c:2}],
    "藝術選修": [{n:"藝術概論",c:2}, {n:"表演藝術",c:2}],
    "綜合活動選修": [{n:"綜合活動課程",c:2}, {n:"人際關係與溝通",c:2}]
  }
};

let selected = [];

window.onload = function () {
    load();
    render();
};

function updateMain() {
    const semSelect = document.getElementById("semesterSelect");
    const sem = semSelect.value.trim();
    const mainSelect = document.getElementById("mainSelect");
    mainSelect.innerHTML = '<option value="">2. 選擇類別</option>';
    document.getElementById("courseSelect").innerHTML = '<option value="">3. 選擇課程</option>';
    
    if (!sem || !courseDB[sem]) return;
    
    Object.keys(courseDB[sem]).forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat; opt.textContent = cat;
        mainSelect.appendChild(opt);
    });
}

function updateCourse() {
    const sem = document.getElementById("semesterSelect").value.trim();
    const cat = document.getElementById("mainSelect").value.trim();
    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = '<option value="">3. 選擇課程</option>';
    
    if (!sem || !cat || !courseDB[sem][cat]) return;

    let mainTag = "";
    if (sem === "教育基礎課程") mainTag = "basic";
    else if (sem === "教育方法課程") mainTag = "method";
    else if (sem === "教育實踐課程") mainTag = "practice";
    else if (sem === "國民小學師資類科專門課程") mainTag = "primary";

    courseDB[sem][cat].forEach(c => {
        const opt = document.createElement("option");
        const info = { n: c.n, c: c.c, main: mainTag, sem: sem };
        opt.value = JSON.stringify(info);
        opt.textContent = c.n; 
        courseSelect.appendChild(opt);
    });
}

function addCourse() {
    const val = document.getElementById("courseSelect").value;
    if (!val) return alert("請選取課程！");
    const obj = JSON.parse(val);
    if (selected.some(s => s.n === obj.n)) return alert("這門課已經加過了喔！");
    obj.id = Date.now();
    selected.push(obj);
    save(); render();
}

function remove(id) {
    selected = selected.filter(c => c.id !== id);
    save(); render();
}

function render() {
    const container = document.getElementById("list-container");
    if (!container) return;
    container.innerHTML = "";
    
    const reqs = { basic: 8, method: 12, practice: 16, primary: 10, totalGoal: 46 };
    let stats = { basic: 0, method: 0, practice: 0, primary: 0, total: 0 };
    
    const semLabels = ["教育基礎課程", "教育方法課程", "教育實踐課程", "國民小學師資類科專門課程"];
    
    semLabels.forEach(semKey => {
        const courses = selected.filter(c => c.sem === semKey);
        if (courses.length > 0) {
            const block = document.createElement("div");
            block.className = "semester-block";
            const ulId = `ul-${Math.random().toString(36).substr(2, 9)}`;
            block.innerHTML = `<div class="semester-title">${semKey}</div><ul id="${ulId}"></ul>`;
            container.appendChild(block);
            
            courses.forEach(c => {
                if (c.main === "basic") stats.basic += c.c;
                else if (c.main === "method") stats.method += c.c;
                else if (c.main === "practice") stats.practice += c.c;
                else if (c.main === "primary") stats.primary += c.c;
                
                stats.total += c.c;

                const li = document.createElement("li");
                li.innerHTML = `<span>${c.n}</span><button class="delete-btn" onclick="remove(${c.id})">刪除</button>`;
                document.getElementById(ulId).appendChild(li);
            });
        }
    });

    // 🛠️ 檢查 6 門核心必修是否存在的邏輯
    const has習 = selected.some(s => s.n === "國民小學教學實習");
    const has國 = selected.some(s => s.n === "國民小學國語教材教法");
    const has數 = selected.some(s => s.n === "國民小學數學教材教法");
    const has音 = selected.some(s => s.n === "國音及說話");
    const has普 = selected.some(s => s.n === "普通數學");
    const has跨 = selected.some(s => s.n === "跨領域課程理論與實務");

    // 🛠️ 新增：改變徽章 CSS Class 的連動設計（高亮亮起 vs 灰色隱藏）
    const updateBadgeUI = (id, label, cond) => {
        const el = document.getElementById(id);
        if(el) {
            if (cond) {
                el.className = "must-badge active";
                el.textContent = `✓ ${label}`;
            } else {
                el.className = "must-badge missing";
                el.textContent = label;
            }
        }
    };

    updateBadgeUI("badge-實習", "教學實習", has習);
    updateBadgeUI("badge-國語教法", "國語教法", has國);
    updateBadgeUI("badge-數學教法", "數學教法", has數);
    updateBadgeUI("badge-國音", "國音及說話", has音);
    updateBadgeUI("badge-普數", "普通數學", has普);
    updateBadgeUI("badge-跨領域", "跨領域實務", has跨);

    const updateUI = (id, cur, goal, isTotalCard = false) => {
        const el = document.getElementById(id);
        if(el) {
            el.textContent = cur;
            if (isTotalCard) {
                el.style.color = cur >= goal ? "#10b981" : "#a5b4fc";
            } else {
                el.style.color = cur >= goal ? "#10b981" : "#ef4444";
            }
        }
    };

    updateUI("score-basic", stats.basic, reqs.basic);
    updateUI("score-method", stats.method, reqs.method);
    updateUI("score-practice", stats.practice, reqs.practice);
    updateUI("score-primary", stats.primary, reqs.primary);
    updateUI("total", stats.total, reqs.totalGoal, true);

    const totalStatus = document.getElementById("total-status");
    const scoreWin = (stats.basic >= reqs.basic && stats.method >= reqs.method && stats.practice >= reqs.practice && stats.primary >= reqs.primary);
    const mustWin = (has習 && has國 && has數 && has音 && has普 && has跨);

    if (scoreWin && mustWin) {
        totalStatus.textContent = "✅ 已達成學分與必修門檻！";
        totalStatus.style.color = "#10b981";
    } else if (scoreWin && !mustWin) {
        totalStatus.textContent = "⚠ 學分已夠，但缺少核心必修科目！";
        totalStatus.style.color = "#fbbf24";
    } else {
        totalStatus.textContent = "目標：符合各項最低標準";
        totalStatus.style.color = "#9393FF";
    }
}

function save() { localStorage.setItem("nua_clean_v1", JSON.stringify(selected)); }
function load() { const d = localStorage.getItem("nua_clean_v1"); if (d) selected = JSON.parse(d); }