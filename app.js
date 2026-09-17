/**
 * Limitlm 个人引导页
 * 加站点：只需在 SITE_GROUPS 对应数组里加 { name, url }，无需改 CSS。
 */

const SITE_GROUPS = [
  {
    id: "personal",
    items: [
      { name: "我的博客", url: "https://blog.limitlm.top" },
      { name: "我的图床", url: "https://imgbed.limitlm.top" },
      { name: "弹幕服务", url: "https://danmu.limitlm.top" },
      { name: "洛克工具", url: "https://rocom.limitlm.top" },
      { name: "hexo博客", url: "https://limitlm.github.io" },
      { name: "备用博客cf", url: "https://blogcf.limitlm.top" },
      { name: "备用博客nl", url: "https://blognl.limitlm.top" },
    ],
  },
  {
    id: "common",
    items: [
      { name: "开源排行榜", url: "https://kaiyuanbang.cn/zh-cn" },
      { name: "洛克PVP", url: "https://rocopvp.tzrain.wiki" },
      { name: "表格提取", url: "https://web.baimiaoapp.com/image-to-excel" },
    ],
  },
];

const TAGLINE = "无限进步，未来可期";
const EMAIL = "283304662@qq.com";

const BG_REMOTE = { desktop: "https://t.alcy.cc/pc", mobile: "https://t.alcy.cc/mp" };
const BG_LOCAL = { desktop: "assets/bg-pc.webp", mobile: "assets/bg-mp.webp" };

/** 随机图加载超时（ms），超时直接用本地 */
const BG_TIMEOUT = 2500;

const TYPE_DELAY = 90;
const TYPE_LOOP_PAUSE = 1800;
const OPEN_START = 280;
const OPEN_BIO = 420;
const TYPE_START = 1100;

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const bgMq = matchMedia("(max-width: 768px)");

let bgLoadId = 0;
let bgVisibleId = "bg-layer-a";
let toastTimer = 0;

const $ = (id) => document.getElementById(id);

function renderSites() {
  const wrap = $("sites-wrap");
  if (!wrap) return;

  const fragment = document.createDocumentFragment();
  let rows = 0;

  for (const group of SITE_GROUPS) {
    const items = group.items.filter((item) => item.name && item.url);
    if (!items.length) continue;

    if (rows > 0) {
      const rule = document.createElement("div");
      rule.className = "v-rule";
      rule.setAttribute("aria-hidden", "true");
      fragment.appendChild(rule);
    }

    const row = document.createElement("div");
    row.className = `site-row site-row-${group.id === "common" ? "common" : "personal"}`;

    for (const { name, url } of items) {
      const a = document.createElement("a");
      a.className = "site-link";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = name;
      row.appendChild(a);
    }

    fragment.appendChild(row);
    rows += 1;
  }

  wrap.replaceChildren(fragment);
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.hidden = false;
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add("is-show"));
  toastTimer = setTimeout(() => {
    toast.classList.remove("is-show");
    setTimeout(() => {
      toast.hidden = true;
    }, 220);
  }, 1800);
}

async function copyEmail() {
  try {
    if (navigator.clipboard && isSecureContext) {
      await navigator.clipboard.writeText(EMAIL);
    } else {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast(`邮箱已复制：${EMAIL}`);
  } catch {
    showToast(`复制失败，请手动复制：${EMAIL}`);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function typewriter() {
  const el = $("tagline-text");
  const caret = $("caret");
  if (!el) return;

  if (reduceMotion) {
    el.textContent = TAGLINE;
    return;
  }

  el.textContent = "";
  caret?.classList.add("is-on");
  for (let i = 1; i <= TAGLINE.length; i += 1) {
    el.textContent = TAGLINE.slice(0, i);
    await sleep(TYPE_DELAY);
  }
  await sleep(TYPE_LOOP_PAUSE);
  caret?.classList.remove("is-on");
}

function runOpenSequence() {
  document.body.classList.add("is-preopen");

  if (reduceMotion) {
    document.body.classList.remove("is-preopen");
    document.body.classList.add("is-ready");
    $("sec-bio")?.classList.add("is-open");
    typewriter();
    return;
  }

  setTimeout(() => document.body.classList.add("is-ready"), OPEN_START);
  setTimeout(() => $("sec-bio")?.classList.add("is-open"), OPEN_BIO);
  setTimeout(typewriter, TYPE_START);
}

/** 背景：双层交叉淡入；远程优先，失败/超时用本地 */
function applyBackground(url) {
  const nextId = bgVisibleId === "bg-layer-a" ? "bg-layer-b" : "bg-layer-a";
  const next = $(nextId);
  const prev = $(bgVisibleId);
  if (!next) return;

  next.style.backgroundImage = `url("${url}")`;
  requestAnimationFrame(() => {
    next.classList.add("is-visible");
    prev?.classList.remove("is-visible");
    bgVisibleId = nextId;
  });
}

function loadBackground() {
  const loadId = (bgLoadId += 1);
  const key = bgMq.matches ? "mobile" : "desktop";
  const remote = BG_REMOTE[key];
  const local = BG_LOCAL[key];

  let settled = false;
  const apply = (url) => {
    if (loadId !== bgLoadId || settled) return;
    settled = true;
    applyBackground(url);
  };

  const timer = setTimeout(() => apply(local), BG_TIMEOUT);
  const img = new Image();
  img.onload = () => {
    clearTimeout(timer);
    apply(remote);
  };
  img.onerror = () => {
    clearTimeout(timer);
    apply(local);
  };
  img.src = remote;
}

function init() {
  $("year").textContent = String(new Date().getFullYear());
  renderSites();
  loadBackground();
  bgMq.addEventListener("change", loadBackground);

  $("btn-email")?.addEventListener("click", copyEmail);

  // 头像失败时清空为透明像素，只保留 CSS 空圈
  const avatar = $("avatar");
  avatar?.addEventListener("error", () => {
    if (avatar.dataset.failed) return;
    avatar.dataset.failed = "1";
    avatar.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  });

  runOpenSequence();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
