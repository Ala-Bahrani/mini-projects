// ---------- Fruit icons (inline SVG) ----------
const img = (n) => `<img src="./images/${n}.png" alt="" draggable="false">`;
const ICONS = {
  blackberry: img("blackberry"),
  strawberry: img("strawberry"),
  blueberry: img("blueberry"),
  cranberry: img("cranberry"),
  original:'<img src="./images/leaf.webp" alt="" >',
};

// ---------- Flavors: نام عکس‌ها به فیلد image اضافه شد ----------
const FLAVORS = [
  { id: "blackberry", name: "Blackberry", price: "21.40$", color: "#6a1f78", image: "./images/cup-1.webp" },
  { id: "strawberry", name: "Strawberry", price: "20.90$", color: "#d92b3a", image: "./images/cup-2.webp" },
  { id: "original",   name: "Mohito",   price: "19.33$", color: "#7f9a2b", image: "./images/cup-original.webp" },
  { id: "blueberry",  name: "Blueberry",  price: "21.00$", color: "#33458f", image: "./images/cup-3.webp" },
  { id: "cranberry",  name: "Cranberry",  price: "20.50$", color: "#b3122f", image: "./images/cup-4.webp" },
];

// ---------- Elements ----------
const stage = document.getElementById("stage");
const frame = document.getElementById("frame");
const cup = document.getElementById("cup");
const cupImg = document.getElementById("cupImg");
const nameEl = document.getElementById("flavorName");
const priceEl = document.getElementById("price");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let active = 2;

// build cards
const cards = FLAVORS.map((f, i) => {
  const b = document.createElement("button");
  b.className = "card";
  b.setAttribute("aria-label", f.name);
  b.innerHTML = `<span class="card-ico">${ICONS[f.id]}</span>`;
  b.addEventListener("click", () => go(i));
  stage.appendChild(b);
  return b;
});

function render(animate) {
  const f = FLAVORS[active];

  cards.forEach((card, i) => {
    const off = i - active;
    const abs = Math.abs(off);
    card.style.setProperty("--off", off);
    card.style.setProperty("--abs", abs);
    card.classList.toggle("in-cup", off === 0);
    card.classList.toggle("hidden", abs > 2);
    card.tabIndex = off === 0 || abs > 2 ? -1 : 0;
  });

  // تغییر عکس لیوان با افکت محو شدن نرم
  if (cupImg.getAttribute("src") !== f.image) {
    cupImg.style.opacity = 0;
    setTimeout(() => {
      cupImg.src = f.image;
      cupImg.style.opacity = 1;
    }, 180); // نیم‌ثانیه صبر می‌کند تا عکس قبلی محو شود
  }

  nameEl.textContent = f.name;
  priceEl.textContent = f.price;
  prev.disabled = active === 0;
  next.disabled = active === FLAVORS.length - 1;

  if (animate) {
    cup.classList.remove("sip");
    void cup.offsetWidth;
    cup.classList.add("sip");
  }
}

function go(i) {
  const n = Math.max(0, Math.min(FLAVORS.length - 1, i));
  if (n === active) return;
  active = n;
  render(true);
}

// ---------- Controls ----------
prev.addEventListener("click", () => go(active - 1));
next.addEventListener("click", () => go(active + 1));
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") go(active + 1);
  if (e.key === "ArrowLeft") go(active - 1);
});

let startX = null;
frame.addEventListener("pointerdown", (e) => (startX = e.clientX));
frame.addEventListener("pointerup", (e) => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  startX = null;
});

render(false);