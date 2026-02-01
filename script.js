// تهيئة قائمة الأحزاب
const select = document.getElementById("startHizb");
for (let i = 1; i <= 60; i++) {
  const o = document.createElement("option");
  o.value = i;
  o.textContent = "حزب " + i;
  select.appendChild(o);
}

// حفظ حزب البداية مع تاريخ البداية
function saveStart() {
  const startHizb = parseInt(select.value);
  localStorage.setItem("startHizb", startHizb);
  localStorage.setItem("startDate", new Date().toDateString());
  loadToday();
}

// الحصول على الحزب اليومي حسب الوقت
function getHizb(time) {
  const start = parseInt(localStorage.getItem("startHizb") || 1);
  const startDateStr = localStorage.getItem("startDate") || new Date().toDateString();

  // حساب عدد الأيام منذ بداية الاستخدام
  const startDate = new Date(startDateStr);
  const today = new Date();
  const diffDays = Math.floor((today - startDate) / (1000*60*60*24));

  // الحزب الصباحي = البداية + فرق الأيام
  let morning = start + diffDays;
  if(morning > 60) morning = ((morning - 1) % 60) + 1;

  // الحزب المسائي = الحزب الصباحي +1
  let evening = morning + 1;
  if(evening > 60) evening = ((evening - 1) % 60) + 1;

  return time === "morning" ? morning : evening;
}

// عرض الحزب
function renderHizb(num) {
  const d = HIZB_DATA[num];
  return d ? `حزب ${num}\n📖 ${d.sura}\n🟢 ${d.start}` : `حزب ${num}`;
}

// تحميل بيانات اليوم
function loadToday() {
  const now = new Date();
  const day = now.getDay(); // 0=الأحد ... 4=الخميس ... 5=الجمعة

  document.getElementById("today").innerText = now.toLocaleDateString("ar-MA");

  // الصباح
  if(day === 5){ // صباح الجمعة
    document.getElementById("morning").innerText = "يس – الواقعة – تبارك";
  } else {
    document.getElementById("morning").innerText = renderHizb(getHizb("morning"));
  }

  // المساء
  if(day === 4){ // مساء الخميس
    document.getElementById("evening").innerText = "سورة الكهف";
  } else {
    document.getElementById("evening").innerText = renderHizb(getHizb("evening"));
  }
}

// قراءة الحزب / السورة
function readHizb(time) {
  const day = new Date().getDay();
  let title = "", text = "";

  // صباح الجمعة
  if(time === "morning" && day === 5){
    title = "صباح الجمعة";
    text = "يس – الواقعة – تبارك";
  }
  // مساء الخميس
  else if(time === "evening" && day === 4){
    title = "مساء الخميس";
    text = "سورة الكهف";
  }
  // باقي الأيام
  else {
    const num = getHizb(time);
    title = "حزب " + num;
    const d = HIZB_DATA[num];
    text = d ? `📖 ${d.sura}\n🟢 ${d.start}` : "نص الحزب غير مضاف بعد";
  }

  document.getElementById("readerTitle").innerText = title;
  document.getElementById("readerContent").innerText = text;
  document.getElementById("reader").classList.remove("hidden");
}

// إغلاق نافذة القراءة
function closeReader() {
  document.getElementById("reader").classList.add("hidden");
}

// تحميل التطبيق عند البداية
loadToday();
