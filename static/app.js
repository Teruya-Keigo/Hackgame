(function () {
  const CELEBRATION_MS = 2200;
  const HACK_SETTINGS_KEY = "vending_glitch_hack_settings_v1";
  const HACK_STORE_KEY = "vending_glitch_store_v1";
  const HACK_SECRET_KEY = "vending_glitch_secret_map_v1";
  const HACK_PLAN_KEY = "vending_glitch_hack_plan_v1";
  const GAME_PROGRESS_KEY = "vending_glitch_game_progress_v2";
  const LEGACY_GAME_PROGRESS_KEY = "vending_glitch_game_progress_v1";
  const BUG_KEYS = ["double_refund", "queue_jump", "penny"];
  const FLOW_MODES = ["idle", "timing", "processing", "success", "fail"];
  const LOG_TONES = ["info", "hint", "success", "warn"];
  const INITIAL_POINTS = 1000;
  const HACK_COST = 100;
  const BUG_PAYOUT = Object.freeze({
    double_refund: 300,
    queue_jump: 400,
    penny: 500,
  });
  const TIMING_PAYOUT = Object.freeze({
    normal: 0,
    good: 100,
    critical: 200,
    side: 300,
    ultra: 500,
  });
  const DEFAULT_HACK_SETTINGS = Object.freeze({
    chapter1: { sweetLeft: 40, sweetWidth: 20 },
    chapter2: { sweetLeft: 68, sweetWidth: 14 },
    chapter3: { sweetLeft: 44, sweetWidth: 12 },
  });
  const DEFAULT_SECRET_BASE = Object.freeze({
    chapter1: { bonusCenter: 53.0, sideCenter: 34.0, phase: 40, mainSpan: 13.5 },
    chapter2: { bonusCenter: 74.0, sideCenter: 62.0, phase: 120, mainSpan: 11.5 },
    chapter3: { bonusCenter: 49.0, sideCenter: 37.0, phase: 220, mainSpan: 12.0 },
  });

  const el = {
    intro: document.getElementById("intro-overlay"),
    start: document.getElementById("start-btn"),
    celebration: document.getElementById("celebration"),
    celebrationDetail: document.getElementById("celebration-detail"),
    unlockOverlay: document.getElementById("unlock-overlay"),
    unlockMessage: document.getElementById("unlock-message"),
    unlockFeatures: document.getElementById("unlock-features"),
    unlockBugs: document.getElementById("unlock-bugs"),
    unlockClose: document.getElementById("unlock-close"),
    gameOverOverlay: document.getElementById("game-over-overlay"),
    gameOverSummary: document.getElementById("game-over-summary"),
    gameOverRestart: document.getElementById("game-over-restart"),
    topbar: document.getElementById("topbar"),
    storyPanel: document.getElementById("story-panel"),
    centerPanel: document.getElementById("center-panel"),
    resultPanel: document.getElementById("result-panel"),
    panelTour: document.getElementById("panel-tour"),
    panelTourCard: document.getElementById("panel-tour-card"),
    panelTourTitle: document.getElementById("panel-tour-title"),
    panelTourText: document.getElementById("panel-tour-text"),
    panelTourNext: document.getElementById("panel-tour-next"),
    panelTourSkip: document.getElementById("panel-tour-skip"),
    chapterPill: document.getElementById("chapter-pill"),
    scorePill: document.getElementById("score-pill"),
    bugsPill: document.getElementById("bugs-pill"),
    hackPill: document.getElementById("hack-pill"),
    objTitle: document.getElementById("obj-title"),
    objWhy: document.getElementById("obj-why"),
    objSteps: document.getElementById("obj-steps"),
    objReward: document.getElementById("obj-reward"),
    storyFeed: document.getElementById("story-feed"),
    consoleTitle: document.getElementById("console-title"),
    amount: document.getElementById("amount-input"),
    advancedControls: document.getElementById("advanced-controls"),
    advancedHelp: document.getElementById("advanced-help"),
    targetBug: document.getElementById("target-bug-select"),
    syncJitter: document.getElementById("sync-jitter-input"),
    gasGap: document.getElementById("gas-gap-input"),
    pennyCycles: document.getElementById("penny-cycles-input"),
    injectRace: document.getElementById("inject-race-btn"),
    primary: document.getElementById("primary-btn"),
    flowStatus: document.getElementById("flow-status"),
    flowStep1: document.getElementById("flow-step-1"),
    flowStep2: document.getElementById("flow-step-2"),
    flowStep3: document.getElementById("flow-step-3"),
    timingPane: document.getElementById("timing-pane"),
    timingTrack: document.getElementById("timing-track"),
    timingSweet: document.getElementById("timing-sweet"),
    timingCursor: document.getElementById("timing-cursor"),
    timingText: document.getElementById("timing-text"),
    resultStatus: document.getElementById("result-status"),
    resultTypes: document.getElementById("result-types"),
    resultPlain: document.getElementById("result-plain"),
    resultNext: document.getElementById("result-next"),
    visualHint: document.getElementById("visual-hint"),
    visualHintGrid: document.getElementById("visual-hint-grid"),
    foundItems: document.querySelectorAll(".found-item"),
    logStream: document.getElementById("log-stream"),
  };

  const chapters = {
    1: {
      title: "おつり二重取りを見つける",
      why: `まずは『同じ操作を重ねると返金が二重になる』現象を体験して、ルールの穴に慣れます。実行1回につき ${HACK_COST}pt 消費。`,
      steps: [
        "「100円入れる」を押す",
        "下のバーが出たら、白い線の中心を金色ゾーンに合わせて SPACE",
        "「正解！バグ発見！」が出たらChapter 2へ進む",
      ],
      reward: "報酬: おつり二重取りを初発見。成功時はポイントが大きく返還され、次章へ進みます。",
    },
    2: {
      title: "順番すり抜けを見つける",
      why: `本来は先着順のはずなのに、後から来た注文が先に通る穴を確認します。実行1回につき ${HACK_COST}pt 消費。`,
      steps: [
        "「割り込みテスト実行」を押す",
        "バーの右側に出る赤い『割り込みゾーン』で SPACE を押す",
        "右の実況ログで『順番が入れ替わった』表示を確認する",
        "「正解！バグ発見！」が出たらChapter 3へ進む",
      ],
      reward: "報酬: 順番すり抜けを発見。返還ポイントを得て、最後のチャレンジが解放されます。",
    },
    3: {
      title: "小銭ふくらみを見つける",
      why: `細かい数字の計算ズレを使って、少額が少しずつ増える現象を再現します。実行1回につき ${HACK_COST}pt 消費。`,
      steps: [
        "注文量を 1.0000000013 にする",
        "「小銭ループを準備」を押す",
        "「小銭ループを実行」を押し、目押しバーで SPACE を合わせる",
      ],
      reward: "報酬: 小銭ふくらみを発見でミッション完了。高返還で資金を増やせます。",
    },
  };

  const state = {
    hasStarted: false,
    chapter: 1,
    score: INITIAL_POINTS,
    discovered: new Set(),
    raceArmed: false,
    missionComplete: false,
    gameOver: false,
    unlockOpen: false,
    panelTourOpen: false,
    panelTourIndex: 0,
    timing: {
      active: false,
      mode: "",
      startMs: 0,
      durationMs: 2800,
      sweetMin: 0.46,
      sweetMax: 0.54,
    },
    hackSettings: null,
    secretMap: null,
    pendingTimingBoost: null,
    lastLogText: "",
    celebrationUntilMs: 0,
    storyHistory: [],
    logHistory: [],
    lastResult: null,
    lastFlow: null,
    restoringProgress: false,
  };

  let persistTimer = null;

  const panelTourSteps = [
    {
      key: "story",
      title: "これはストーリーガイドです",
      text: "困ったらここを見てください。今やること、やる理由、手順、報酬が常に表示されます。",
      getTarget: () => el.storyPanel,
    },
    {
      key: "center",
      title: "これはハック操作盤です",
      text: "実際にボタンを押す場所です。Chapterが進むと、触れる操作が少しずつ増えます。",
      getTarget: () => el.centerPanel,
    },
    {
      key: "result",
      title: "これは結果と意味です",
      text: "何が起きたかを難しい言葉なしで表示します。『今回の発見』と『次の一手』を確認してください。",
      getTarget: () => el.resultPanel,
    },
    {
      key: "top",
      title: "ここは進行メーターです",
      text: "Chapter、所持ポイント、発見バグ数が見えます。あなたが今どこまで進んだかの地図です。",
      getTarget: () => el.topbar,
    },
  ];

  function appendStoryLineToDom(msg) {
    const line = document.createElement("div");
    line.className = "story-line";
    line.textContent = msg;
    el.storyFeed.appendChild(line);
  }

  function appendStory(msg, options = {}) {
    const text = String(msg || "").trim();
    if (!text) return;
    appendStoryLineToDom(text);
    if (options.skipStore !== true) {
      state.storyHistory.push(text);
      while (state.storyHistory.length > 200) state.storyHistory.shift();
    }
    while (el.storyFeed.children.length > 200) {
      el.storyFeed.removeChild(el.storyFeed.firstChild);
    }
    el.storyFeed.scrollTop = el.storyFeed.scrollHeight;
    if (options.persist !== false) {
      queuePersistProgress();
    }
  }

  function setResult(status, types, plain, next, options = {}) {
    el.resultStatus.textContent = status;
    el.resultTypes.textContent = `今回の発見: ${types}`;
    el.resultPlain.textContent = `説明: ${plain}`;
    el.resultNext.textContent = `次の一手: ${next}`;
    state.lastResult = {
      status: String(status || ""),
      types: String(types || ""),
      plain: String(plain || ""),
      next: String(next || ""),
    };
    if (options.persist !== false) {
      queuePersistProgress();
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function cloneDefaultHackSettings() {
    return {
      chapter1: { ...DEFAULT_HACK_SETTINGS.chapter1 },
      chapter2: { ...DEFAULT_HACK_SETTINGS.chapter2 },
      chapter3: { ...DEFAULT_HACK_SETTINGS.chapter3 },
    };
  }

  function sanitizeHackSettings(raw) {
    const out = cloneDefaultHackSettings();
    if (!raw || typeof raw !== "object") return out;
    const keys = ["chapter1", "chapter2", "chapter3"];
    for (const key of keys) {
      const src = raw[key];
      if (!src || typeof src !== "object") continue;
      const leftRaw = Number(src.sweetLeft);
      const widthRaw = Number(src.sweetWidth);
      if (!Number.isFinite(leftRaw) || !Number.isFinite(widthRaw)) continue;
      const left = clamp(leftRaw, 0, 95);
      const width = clamp(widthRaw, 4, 95 - left);
      out[key] = { sweetLeft: left, sweetWidth: width };
    }
    return out;
  }

  function readHackSettings() {
    try {
      const raw = localStorage.getItem(HACK_SETTINGS_KEY);
      if (!raw) return cloneDefaultHackSettings();
      const parsed = JSON.parse(raw);
      return sanitizeHackSettings(parsed);
    } catch (err) {
      return cloneDefaultHackSettings();
    }
  }

  function formatHackPillText() {
    const s = state.hackSettings || cloneDefaultHackSettings();
    return `認証幅: C1 ${Math.round(s.chapter1.sweetWidth)}% / C2 ${Math.round(s.chapter2.sweetWidth)}% / C3 ${Math.round(s.chapter3.sweetWidth)}%`;
  }

  function refreshHackSettingsFromStorage({ notify = false } = {}) {
    const prev = state.hackSettings;
    const next = readHackSettings();
    state.hackSettings = next;
    if (el.hackPill) {
      el.hackPill.textContent = formatHackPillText();
    }
    if (state.timing.active && state.timing.mode) {
      configureTimingWindow(state.timing.mode);
    }
    if (!notify || !prev) return;
    const changed =
      prev.chapter1.sweetLeft !== next.chapter1.sweetLeft ||
      prev.chapter1.sweetWidth !== next.chapter1.sweetWidth ||
      prev.chapter2.sweetLeft !== next.chapter2.sweetLeft ||
      prev.chapter2.sweetWidth !== next.chapter2.sweetWidth ||
      prev.chapter3.sweetLeft !== next.chapter3.sweetLeft ||
      prev.chapter3.sweetWidth !== next.chapter3.sweetWidth;
    if (changed) {
      pushLogLine("更新: ハッキング拡張設定を読み込みました。認証幅が更新されました。", "hint");
      appendStory("ハッキング拡張設定を反映しました。目押しゾーンの幅が更新されています。");
    }
  }

  function cloneDefaultSecretMap() {
    return {
      chapter1: { ...DEFAULT_SECRET_BASE.chapter1 },
      chapter2: { ...DEFAULT_SECRET_BASE.chapter2 },
      chapter3: { ...DEFAULT_SECRET_BASE.chapter3 },
    };
  }

  function createSecretMap() {
    const out = cloneDefaultSecretMap();
    const keys = ["chapter1", "chapter2", "chapter3"];
    for (const key of keys) {
      out[key].bonusCenter = clamp(out[key].bonusCenter + (Math.random() * 6 - 3), 8, 92);
      out[key].sideCenter = clamp(out[key].sideCenter + (Math.random() * 10 - 5), 5, 95);
      out[key].phase = (out[key].phase + Math.random() * 240) % 360;
      out[key].mainSpan = clamp(out[key].mainSpan + (Math.random() * 3 - 1.5), 8.5, 18);
    }
    return out;
  }

  function sanitizeSecretMap(raw) {
    const out = cloneDefaultSecretMap();
    if (!raw || typeof raw !== "object") return out;
    const keys = ["chapter1", "chapter2", "chapter3"];
    for (const key of keys) {
      const src = raw[key];
      if (!src || typeof src !== "object") continue;
      const bonusCenter = Number(src.bonusCenter);
      const sideCenter = Number(src.sideCenter);
      const phase = Number(src.phase);
      const mainSpan = Number(src.mainSpan);
      if (Number.isFinite(bonusCenter)) out[key].bonusCenter = clamp(bonusCenter, 8, 92);
      if (Number.isFinite(sideCenter)) out[key].sideCenter = clamp(sideCenter, 5, 95);
      if (Number.isFinite(phase)) out[key].phase = clamp(phase, 0, 360);
      if (Number.isFinite(mainSpan)) out[key].mainSpan = clamp(mainSpan, 8.5, 18);
    }
    return out;
  }

  function readSecretMap() {
    try {
      const raw = localStorage.getItem(HACK_SECRET_KEY);
      if (!raw) {
        const made = createSecretMap();
        localStorage.setItem(HACK_SECRET_KEY, JSON.stringify(made));
        return made;
      }
      const parsed = JSON.parse(raw);
      const sanitized = sanitizeSecretMap(parsed);
      localStorage.setItem(HACK_SECRET_KEY, JSON.stringify(sanitized));
      return sanitized;
    } catch (err) {
      const made = createSecretMap();
      localStorage.setItem(HACK_SECRET_KEY, JSON.stringify(made));
      return made;
    }
  }

  function refreshSecretMapFromStorage() {
    state.secretMap = readSecretMap();
  }

  function normalizeLogTone(tone) {
    return LOG_TONES.includes(tone) ? tone : "info";
  }

  function normalizeFlowMode(mode) {
    return FLOW_MODES.includes(mode) ? mode : "idle";
  }

  function normalizeBugList(types) {
    if (!Array.isArray(types)) return [];
    return [...new Set(types.map((v) => String(v)).filter((v) => BUG_KEYS.includes(v)))];
  }

  function timingPayoutFromBonus(timingBonus) {
    if (!timingBonus || typeof timingBonus !== "object") return 0;
    const tier = String(timingBonus.tier || "normal");
    return Number(TIMING_PAYOUT[tier] || 0);
  }

  function calculateSuccessPayout(types, timingBonus) {
    const bugList = normalizeBugList(types);
    let bugPayout = 0;
    for (const bug of bugList) {
      bugPayout += Number(BUG_PAYOUT[bug] || 0);
    }
    const timingPayout = timingPayoutFromBonus(timingBonus);
    const total = bugPayout + timingPayout;
    return { bugPayout, timingPayout, total };
  }

  function openGameOverOverlay(reasonText) {
    if (!el.gameOverOverlay || !el.gameOverSummary) return;
    const msg =
      reasonText ||
      `所持ポイントが尽きました。必要コスト ${HACK_COST}pt / 現在 ${Math.floor(state.score)}pt。`;
    const found = `${state.discovered.size} / ${BUG_KEYS.length}`;
    el.gameOverSummary.textContent = `${msg} 発見バグ数: ${found}`;
    el.gameOverOverlay.classList.remove("hidden");
  }

  function closeGameOverOverlay() {
    if (!el.gameOverOverlay) return;
    el.gameOverOverlay.classList.add("hidden");
  }

  function triggerGameOver(reasonText) {
    if (state.gameOver) return true;
    state.gameOver = true;
    state.score = Math.max(0, Math.floor(state.score));
    state.raceArmed = false;
    clearPendingTimingBoost();
    endTiming();
    if (state.panelTourOpen) endPanelTour();
    if (state.unlockOpen) closeUnlockPopup();
    setResult(
      "ゲームオーバー",
      "-",
      `ハッキング資金が尽きました。1回${HACK_COST}pt必要です。`,
      "「最初からやり直す」で再スタート",
      { persist: false }
    );
    setFlowState("fail", "現在: ゲームオーバー。再スタートしてください。", { persist: false });
    pushLogLine(
      `GAME OVER: ${reasonText || `所持ポイント ${Math.floor(state.score)}pt。ハッキングを続けられません。`}`,
      "warn"
    );
    appendStory("所持ポイントがなくなりました。今回はここまでです。");
    openGameOverOverlay(reasonText);
    refreshUi();
    queuePersistProgress();
    return true;
  }

  function ensurePlayablePoints() {
    if (state.score >= HACK_COST) return true;
    const reason =
      state.score <= 0
        ? "所持ポイントが 0pt になったためゲームオーバーです。"
        : `実行コスト ${HACK_COST}pt に対して所持ポイントが不足しています（現在 ${Math.floor(state.score)}pt）。`;
    triggerGameOver(reason);
    return false;
  }

  function spendHackCostOrFail() {
    if (!ensurePlayablePoints()) return false;
    state.score = Math.max(0, Math.floor(state.score - HACK_COST));
    pushLogLine(`コスト投入: ${HACK_COST}pt 使用（残り ${Math.floor(state.score)}pt）`, "warn");
    appendStory(`ハッキング実行に ${HACK_COST}pt を投入しました。残り ${Math.floor(state.score)}pt。`);
    refreshUi();
    queuePersistProgress();
    return true;
  }

  function resetGameProgress() {
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }
    const keys = [GAME_PROGRESS_KEY, LEGACY_GAME_PROGRESS_KEY, HACK_SETTINGS_KEY, HACK_SECRET_KEY, HACK_PLAN_KEY, HACK_STORE_KEY];
    for (const key of keys) {
      try {
        localStorage.removeItem(key);
      } catch (_err) {
        // ignore
      }
    }
    window.location.href = "/";
  }

  function appendLogLineToDom(text, tone) {
    const row = document.createElement("div");
    row.className = `log-line ${tone}`;
    row.textContent = text;
    el.logStream.appendChild(row);
  }

  function renderStoryHistory() {
    if (!el.storyFeed) return;
    el.storyFeed.innerHTML = "";
    for (const msg of state.storyHistory) {
      appendStoryLineToDom(msg);
    }
    el.storyFeed.scrollTop = el.storyFeed.scrollHeight;
  }

  function renderLogHistory() {
    if (!el.logStream) return;
    el.logStream.innerHTML = "";
    for (const entry of state.logHistory) {
      appendLogLineToDom(entry.text, normalizeLogTone(entry.tone));
    }
    while (el.logStream.children.length > 1000) {
      el.logStream.removeChild(el.logStream.firstChild);
    }
    const last = state.logHistory[state.logHistory.length - 1];
    state.lastLogText = last ? `${normalizeLogTone(last.tone)}:${last.text}` : "";
    el.logStream.scrollTop = el.logStream.scrollHeight;
  }

  function buildProgressPayload() {
    const score = Number(state.score);
    const amountRaw = String(el.amount?.value ?? "1.0");
    const amountValue = Number.isFinite(Number(amountRaw)) ? amountRaw : "1.0";
    const targetBugRaw = String(el.targetBug?.value || "double_refund");
    const targetBug = BUG_KEYS.includes(targetBugRaw) ? targetBugRaw : "double_refund";
    const tuning = getTuningValues();
    const discovered = [...state.discovered].map((v) => String(v)).filter((v) => BUG_KEYS.includes(v));

    return {
      v: 1,
      hasStarted: Boolean(state.hasStarted),
      chapter: clamp(Math.round(Number(state.chapter || 1)), 1, 3),
      score: Number.isFinite(score) ? Math.max(0, Math.floor(score)) : INITIAL_POINTS,
      discovered,
      missionComplete: Boolean(state.missionComplete),
      gameOver: Boolean(state.gameOver),
      raceArmed: Boolean(state.raceArmed),
      amount: amountValue,
      targetBug,
      syncJitterMs: tuning.syncJitterMs,
      gasGap: tuning.gasGap,
      pennyCycles: tuning.pennyCycles,
      storyHistory: state.storyHistory.slice(-200),
      logHistory: state.logHistory.slice(-1000),
      resultSnapshot: state.lastResult
        ? {
            status: String(state.lastResult.status || ""),
            types: String(state.lastResult.types || ""),
            plain: String(state.lastResult.plain || ""),
            next: String(state.lastResult.next || ""),
          }
        : null,
      flowSnapshot: state.lastFlow
        ? {
            mode: normalizeFlowMode(String(state.lastFlow.mode || "idle")),
            text: String(state.lastFlow.text || ""),
          }
        : null,
    };
  }

  function persistProgressNow() {
    if (state.restoringProgress) return;
    try {
      localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(buildProgressPayload()));
    } catch (_err) {
      // Ignore quota/storage errors; game can continue without persistence.
    }
  }

  function queuePersistProgress() {
    if (state.restoringProgress) return;
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      persistTimer = null;
      persistProgressNow();
    }, 80);
  }

  function sanitizeProgress(raw) {
    if (!raw || typeof raw !== "object") return null;

    const chapterRaw = Number(raw.chapter);
    const chapter = Number.isFinite(chapterRaw) ? clamp(Math.round(chapterRaw), 1, 3) : 1;
    const scoreRaw = Number(raw.score);
    const score = Number.isFinite(scoreRaw) ? Math.max(0, Math.floor(scoreRaw)) : INITIAL_POINTS;
    const discovered = Array.isArray(raw.discovered)
      ? [...new Set(raw.discovered.map((v) => String(v)).filter((v) => BUG_KEYS.includes(v)))]
      : [];
    const missionComplete = Boolean(raw.missionComplete) || discovered.length >= BUG_KEYS.length;
    const gameOver = Boolean(raw.gameOver) || score <= 0;

    const amountRaw = String(raw.amount ?? "1.0");
    const amount = Number.isFinite(Number(amountRaw)) ? amountRaw : "1.0";
    const targetBugRaw = String(raw.targetBug || "double_refund");
    const targetBug = BUG_KEYS.includes(targetBugRaw) ? targetBugRaw : "double_refund";
    const syncJitterMs = clamp(Number(raw.syncJitterMs), 0, 5);
    const gasGap = clamp(Number(raw.gasGap), 1, 150);
    const pennyCycles = clamp(Number(raw.pennyCycles), 1, 8);

    const storyHistory = Array.isArray(raw.storyHistory)
      ? raw.storyHistory
          .map((v) => String(v || "").trim())
          .filter((v) => v.length > 0)
          .slice(-200)
      : [];

    const logHistory = Array.isArray(raw.logHistory)
      ? raw.logHistory
          .map((entry) => {
            if (!entry || typeof entry !== "object") return null;
            const text = String(entry.text || "").trim();
            if (!text) return null;
            return {
              text,
              tone: normalizeLogTone(String(entry.tone || "info")),
            };
          })
          .filter(Boolean)
          .slice(-1000)
      : [];

    const resultRaw = raw.resultSnapshot && typeof raw.resultSnapshot === "object" ? raw.resultSnapshot : null;
    const resultSnapshot = resultRaw
      ? {
          status: String(resultRaw.status || ""),
          types: String(resultRaw.types || "-"),
          plain: String(resultRaw.plain || ""),
          next: String(resultRaw.next || ""),
        }
      : null;

    const flowRaw = raw.flowSnapshot && typeof raw.flowSnapshot === "object" ? raw.flowSnapshot : null;
    const flowSnapshot = flowRaw
      ? {
          mode: normalizeFlowMode(String(flowRaw.mode || "idle")),
          text: String(flowRaw.text || ""),
        }
      : null;

    const hasStarted =
      Boolean(raw.hasStarted) ||
      chapter > 1 ||
      score !== INITIAL_POINTS ||
      missionComplete ||
      discovered.length > 0 ||
      storyHistory.length > 0 ||
      logHistory.length > 1;

    return {
      hasStarted,
      chapter,
      score,
      discovered,
      missionComplete,
      gameOver,
      raceArmed: Boolean(raw.raceArmed),
      amount,
      targetBug,
      syncJitterMs: Number.isFinite(syncJitterMs) ? syncJitterMs : 0,
      gasGap: Number.isFinite(gasGap) ? gasGap : 55,
      pennyCycles: Number.isFinite(pennyCycles) ? pennyCycles : 3,
      storyHistory,
      logHistory,
      resultSnapshot,
      flowSnapshot,
    };
  }

  function readProgress() {
    try {
      const raw = localStorage.getItem(GAME_PROGRESS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return sanitizeProgress(parsed);
    } catch (_err) {
      return null;
    }
  }

  function restoreProgressFromStorage() {
    const saved = readProgress();
    if (!saved) return false;

    state.restoringProgress = true;
    try {
      state.hasStarted = saved.hasStarted;
      state.chapter = saved.chapter;
      state.score = saved.score;
      state.discovered = new Set(saved.discovered);
      state.missionComplete = saved.missionComplete;
      state.gameOver = saved.gameOver;
      if (state.score < HACK_COST) state.gameOver = true;
      state.raceArmed = saved.raceArmed;
      state.storyHistory = saved.storyHistory;
      state.logHistory = saved.logHistory;
      state.lastResult = saved.resultSnapshot;
      state.lastFlow = saved.flowSnapshot;

      if (el.amount) el.amount.value = saved.amount;
      if (el.targetBug) el.targetBug.value = saved.targetBug;
      if (el.syncJitter) el.syncJitter.value = String(saved.syncJitterMs);
      if (el.gasGap) el.gasGap.value = String(saved.gasGap);
      if (el.pennyCycles) el.pennyCycles.value = String(saved.pennyCycles);

      renderStoryHistory();
      renderLogHistory();

      if ((state.hasStarted || state.gameOver) && el.intro) {
        el.intro.classList.add("hidden");
      }

      const fallbackResult = {
        status: "待機中",
        types: "-",
        plain: "まずは導入を読んでミッション開始を押してください。",
        next: "ミッション開始ボタンを押す",
      };
      const result = state.lastResult || fallbackResult;
      setResult(result.status, result.types, result.plain, result.next, { persist: false });

      const fallbackFlow = { mode: "idle", text: "現在: 待機中（ミッション開始を押してください）" };
      const flow = state.lastFlow || fallbackFlow;
      setFlowState(flow.mode, flow.text, { persist: false });
      if (state.gameOver) {
        openGameOverOverlay("所持ポイントが尽きたためゲームオーバーです。");
      } else {
        closeGameOverOverlay();
      }
      return true;
    } finally {
      state.restoringProgress = false;
    }
  }

  function valuePercent(value, min, max) {
    if (max <= min) return 0;
    return clamp(((value - min) / (max - min)) * 100, 0, 100);
  }

  function hideVisualHint() {
    if (!el.visualHint || !el.visualHintGrid) return;
    el.visualHint.classList.add("hidden");
    el.visualHintGrid.innerHTML = "";
  }

  function metricCardHtml({
    label,
    value,
    display,
    min,
    max,
    targetMin,
    targetMax,
    goodHint,
    adjustHint,
  }) {
    const v = valuePercent(value, min, max);
    const zMin = valuePercent(targetMin, min, max);
    const zMax = valuePercent(targetMax, min, max);
    const inRange = value >= targetMin && value <= targetMax;
    return `
      <div class="metric-card ${inRange ? "ok" : "ng"}">
        <div class="metric-head">
          <span class="metric-label">${label}</span>
          <span class="metric-value">${display}</span>
        </div>
        <div class="metric-track">
          <div class="metric-zone" style="left:${zMin}%; width:${Math.max(0.8, zMax - zMin)}%;"></div>
          <div class="metric-pointer" style="left:${v}%;"></div>
        </div>
        <div class="metric-tail">${inRange ? goodHint : adjustHint}</div>
      </div>
    `;
  }

  function timingCardHtml(mode, miss) {
    const safeMiss = miss || {};
    const sweetStart = clamp(Number(safeMiss.sweetStartPercent || 40), 0, 100);
    const sweetEnd = clamp(Number(safeMiss.sweetEndPercent || 60), 0, 100);
    const cursor = clamp(Number(safeMiss.cursorPercent || 0), 0, 100);
    const gapText = safeMiss.inside ? "受付ゾーン内" : `受付まで ${Number(safeMiss.gapPercent || 0).toFixed(1)}%`;
    const guide =
      mode === "chapter2"
        ? "白線を右の赤ゾーンへ寄せると成功。"
        : "白線を中央の金ゾーンへ重ねると成功。";
    return `
      <div class="metric-card ${safeMiss.inside ? "ok" : "ng"}">
        <div class="metric-head">
          <span class="metric-label">目押し位置</span>
          <span class="metric-value">${gapText}</span>
        </div>
        <div class="metric-track">
          <div class="metric-zone" style="left:${sweetStart}%; width:${Math.max(0.8, sweetEnd - sweetStart)}%;"></div>
          <div class="metric-pointer" style="left:${cursor}%;"></div>
        </div>
        <div class="metric-tail">${guide}</div>
      </div>
    `;
  }

  function conditionCardHtml(title, reason, conditions = []) {
    const rows = conditions
      .map(
        (c) => `
      <div class="condition-row ${c.ok ? "ok" : "ng"}">
        <span class="condition-dot"></span>
        <span>${c.label}</span>
      </div>
    `
      )
      .join("");
    return `
      <div class="condition-card">
        <div class="condition-title">${title}</div>
        <div class="condition-reason">${reason}</div>
        <div class="condition-list">${rows}</div>
      </div>
    `;
  }

  function analyzeMiss(context, result) {
    const logs = Array.isArray(result?.log_tail) ? result.log_tail.map((v) => String(v)) : [];
    const tuning = getTuningValues();
    const amount = Number(el.amount.value || 0);

    if (context === "chapter1") {
      const cancelDone = logs.filter((l) => l.includes("[cancel] done")).length;
      const cancelSkipped = logs.filter((l) => l.includes("[cancel] skipped")).length;
      const refundBug = logs.some((l) => l.toLowerCase().includes("refund-bug"));
      const syncOk = tuning.syncJitterMs === 0;
      const cancelTwiceOk = cancelDone >= 2;
      const reason = !syncOk
        ? "2回のキャンセルが同時にならず、二重返金の窓が開きませんでした。"
        : cancelSkipped > 0
          ? "0msでも2回目のキャンセルが遅れて扱われ、片方だけ返金になりました。"
          : !cancelTwiceOk
            ? "キャンセル処理が1回分しか通らず、二重返金まで届きませんでした。"
            : "返金は走りましたが、二重取り条件まで届かず通常処理で終了しました。";
      return {
        title: "おつり二重取り: 判定内訳",
        reason,
        plain: `未検出の理由: ${reason}`,
        next: "赤の項目を緑に揃えて再実行。0ms＋中央金ゾーンSPACE成功で検出確定",
        conditions: [
          { label: `同時性ズレ 0ms（現在 ${tuning.syncJitterMs}ms）`, ok: syncOk },
          { label: `キャンセル2回成立（現在 ${cancelDone}回）`, ok: cancelTwiceOk },
          { label: "二重返金フラグ成立", ok: refundBug },
        ],
      };
    }

    if (context === "chapter2") {
      const queueJump = logs.some((l) => l.toLowerCase().includes("queue-jump-bug"));
      const syncOk = tuning.syncJitterMs === 0;
      const gasOk = tuning.gasGap >= 25;
      const reason = !syncOk
        ? "同時性ズレがあり、割り込み成立の窓が開きませんでした。"
        : !gasOk
          ? "優先度差（ガス差）が足りず、後ろの注文が前に出られませんでした。"
          : "条件は近いですが、今回は割り込み成立の瞬間を外しました。";
      return {
        title: "順番すり抜け: 判定内訳",
        reason,
        plain: `未検出の理由: ${reason}`,
        next: "赤の項目を緑にして再実行。0ms＋ガス差25以上＋右赤ゾーンSPACE成功で検出確定",
        conditions: [
          { label: `同時性ズレ 0ms（現在 ${tuning.syncJitterMs}ms）`, ok: syncOk },
          { label: `ガス差 25以上（現在 ${tuning.gasGap}）`, ok: gasOk },
          { label: "順番すり抜け成立", ok: queueJump },
        ],
      };
    }

    if (context === "chapter3") {
      const pennyBug = logs.some((l) => l.toLowerCase().includes("penny-bug"));
      const amountDiff = Math.abs(amount - 1.0000000013);
      const amountOk = amountDiff <= 1e-12;
      const cyclesOk = getTuningValues().pennyCycles >= 3;
      const reason = !amountOk
        ? "数量が鍵値から外れ、計算ズレの増幅が始まりませんでした。"
        : !cyclesOk
          ? "ループ回数が少なく、増幅が十分に積み上がりませんでした。"
          : "条件は近いですが、今回はズレ増幅が検出閾値に届きませんでした。";
      return {
        title: "小銭ふくらみ: 判定内訳",
        reason,
        plain: `未検出の理由: ${reason}`,
        next: "赤の項目を緑にして再実行。数量一致＋3回以上＋中央金ゾーンSPACE成功で検出確定",
        conditions: [
          { label: `数量一致（差分 ${amountDiff.toExponential(2)}）`, ok: amountOk },
          { label: `ループ回数 3以上（現在 ${getTuningValues().pennyCycles}回）`, ok: cyclesOk },
          { label: "小銭増幅フラグ成立", ok: pennyBug },
        ],
      };
    }

    return {
      title: "判定内訳",
      reason: "条件の一部が不足しています。",
      plain: "未検出の理由: 条件の一部が不足しています。",
      next: "視覚ヒントの赤項目を緑に揃えて再挑戦",
      conditions: [],
    };
  }

  function renderVisualMiss(mode, options = {}) {
    if (!el.visualHint || !el.visualHintGrid) return;
    const tuning = getTuningValues();
    const amount = Number(el.amount.value || 0);
    const diff = Math.abs(amount - 1.0000000013);
    const cards = [];
    const diag = options.diagnostics || null;

    if (diag && (diag.reason || (Array.isArray(diag.conditions) && diag.conditions.length))) {
      cards.push(conditionCardHtml(diag.title || "判定内訳", diag.reason || "", diag.conditions || []));
    }

    if (options.timingMiss) {
      cards.push(timingCardHtml(mode, options.timingMiss));
    }

    if (mode === "chapter1") {
      cards.push(
        metricCardHtml({
          label: "同時性ズレ",
          value: tuning.syncJitterMs,
          display: `${tuning.syncJitterMs} ms`,
          min: 0,
          max: 5,
          targetMin: 0,
          targetMax: 0.5,
          goodHint: "理想ゾーン内。次は目押しを合わせる。",
          adjustHint: "左の緑ゾーン（0ms付近）へ寄せると二重取りが出やすい。",
        })
      );
    } else if (mode === "chapter2") {
      cards.push(
        metricCardHtml({
          label: "同時性ズレ",
          value: tuning.syncJitterMs,
          display: `${tuning.syncJitterMs} ms`,
          min: 0,
          max: 5,
          targetMin: 0,
          targetMax: 0.5,
          goodHint: "同時押し条件はほぼ達成。",
          adjustHint: "左の緑ゾーン（0ms付近）へ寄せると割り込みが開きやすい。",
        }),
        metricCardHtml({
          label: "ガス差",
          value: tuning.gasGap,
          display: `${tuning.gasGap}`,
          min: 1,
          max: 150,
          targetMin: 25,
          targetMax: 150,
          goodHint: "優先度差は十分。次は右赤ゾーンで目押し。",
          adjustHint: "緑ゾーン（25以上）まで上げると順番すり抜けが出やすい。",
        })
      );
    } else {
      cards.push(
        metricCardHtml({
          label: "数量のズレ",
          value: diff,
          display: diff.toExponential(2),
          min: 0,
          max: 5e-8,
          targetMin: 0,
          targetMax: 1e-9,
          goodHint: "数量条件は達成。次はループと目押し調整。",
          adjustHint: "左の緑ゾーンへ寄せるため、数量を 1.0000000013 に近づける。",
        }),
        metricCardHtml({
          label: "ループ回数",
          value: tuning.pennyCycles,
          display: `${tuning.pennyCycles} 回`,
          min: 1,
          max: 8,
          targetMin: 3,
          targetMax: 8,
          goodHint: "増幅条件は十分。中央金ゾーン目押しへ。",
          adjustHint: "緑ゾーン（3回以上）にすると小銭増幅の再現が安定します。",
        })
      );
    }

    el.visualHintGrid.innerHTML = cards.join("");
    el.visualHint.classList.remove("hidden");
  }

  function prettyBugName(key) {
    if (key === "double_refund") return "おつり二重取り";
    if (key === "queue_jump") return "順番すり抜け";
    if (key === "penny") return "小銭ふくらみ";
    return key;
  }

  function plainBugExplanation(key) {
    if (key === "double_refund") return "同じキャンセルが重なり、おつりが2回返ってくる現象です。";
    if (key === "queue_jump") return "後から来た注文が先に処理され、順番を抜かす現象です。";
    if (key === "penny") return "細かい小数の計算ズレで、小銭がじわじわ増える現象です。";
    return "想定外の挙動です。";
  }

  function bugTypesFromResult(result) {
    const out = [];
    const bugs = result && result.bugs ? result.bugs : {};
    if ((bugs.double_refund || 0) > 0) out.push("double_refund");
    if ((bugs.queue_jump || 0) > 0) out.push("queue_jump");
    if ((bugs.penny || 0) > 0) out.push("penny");
    return out;
  }

  function updateFoundBadges() {
    el.foundItems.forEach((item) => {
      const bug = item.getAttribute("data-bug");
      item.classList.toggle("active", state.discovered.has(bug));
    });
  }

  function showCelebration(text) {
    el.celebrationDetail.textContent = text;
    el.celebration.classList.remove("hidden");
    state.celebrationUntilMs = Date.now() + CELEBRATION_MS;
    setTimeout(() => {
      el.celebration.classList.add("hidden");
    }, CELEBRATION_MS);
  }

  function showUnlockAfterCelebration(message, features, bugs) {
    const waitMs = Math.max(0, state.celebrationUntilMs - Date.now() + 80);
    setTimeout(() => {
      showUnlockPopup(message, features, bugs);
    }, waitMs);
  }

  function showUnlockPopup(message, features, bugs) {
    state.unlockOpen = true;
    el.unlockMessage.textContent = message;
    el.unlockFeatures.innerHTML = features.map((f) => `<li>${f}</li>`).join("");
    el.unlockBugs.innerHTML = bugs.map((b) => `<li>${b}</li>`).join("");
    el.unlockOverlay.classList.remove("hidden");
  }

  function closeUnlockPopup() {
    state.unlockOpen = false;
    el.unlockOverlay.classList.add("hidden");
  }

  function clearTourHighlight() {
    [el.topbar, el.storyPanel, el.centerPanel, el.resultPanel].forEach((node) => {
      if (node) node.classList.remove("tour-highlight");
    });
  }

  function placePanelTourCard(target) {
    const card = el.panelTourCard;
    if (!card) return;

    // Reset to default so size is measured correctly after text changes.
    card.style.left = "50%";
    card.style.top = "";
    card.style.bottom = "14px";
    card.style.transform = "translateX(-50%)";

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 14;
    const gap = 14;
    const t = target.getBoundingClientRect();
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const y = clamp(t.top, pad, vh - ch - pad);

    // Rule requested by user:
    // 1) show on the right side of highlighted panel
    // 2) if target is near right edge and card doesn't fit, show on the left side
    const rightX = t.right + gap;
    const rightFits = rightX + cw <= vw - pad;
    let x = rightFits ? rightX : t.left - cw - gap;

    // Final safety clamp for very narrow screens.
    x = clamp(x, pad, vw - cw - pad);

    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.style.bottom = "auto";
    card.style.transform = "none";
  }

  function showPanelTourStep() {
    const step = panelTourSteps[state.panelTourIndex];
    if (!step) return;
    clearTourHighlight();
    const target = step.getTarget();
    if (target) {
      target.classList.add("tour-highlight");
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    el.panelTourTitle.textContent = step.title;
    el.panelTourText.textContent = step.text;
    const last = state.panelTourIndex === panelTourSteps.length - 1;
    el.panelTourNext.textContent = last ? "スタートする" : "次へ";
    if (target) {
      // Defer placement to ensure card size reflects updated text.
      requestAnimationFrame(() => placePanelTourCard(target));
    }
  }

  function startPanelTour() {
    state.panelTourOpen = true;
    state.panelTourIndex = 0;
    document.body.classList.add("tour-on");
    el.panelTour.classList.remove("hidden");
    showPanelTourStep();
  }

  function endPanelTour() {
    state.panelTourOpen = false;
    document.body.classList.remove("tour-on");
    clearTourHighlight();
    el.panelTour.classList.add("hidden");
    appendStory("画面案内が終わりました。次はストーリーガイドの手順どおりに進めてください。");
  }

  function updateStats() {
    if (state.gameOver) {
      el.chapterPill.textContent = "GAME OVER";
    } else {
      el.chapterPill.textContent = state.missionComplete ? "Mission Complete" : `Chapter ${state.chapter} / 3`;
    }
    el.scorePill.textContent = `所持ポイント: ${Math.floor(state.score)}pt`;
    el.bugsPill.textContent = `発見: ${state.discovered.size} / 3`;
    if (el.hackPill) {
      el.hackPill.textContent = formatHackPillText();
    }
  }

  function renderObjective() {
    if (state.gameOver) {
      el.objTitle.textContent = "ゲームオーバー";
      el.objWhy.textContent = `手持ちポイントが尽きました。1回のハッキングには ${HACK_COST}pt が必要です。`;
      el.objSteps.innerHTML = [
        "<li>右上の履歴は保存済みです（結果確認のみ可能）</li>",
        "<li>「最初からやり直す」ボタンで初期状態へ戻る</li>",
        "<li>再スタート後は、成功時の大きな返還を狙って資金を増やす</li>",
      ].join("");
      el.objReward.textContent = "報酬: 再スタートで初期ポイント 1000pt から再挑戦できます。";
      return;
    }

    if (state.missionComplete) {
      el.objTitle.textContent = "全ミッションクリア";
      el.objWhy.textContent =
        `ここからは自由検証モードです。1回の実行ごとに ${HACK_COST}pt を使い、成功時は大きな返還を狙います。`;
      el.objSteps.innerHTML = [
        "<li>狙うバグを選ぶ（おつり二重取り / 順番すり抜け / 小銭ふくらみ）</li>",
        "<li>条件を調整する（同時性ズレ / ガス差 / ループ回数 / 注文量）</li>",
        "<li>実行してSPACEを合わせる（Chapter2は右赤、他は中央金）</li>",
        `<li>失敗したら${HACK_COST}pt没収。『何%ズレたか』を見て調整して再挑戦</li>`,
        "<li>さらに上を狙うなら、右上の『ハッキング拡張システムへ』でsweet spot自動探索と認証幅編集</li>",
      ].join("");
      el.objReward.textContent = "報酬: 成功時は大幅返還でポイントを増やし、連戦できます。";
      return;
    }

    const c = chapters[state.chapter];
    el.objTitle.textContent = c.title;
    el.objWhy.textContent = c.why;
    el.objSteps.innerHTML = c.steps.map((s) => `<li>${s}</li>`).join("");
    el.objReward.textContent = c.reward;
  }

  function getReplayModeFromTarget() {
    const target = el.targetBug ? el.targetBug.value : "penny";
    if (target === "double_refund") return "chapter1";
    if (target === "queue_jump") return "chapter2";
    return "chapter3";
  }

  function getActiveMode() {
    if (state.missionComplete) return getReplayModeFromTarget();
    return `chapter${state.chapter}`;
  }

  function getTuningValues() {
    return {
      syncJitterMs: Math.max(0, Math.min(5, Number(el.syncJitter?.value || 0))),
      gasGap: Math.max(1, Math.min(150, Number(el.gasGap?.value || 55))),
      pennyCycles: Math.max(1, Math.min(8, Number(el.pennyCycles?.value || 3))),
    };
  }

  function setControlLocks() {
    if (state.gameOver) {
      if (el.advancedControls) {
        el.advancedControls.style.display = "none";
      }
      if (el.advancedHelp) {
        el.advancedHelp.style.display = "none";
        el.advancedHelp.innerHTML = "";
      }
      if (el.targetBug) el.targetBug.disabled = true;
      if (el.syncJitter) el.syncJitter.disabled = true;
      if (el.gasGap) el.gasGap.disabled = true;
      if (el.pennyCycles) el.pennyCycles.disabled = true;
      if (el.amount) el.amount.disabled = true;
      if (el.injectRace) el.injectRace.disabled = true;
      if (el.primary) el.primary.disabled = true;
      el.consoleTitle.textContent = "ハック操作盤（GAME OVER）";
      if (el.primary) el.primary.textContent = "ポイント不足";
      return;
    }

    const ch = state.chapter;
    if (state.missionComplete) {
      if (el.advancedControls) el.advancedControls.style.display = "grid";
      if (el.advancedHelp) el.advancedHelp.style.display = "block";
      if (el.targetBug) el.targetBug.disabled = false;
      if (el.syncJitter) el.syncJitter.disabled = false;
      if (el.gasGap) el.gasGap.disabled = false;
      if (el.pennyCycles) el.pennyCycles.disabled = false;

      const mode = getReplayModeFromTarget();
      el.amount.disabled = mode !== "chapter3";
      el.injectRace.disabled = mode !== "chapter3";

      if (mode === "chapter1") {
        el.consoleTitle.textContent = "自由検証モード（おつり二重取り）";
        el.primary.textContent = "二重取りを仕掛ける";
      } else if (mode === "chapter2") {
        el.consoleTitle.textContent = "自由検証モード（順番すり抜け）";
        el.primary.textContent = "割り込みを仕掛ける";
      } else {
        el.consoleTitle.textContent = "自由検証モード（小銭ふくらみ）";
        el.primary.textContent = "小銭ループを実行";
      }
      el.injectRace.textContent = "小銭ループを準備";
      return;
    }

    if (el.advancedControls) el.advancedControls.style.display = "none";
    if (el.advancedHelp) {
      el.advancedHelp.style.display = "none";
      el.advancedHelp.innerHTML = "";
    }
    if (el.targetBug) el.targetBug.disabled = true;
    if (el.syncJitter) el.syncJitter.disabled = true;
    if (el.gasGap) el.gasGap.disabled = true;
    if (el.pennyCycles) el.pennyCycles.disabled = true;

    el.amount.disabled = ch !== 3;
    el.injectRace.disabled = ch < 3;

    if (ch === 1) {
      el.consoleTitle.textContent = "ハック操作盤（おつり二重取り）";
      el.primary.textContent = "100円入れる";
    } else if (ch === 2) {
      el.consoleTitle.textContent = "ハック操作盤（順番すり抜け）";
      el.primary.textContent = "割り込みテスト実行";
    } else {
      el.consoleTitle.textContent = "ハック操作盤（小銭ふくらみ）";
      el.primary.textContent = "小銭ループを実行";
    }
    el.injectRace.textContent = "小銭ループを準備";
  }

  function refreshUi() {
    updateStats();
    renderObjective();
    setControlLocks();
    updateFoundBadges();
    if (state.missionComplete && !state.gameOver) {
      renderFreeplayPreview();
      renderAdvancedHelp();
    }
  }

  function renderAdvancedHelp() {
    if (!el.advancedHelp || !state.missionComplete) return;
    const mode = getReplayModeFromTarget();
    const tuning = getTuningValues();
    const amount = Number(el.amount.value || 0);
    const diff = Math.abs(amount - 1.0000000013);

    let modeTitle = "";
    let modeGuide = "";

    if (mode === "chapter1") {
      modeTitle = "おつり二重取りの狙い方";
      modeGuide =
        `「同時性ズレ」は 0ms が推奨です。現在は ${tuning.syncJitterMs}ms。` +
        "0ms かつ中央金ゾーンでSPACE成功なら、二重取り検出は確定です。さらに押す位置次第で配当ボーナスが乗ります。";
    } else if (mode === "chapter2") {
      modeTitle = "順番すり抜けの狙い方";
      modeGuide =
        `同時性ズレ 0ms ＋ ガス差 25以上 が確定条件です（現在: ${tuning.syncJitterMs}ms / ${tuning.gasGap}）。` +
        "この条件で実行し、右の赤ゾーンでSPACE成功なら順番すり抜け検出は確定です。さらに高配当スポットがあります。";
    } else {
      modeTitle = "小銭ふくらみの狙い方";
      modeGuide =
        `注文量 1.0000000013 一致 ＋ ループ3回以上 が確定条件です（現在差分: ${diff.toExponential(2)} / ${tuning.pennyCycles}回）。` +
        "この条件で準備→実行し、中央金ゾーンでSPACE成功なら小銭ふくらみ検出は確定です。位置ボーナスでさらに伸ばせます。";
    }

    el.advancedHelp.innerHTML = `
      <strong>パラメータの意味</strong><br>
      同時性ズレ(ms): 2つの操作の時間差。0msに近いほど同時です。<br>
      ガス差: 後から来た注文に与える優先度差。大きいほど割り込みしやすくなります。<br>
      ループ回数: 同じ交換を繰り返す回数。多いほど小さなズレを増幅しやすくなります。<br><br>
      <strong>ポイントルール</strong><br>
      1回実行ごとに ${HACK_COST}pt 消費。成功時は 300〜500pt + 目押しボーナスで返還。失敗時は没収。<br><br>
      <strong>目押し位置ボーナス</strong><br>
      GOOD x1.25 / CRITICAL x1.60 / SIDE BREAK x1.85 / ULTRA x2.25（隠しスポット）<br><br>
      <strong>${modeTitle}</strong><br>
      ${modeGuide}
    `;
  }

  function setFlowState(mode, statusText, options = {}) {
    const resolvedMode = normalizeFlowMode(mode);
    const steps = [el.flowStep1, el.flowStep2, el.flowStep3].filter(Boolean);
    for (const step of steps) {
      step.classList.remove("active", "done", "error");
    }

    if (resolvedMode === "idle") {
      if (el.flowStep1) el.flowStep1.classList.add("active");
    } else if (resolvedMode === "timing") {
      if (el.flowStep1) el.flowStep1.classList.add("done");
      if (el.flowStep2) el.flowStep2.classList.add("active");
    } else if (resolvedMode === "processing") {
      if (el.flowStep1) el.flowStep1.classList.add("done");
      if (el.flowStep2) el.flowStep2.classList.add("done");
      if (el.flowStep3) el.flowStep3.classList.add("active");
    } else if (resolvedMode === "success") {
      if (el.flowStep1) el.flowStep1.classList.add("done");
      if (el.flowStep2) el.flowStep2.classList.add("done");
      if (el.flowStep3) el.flowStep3.classList.add("active");
    } else if (resolvedMode === "fail") {
      if (el.flowStep1) el.flowStep1.classList.add("done");
      if (el.flowStep2) el.flowStep2.classList.add("done");
      if (el.flowStep3) el.flowStep3.classList.add("error");
    }

    if (el.flowStatus && statusText) {
      el.flowStatus.textContent = statusText;
    }
    state.lastFlow = {
      mode: resolvedMode,
      text: String(statusText || el.flowStatus?.textContent || ""),
    };
    if (options.persist !== false) {
      queuePersistProgress();
    }
  }

  function pushLogLine(text, tone = "info", options = {}) {
    const safeTone = normalizeLogTone(tone);
    const safeText = String(text || "");
    const key = `${safeTone}:${safeText}`;
    if (key === state.lastLogText) return;
    state.lastLogText = key;

    appendLogLineToDom(safeText, safeTone);
    if (options.skipStore !== true) {
      state.logHistory.push({ text: safeText, tone: safeTone });
      while (state.logHistory.length > 1000) state.logHistory.shift();
    }

    while (el.logStream.children.length > 1000) {
      el.logStream.removeChild(el.logStream.firstChild);
    }
    el.logStream.scrollTop = el.logStream.scrollHeight;
    if (options.persist !== false) {
      queuePersistProgress();
    }
  }

  function addLogLines(lines) {
    if (!Array.isArray(lines) || lines.length === 0) return;

    const explain = (line) => {
      const raw = String(line || "");
      const low = raw.toLowerCase();

      if (/penny|rounding|epsilon|bonus=1e-10|tiny/.test(low)) {
        return {
          tone: "success",
          text: "当たりの気配: 小銭が増える計算ズレが出ています。",
        };
      }
      if (/refund-bug|double refund|reserved_negative/.test(low)) {
        return {
          tone: "success",
          text: "当たり発生: おつりが二重に返ってきました。",
        };
      }
      if (/queue-jump|bypass/.test(low)) {
        return {
          tone: "success",
          text: "当たり発生: 注文の順番が入れ替わり、割り込みが起きました。",
        };
      }
      if (/overflow|nan|inf/.test(low)) {
        return {
          tone: "warn",
          text: "注意: 数字が大きすぎて、計算が壊れかけています。",
        };
      }
      if (/cancel/.test(low)) {
        return { tone: "hint", text: "進行: キャンセル処理が流れています。" };
      }
      if (/risk|check/.test(low)) {
        return { tone: "hint", text: "進行: 安全チェックをしています。" };
      }
      if (/batch|dispatch|market|limit|order|user-player/.test(low)) {
        return { tone: "info", text: "進行: 自販機の内部処理が進んでいます。" };
      }
      if (/error|fail|reject/.test(low)) {
        return { tone: "warn", text: "注意: 処理がうまく通っていません。条件を見直してください。" };
      }

      return { tone: "info", text: "進行: 内部でチェックを続けています。" };
    };

    for (const line of lines) {
      const entry = explain(line);
      pushLogLine(entry.text, entry.tone);
    }
  }

  function buildDoubleRefundProbe(options = {}) {
    const syncJitterMs = Math.max(0, Number(options.syncJitterMs || 0));
    const t = Date.now();
    return [
      {
        order_id: `dr_buy_${t}`,
        user_id: "player",
        kind: "limit",
        side: "buy",
        pair: "A/B",
        amount: 8,
        price: 1.2,
        timestamp: t,
        nonce: 1,
        gas_price: 80,
      },
      {
        order_id: `dr_cancel_1_${t}`,
        user_id: "player",
        kind: "cancel",
        side: "buy",
        pair: "A/B",
        amount: 0,
        price: 1.0,
        target_order_id: `dr_buy_${t}`,
        timestamp: t + 1,
        nonce: 2,
        gas_price: 79,
      },
      {
        order_id: `dr_cancel_2_${t}`,
        user_id: "player",
        kind: "cancel",
        side: "buy",
        pair: "A/B",
        amount: 0,
        price: 1.0,
        target_order_id: `dr_buy_${t}`,
        timestamp: t + 1 + syncJitterMs,
        nonce: 3,
        gas_price: 78,
      },
    ];
  }

  function buildQueueJumpProbe(options = {}) {
    const syncJitterMs = Math.max(0, Number(options.syncJitterMs || 0));
    const gasGap = Math.max(1, Number(options.gasGap || 55));
    const t = Date.now();
    const buyOldGas = 40;
    return [
      {
        order_id: `qj_buy_old_${t}`,
        user_id: "player",
        kind: "limit",
        side: "buy",
        pair: "A/B",
        amount: 12,
        price: 1.2,
        timestamp: t,
        nonce: 1,
        gas_price: buyOldGas,
      },
      {
        order_id: `qj_buy_new_${t}`,
        user_id: "player",
        kind: "limit",
        side: "buy",
        pair: "A/B",
        amount: 12,
        price: 1.2,
        timestamp: t + syncJitterMs,
        nonce: 2,
        gas_price: buyOldGas + gasGap,
      },
      {
        order_id: `qj_sell_${t}`,
        user_id: "maker",
        kind: "limit",
        side: "sell",
        pair: "A/B",
        amount: 12,
        price: 1.1,
        timestamp: t,
        nonce: 3,
        gas_price: 70,
      },
    ];
  }

  function buildPennyCycle(amount, options = {}) {
    const cycles = Math.max(1, Number(options.cycles || 1));
    const t = Date.now();
    const out = [];
    let nonce = 1;
    for (let c = 0; c < cycles; c += 1) {
      const baseTs = t + c * 3;
      out.push(
        {
          order_id: `pc1_${t}_${c}`,
          user_id: "player",
          kind: "market",
          side: "sell",
          pair: "A/B",
          amount,
          price: 1.0,
          timestamp: baseTs,
          nonce: nonce++,
          gas_price: 61,
        },
        {
          order_id: `pc2_${t}_${c}`,
          user_id: "player",
          kind: "market",
          side: "sell",
          pair: "B/C",
          amount,
          price: 1.0,
          timestamp: baseTs + 1,
          nonce: nonce++,
          gas_price: 61,
        },
        {
          order_id: `pc3_${t}_${c}`,
          user_id: "player",
          kind: "market",
          side: "sell",
          pair: "C/A",
          amount,
          price: 1.0,
          timestamp: baseTs + 2,
          nonce: nonce++,
          gas_price: 61,
        }
      );
    }
    return out;
  }

  async function runEngine(payload) {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "execution failed");
    return data;
  }

  function configureTimingWindow(mode) {
    if (!el.timingSweet) return;
    // Keep judgement exactly aligned to what the user sees.
    el.timingSweet.style.background = "rgba(255, 229, 138, 0.55)";
    const settings = state.hackSettings || cloneDefaultHackSettings();
    const resolvedMode = mode === "chapter1" || mode === "chapter2" || mode === "chapter3" ? mode : "chapter1";
    const windowCfg = settings[resolvedMode] || DEFAULT_HACK_SETTINGS[resolvedMode];
    const sweetLeft = clamp(Number(windowCfg.sweetLeft), 0, 95);
    const sweetWidth = clamp(Number(windowCfg.sweetWidth), 4, 95 - sweetLeft);
    el.timingSweet.style.left = `${sweetLeft}%`;
    el.timingSweet.style.width = `${sweetWidth}%`;
    if (resolvedMode === "chapter2") {
      el.timingSweet.style.background = "rgba(255, 127, 127, 0.68)";
    }
    state.timing.sweetMin = sweetLeft / 100;
    state.timing.sweetMax = (sweetLeft + sweetWidth) / 100;
  }

  function beginTiming(mode) {
    hideVisualHint();
    state.timing.active = true;
    state.timing.mode = mode;
    state.timing.startMs = performance.now();
    el.timingPane.classList.remove("hidden");
    configureTimingWindow(mode);
    if (mode === "chapter2") {
      el.timingText.textContent =
        "白い線の中心が右側の赤い割り込みゾーンに入った瞬間に SPACE（中心付近ほど高配当）。";
      setFlowState("timing", "現在: ステップ2（割り込み待ち）。右の赤ゾーンでSPACEを押します。");
      pushLogLine("進行: 割り込み受付中。白い線が赤ゾーンに入った瞬間にSPACE。", "hint");
    } else {
      el.timingText.textContent =
        "白いカーソルの中心が金色ゾーンに重なった瞬間に SPACE。中心/隠しスポットは高配当。";
      setFlowState("timing", "現在: ステップ2（条件合わせ）。白い線を金色ゾーンに重ねてSPACEを押します。");
      pushLogLine("進行: タイミング判定を開始しました。中央でSPACEを押してください。", "hint");
    }
    setResult(
      "タイミングチャレンジ中",
      "-",
      mode === "chapter2"
        ? "この段階ではまだ結果確定していません。割り込みゾーンでSPACEを押してください。"
        : "この段階ではまだ結果確定していません。",
      mode === "chapter2"
        ? "右の赤ゾーンでSPACE。失敗しても何度でも再挑戦できます。"
        : "中央ゾーンでSPACE。失敗しても何度でも再挑戦できます。"
    );
  }

  function endTiming() {
    state.timing.active = false;
    state.timing.mode = "";
    el.timingPane.classList.add("hidden");
  }

  function timingProgress(now) {
    const elapsed = now - state.timing.startMs;
    const cycle = state.timing.durationMs;
    return (((elapsed % cycle) + cycle) % cycle) / cycle;
  }

  function isTimingSuccess() {
    if (!el.timingTrack || !el.timingSweet || !el.timingCursor) {
      const fallback = timingProgress(performance.now());
      return fallback >= state.timing.sweetMin && fallback <= state.timing.sweetMax;
    }

    const trackRect = el.timingTrack.getBoundingClientRect();
    const sweetRect = el.timingSweet.getBoundingClientRect();
    const cursorRect = el.timingCursor.getBoundingClientRect();

    if (!trackRect.width || !sweetRect.width || !cursorRect.width) return false;

    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const sweetLeft = Math.max(trackRect.left, sweetRect.left);
    const sweetRight = Math.min(trackRect.right, sweetRect.right);
    const tolerancePx = 0.75;
    return cursorCenterX >= sweetLeft - tolerancePx && cursorCenterX <= sweetRight + tolerancePx;
  }

  function getTimingMissInfo() {
    if (!el.timingTrack || !el.timingSweet || !el.timingCursor) return null;
    const trackRect = el.timingTrack.getBoundingClientRect();
    const sweetRect = el.timingSweet.getBoundingClientRect();
    const cursorRect = el.timingCursor.getBoundingClientRect();
    if (!trackRect.width || !sweetRect.width || !cursorRect.width) return null;

    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const sweetLeft = Math.max(trackRect.left, sweetRect.left);
    const sweetRight = Math.min(trackRect.right, sweetRect.right);
    const cursorPercent = ((cursorCenterX - trackRect.left) / trackRect.width) * 100;
    const sweetStartPercent = ((sweetLeft - trackRect.left) / trackRect.width) * 100;
    const sweetEndPercent = ((sweetRight - trackRect.left) / trackRect.width) * 100;
    if (cursorCenterX >= sweetLeft && cursorCenterX <= sweetRight) {
      return {
        inside: true,
        gapPx: 0,
        gapPercent: 0,
        direction: "中心",
        cursorPercent,
        sweetStartPercent,
        sweetEndPercent,
      };
    }
    const cursorLeftSide = cursorCenterX < sweetLeft;
    const gapPx = cursorLeftSide ? sweetLeft - cursorCenterX : cursorCenterX - sweetRight;
    const gapPercent = (gapPx / trackRect.width) * 100;
    return {
      inside: false,
      gapPx,
      gapPercent,
      direction: cursorLeftSide ? "右" : "左",
      cursorPercent,
      sweetStartPercent,
      sweetEndPercent,
    };
  }

  function modeToChapterKey(mode) {
    if (mode === "chapter1" || mode === "chapter2" || mode === "chapter3") return mode;
    return "chapter1";
  }

  function clearPendingTimingBoost() {
    state.pendingTimingBoost = null;
  }

  function evaluateTimingBoost(mode) {
    const hit = getTimingMissInfo();
    const chapterKey = modeToChapterKey(mode);
    if (!hit || !hit.inside) {
      return {
        chapterKey,
        tier: "normal",
        label: "NORMAL HIT",
        multiplier: 1.0,
      };
    }

    const secret = state.secretMap || cloneDefaultSecretMap();
    const secretCfg = secret[chapterKey] || DEFAULT_SECRET_BASE[chapterKey];
    const cursor = Number(hit.cursorPercent || 0);
    const sweetStart = Number(hit.sweetStartPercent || 0);
    const sweetEnd = Number(hit.sweetEndPercent || 100);
    const zoneCenter = (sweetStart + sweetEnd) / 2;
    const zoneWidth = Math.max(0.1, sweetEnd - sweetStart);
    const distToBonus = Math.abs(cursor - Number(secretCfg.bonusCenter || zoneCenter));
    const distToSide = Math.abs(cursor - Number(secretCfg.sideCenter || zoneCenter));
    const distToCenter = Math.abs(cursor - zoneCenter);

    if (distToBonus <= 1.1) {
      return {
        chapterKey,
        tier: "ultra",
        label: "ULTRA HIT x2.25",
        multiplier: 2.25,
      };
    }
    if (distToSide <= Math.max(0.9, zoneWidth * 0.08)) {
      return {
        chapterKey,
        tier: "side",
        label: "SIDE BREAK x1.85",
        multiplier: 1.85,
      };
    }
    if (distToCenter <= Math.max(0.8, zoneWidth * 0.12)) {
      return {
        chapterKey,
        tier: "critical",
        label: "CRITICAL HIT x1.60",
        multiplier: 1.6,
      };
    }
    if (distToCenter <= Math.max(1.4, zoneWidth * 0.30)) {
      return {
        chapterKey,
        tier: "good",
        label: "GOOD HIT x1.25",
        multiplier: 1.25,
      };
    }
    return {
      chapterKey,
      tier: "normal",
      label: "NORMAL HIT",
      multiplier: 1.0,
    };
  }

  function applyTimingBoostToResult(result) {
    const boost = state.pendingTimingBoost;
    clearPendingTimingBoost();
    if (!boost || !result) return result;
    const baseScore = Number(result.score || 0);
    if (!Number.isFinite(baseScore) || boost.multiplier <= 1) return result;
    const extra = Math.max(1, Math.floor(baseScore * (boost.multiplier - 1)));
    return {
      ...result,
      score: String(baseScore + extra),
      timing_bonus: {
        ...boost,
        extra,
      },
      log_tail: [
        ...(result.log_tail || []),
        `[timing-bonus] tier=${boost.tier} multiplier=${boost.multiplier.toFixed(2)} extra=${extra}`,
      ],
    };
  }

  function applyNearMissHint(mode, extras = {}) {
    let hint = "";
    if (mode === "chapter1") {
      const jitter = Number(extras.syncJitterMs || 0);
      hint =
        jitter === 0
          ? "キャンセル2重の条件は揃っています。中央の金ゾーンでSPACEを合わせれば二重取りを狙えます。"
          : `同時性ズレが ${jitter}ms（理想は0ms）です。0msに近づけるほど二重取りの穴が開きやすくなります。`;
    } else if (mode === "chapter2") {
      const jitter = Number(extras.syncJitterMs || 0);
      const gasGap = Number(extras.gasGap || 0);
      if (jitter > 0) {
        hint = `同時性ズレが ${jitter}ms（理想は0ms）です。まず0msにすると順番すり抜けの窓が広がります。`;
      } else if (gasGap < 25) {
        hint = `ガス差が ${gasGap}（目安25以上）です。値を上げると後ろの注文が割り込みやすくなります。`;
      } else {
        hint = "設定はほぼ正解です。右側の赤ゾーンでSPACEを押すタイミングだけ再調整してください。";
      }
    } else if (mode === "chapter3") {
      const amount = Number(extras.amount || 0);
      const target = 1.0000000013;
      const diff = Math.abs(amount - target);
      hint =
        diff < 1e-12
          ? "数量は一致しています。小銭ループ回数を増やすか、中央金ゾーンでの目押しを再調整してください。"
          : `数量が目標から ${diff.toExponential(2)} ずれています。1.0000000013 に近づけると小銭増幅が出やすくなります。`;
    }

    if (!hint) return;
    pushLogLine(`調整ヒント: ${hint}`, "hint");
    el.resultNext.textContent = `次の一手: ${hint}`;
  }

  function renderFreeplayPreview() {
    const mode = getReplayModeFromTarget();
    const tuning = getTuningValues();

    if (mode === "chapter1") {
      const quality = tuning.syncJitterMs === 0 ? "高" : "低";
      const preview =
        tuning.syncJitterMs === 0
          ? "確定条件です。SPACE成功で検出確定。さらにゾーン中央/隠しスポットで配当ボーナス。"
          : `同期ズレ ${tuning.syncJitterMs}ms。0msに近づけると二重取り成功率が上がります。`;
      el.resultNext.textContent = `次の一手: ${preview}（想定成功率: ${quality}）`;
      return;
    }

    if (mode === "chapter2") {
      const syncBonus = tuning.syncJitterMs === 0 ? 50 : Math.max(0, 50 - tuning.syncJitterMs * 20);
      const gasBonus = Math.min(50, Math.floor(tuning.gasGap));
      const chance = Math.max(0, Math.min(100, syncBonus + gasBonus));
      const preview =
        tuning.syncJitterMs === 0 && tuning.gasGap >= 25
          ? `確定条件です。右赤ゾーンSPACE成功で検出確定（ガス差 ${tuning.gasGap}）。位置ボーナスあり。`
          : `同期ズレ ${tuning.syncJitterMs}ms / ガス差 ${tuning.gasGap}。0msかつ25以上にすると確定条件になります。`;
      el.resultNext.textContent = `次の一手: ${preview}（推定脆弱性確率: ${chance}%）`;
      return;
    }

    const amount = Number(el.amount.value || 0);
    const diff = Math.abs(amount - 1.0000000013);
    const precise = diff < 1e-12;
    const cycleOk = tuning.pennyCycles >= 3;
    const chance = Math.max(0, Math.min(100, (precise ? 70 : Math.max(0, 70 - Math.log10(diff + 1e-15) * 8)) + tuning.pennyCycles * 4));
    const preview = precise && cycleOk
      ? `確定条件です。準備→実行→中央金ゾーンSPACE成功で検出確定（ループ${tuning.pennyCycles}回）。位置ボーナスあり。`
      : precise
        ? `数量は一致しています。ループを3回以上にすると確定条件になります（現在${tuning.pennyCycles}回）。`
        : `数量が鍵値から ${diff.toExponential(2)} ずれています。1.0000000013 に近づけてください。`;
    el.resultNext.textContent = `次の一手: ${preview}（推定脆弱性確率: ${Math.floor(chance)}%）`;
  }

  function handleResult(payload, result, context) {
    result = applyTimingBoostToResult(result);
    const timingBonus = result && result.timing_bonus ? result.timing_bonus : null;
    const types = bugTypesFromResult(result);
    const typeNames = types.length ? types.map(prettyBugName).join(" / ") : "-";
    const payout = types.length ? calculateSuccessPayout(types, timingBonus) : { bugPayout: 0, timingPayout: 0, total: 0 };
    const missDiag = types.length ? null : analyzeMiss(context, result);
    const plainBase = types.length
      ? types.map(plainBugExplanation).join(" ")
      : missDiag?.plain || "今回は条件が噛み合わず、ポイント返還は得られませんでした。";
    const timingText =
      timingBonus && timingBonus.extra > 0
        ? ` 目押し位置ボーナス: ${timingBonus.label}。`
        : "";
    if (types.length) {
      state.score += payout.total;
    }
    const economyText = types.length
      ? ` 今回は ${HACK_COST}pt を投入し、${payout.total}pt を返還（収支 +${payout.total - HACK_COST}pt）。残高 ${Math.floor(state.score)}pt。`
      : ` 今回は失敗のため投入した ${HACK_COST}pt は没収です。残高 ${Math.floor(state.score)}pt。`;
    const plain = `${plainBase}${timingText}${economyText}`;

    addLogLines(result.log_tail || []);
    if (timingBonus && timingBonus.extra > 0) {
      pushLogLine(`目押しボーナス: ${timingBonus.label} (+${payout.timingPayout}pt)`, "success");
      appendStory(`目押しボーナス発動: ${timingBonus.label} で +${payout.timingPayout}pt。`);
    }
    if (types.length) {
      pushLogLine(
        `返還: ${payout.total}pt（バグ返還 ${payout.bugPayout}pt / 目押し返還 ${payout.timingPayout}pt）`,
        "success"
      );
    } else {
      pushLogLine(`没収: ${HACK_COST}pt。残り ${Math.floor(state.score)}pt。`, "warn");
    }

    const newTypes = types.filter((t) => !state.discovered.has(t));
    for (const t of newTypes) state.discovered.add(t);

    if (types.length) {
      const nextText = types.includes("double_refund")
        ? "次は『割り込みテスト実行』で順番すり抜けを狙う"
        : types.includes("queue_jump")
          ? "次は小銭ループ準備に進み、細かい数字のズレを狙う"
          : "同じ数量を維持して再実行し、小銭増加の再現性を確認する";
      setResult("検出成功", typeNames, plain, nextText);
      setFlowState("success", "現在: ステップ3完了。結果が出ました。");
      pushLogLine(`結果: ${typeNames} を検出しました。`, "success");
    } else {
      setResult(
        "未検出",
        "-",
        plain,
        missDiag?.next ||
          (context === "chapter3"
            ? "下の視覚ヒントの緑ゾーンに寄せて、準備→実行→SPACE で再挑戦"
            : "下の視覚ヒントの緑ゾーンへ条件を寄せて再挑戦")
      );
      setFlowState("fail", "現在: ステップ3。今回は未検出です。条件を少し変えて再挑戦します。");
      pushLogLine("結果: 今回は未検出でした。条件をそろえて再挑戦しましょう。", "warn");
      renderVisualMiss(context, { diagnostics: missDiag });
    }

    if (newTypes.length) {
      const bonusLabel = timingBonus && timingBonus.extra > 0 ? ` / ${timingBonus.label}` : "";
      showCelebration(`+${payout.total}pt 返還 / 新規: ${newTypes.map(prettyBugName).join("・")}${bonusLabel}`);
      appendStory(`新規発見: ${newTypes.map(prettyBugName).join("・")} を獲得。`);
    } else if (types.length) {
      const bonusLabel = timingBonus && timingBonus.extra > 0 ? ` / ${timingBonus.label}` : "";
      showCelebration(`+${payout.total}pt 返還 / 再検出: ${types.map(prettyBugName).join("・")}${bonusLabel}`);
      appendStory(`再検出: ${types.map(prettyBugName).join("・")} をもう一度見つけました。`);
    }

    if (types.length) {
      hideVisualHint();
    }

    if (!state.missionComplete && context === "chapter1" && types.includes("double_refund")) {
      state.chapter = 2;
      appendStory("Chapter 1 クリア。おつり二重取りの再現に成功しました。");
      pushLogLine("解放: Chapter 2 に進みました。次は順番すり抜けを狙います。", "success");
      showUnlockAfterCelebration(
        "やりましたね！ おつり二重取りを突破。次は『順番すり抜け』です。",
        [
          "「割り込みテスト実行」ボタンが使える",
          "先着順のはずの処理に割り込みが起きるか検証できる",
          "結果欄で『順番すり抜け』の検出有無を確認できる",
        ],
        [
          "順番すり抜け（後の注文が先に通る）",
          "次章で小銭ふくらみ（細かいズレ増幅）",
        ]
      );
    }

    if (!state.missionComplete && context === "chapter2" && types.includes("queue_jump")) {
      state.chapter = 3;
      appendStory("Chapter 2 クリア。順番すり抜けを再現できました。");
      pushLogLine("解放: Chapter 3 に進みました。小銭ループの準備が使えます。", "success");
      showUnlockAfterCelebration(
        "お見事です！ 最終チャプター『小銭ふくらみ』が解放されました。",
        [
          "注文量の入力が有効になります（1.0000000013 が鍵）",
          "「小銭ループを準備」→「小銭ループを実行」で検証できる",
          "SPACE目押しで最終判定タイミングを固定できる",
        ],
        [
          "小銭ふくらみ（小数ズレの増幅）",
        ]
      );
    }

    if (!state.missionComplete && context === "chapter3" && types.includes("penny")) {
      state.missionComplete = true;
      appendStory("Chapter 3 クリア。小銭ふくらみの再現に成功しました。");
      pushLogLine("クリア: 3種類のバグをすべて検出。ミッション完了です。", "success");
      showUnlockAfterCelebration(
        "全章クリアです！ ここからは自由検証モードで、同じバグを何度でも再検出できます。",
        [
          "狙うバグを選択して再挑戦（再検出でも演出とポイント返還あり）",
          "同時性ズレ・ガス差・ループ回数を調整して成功率を変えられる",
          "失敗時は『どれくらいズレたか』と『次の調整案』が表示される",
          "右上の『ハッキング拡張システムへ』で認証幅をコード編集して、目押しを強化できる",
        ],
        [
          "おつり二重取り（同期0ms＋中央金ゾーン目押し）",
          "順番すり抜け（同期0ms＋ガス差25以上＋右赤ゾーン目押し）",
          "小銭ふくらみ（数量1.0000000013＋準備→実行＋中央金ゾーン目押し）",
        ]
      );
    }

    refreshUi();
    if (!types.length) {
      ensurePlayablePoints();
    }
  }

  async function executeChapter1() {
    const inTutorial = !state.missionComplete;
    const tuning = getTuningValues();
    const deterministicWin = !inTutorial && tuning.syncJitterMs === 0;
    const payload = {
      orders: buildDoubleRefundProbe({
        syncJitterMs: inTutorial ? 0 : tuning.syncJitterMs,
      }),
      algo: "greedy",
      leverage: 1.0,
    };
    const result = await runEngine(payload);
    const types = bugTypesFromResult(result);
    if (types.includes("double_refund")) {
      handleResult(payload, result, "chapter1");
      return;
    }

    if (!inTutorial) {
      if (deterministicWin) {
        // Fairness rule in freeplay:
        // recommended setup (0ms) + successful timing should not feel random.
        pushLogLine("補正: 推奨設定(0ms)のため、二重取り確定ルートを適用します。", "hint");
        const retryPayload = {
          orders: buildDoubleRefundProbe({ syncJitterMs: 0 }),
          algo: "greedy",
          leverage: 1.0,
        };
        const retryResult = await runEngine(retryPayload);
        const retryTypes = bugTypesFromResult(retryResult);
        if (retryTypes.includes("double_refund")) {
          handleResult(retryPayload, retryResult, "chapter1");
          return;
        }

        const forcedResult = {
          ...retryResult,
          score: String(Number(retryResult.score || 0) + 220),
          bugs: {
            ...(retryResult.bugs || {}),
            double_refund: 1,
          },
          log_tail: [...(retryResult.log_tail || []), "[freeplay-guarantee] chapter1 forced double_refund"],
        };
        handleResult(retryPayload, forcedResult, "chapter1");
        return;
      }

      handleResult(payload, result, "chapter1");
      if (!state.gameOver) applyNearMissHint("chapter1", tuning);
      return;
    }

    // Chapter 1 is onboarding. Guarantee first success after timing success.
    pushLogLine("補正: 初回チュートリアルのため、判定を再実行しています。", "hint");
    const retryPayload = {
      orders: buildDoubleRefundProbe({ syncJitterMs: 0 }),
      algo: "greedy",
      leverage: 1.0,
    };
    const retryResult = await runEngine(retryPayload);
    const retryTypes = bugTypesFromResult(retryResult);
    if (retryTypes.includes("double_refund")) {
      handleResult(retryPayload, retryResult, "chapter1");
      return;
    }

    const forcedResult = {
      ...retryResult,
      score: String(Number(retryResult.score || 0) + 220),
      bugs: {
        ...(retryResult.bugs || {}),
        double_refund: 1,
      },
      log_tail: [...(retryResult.log_tail || []), "[tutorial-guarantee] chapter1 forced double_refund"],
    };
    pushLogLine("補正: チュートリアル保証が発動しました。Chapter 1 を成功として進行します。", "hint");
    handleResult(retryPayload, forcedResult, "chapter1");
  }

  async function executeChapter2() {
    const inTutorial = !state.missionComplete;
    const tuning = getTuningValues();
    const deterministicWin = !inTutorial && tuning.syncJitterMs === 0 && tuning.gasGap >= 25;
    const payload = {
      orders: buildQueueJumpProbe({
        syncJitterMs: inTutorial ? 0 : tuning.syncJitterMs,
        gasGap: inTutorial ? 55 : tuning.gasGap,
      }),
      algo: "greedy",
      leverage: 1.0,
    };
    const result = await runEngine(payload);
    const types = bugTypesFromResult(result);
    if (types.includes("queue_jump")) {
      handleResult(payload, result, "chapter2");
      return;
    }

    if (!inTutorial) {
      if (deterministicWin) {
        pushLogLine("補正: 順番すり抜けの確定条件を満たしたため、確定ルートを適用します。", "hint");
        const retryPayload = {
          orders: buildQueueJumpProbe({ syncJitterMs: 0, gasGap: Math.max(55, tuning.gasGap) }),
          algo: "greedy",
          leverage: 1.0,
        };
        const retryResult = await runEngine(retryPayload);
        const retryTypes = bugTypesFromResult(retryResult);
        if (retryTypes.includes("queue_jump")) {
          handleResult(retryPayload, retryResult, "chapter2");
          return;
        }

        const forcedResult = {
          ...retryResult,
          score: String(Number(retryResult.score || 0) + 150),
          bugs: {
            ...(retryResult.bugs || {}),
            queue_jump: 1,
          },
          log_tail: [...(retryResult.log_tail || []), "[freeplay-guarantee] chapter2 forced queue_jump"],
        };
        handleResult(retryPayload, forcedResult, "chapter2");
        return;
      }

      handleResult(payload, result, "chapter2");
      if (!state.gameOver) applyNearMissHint("chapter2", tuning);
      return;
    }

    // Chapter 2 also has no manual parameter tuning. Guarantee success after timing success.
    pushLogLine("補正: Chapter 2 の割り込み判定を再実行しています。", "hint");
    const retryPayload = {
      orders: buildQueueJumpProbe({ syncJitterMs: 0, gasGap: 55 }),
      algo: "greedy",
      leverage: 1.0,
    };
    const retryResult = await runEngine(retryPayload);
    const retryTypes = bugTypesFromResult(retryResult);
    if (retryTypes.includes("queue_jump")) {
      handleResult(retryPayload, retryResult, "chapter2");
      return;
    }

    const forcedResult = {
      ...retryResult,
      score: String(Number(retryResult.score || 0) + 150),
      bugs: {
        ...(retryResult.bugs || {}),
        queue_jump: 1,
      },
      log_tail: [...(retryResult.log_tail || []), "[tutorial-guarantee] chapter2 forced queue_jump"],
    };
    pushLogLine("補正: Chapter 2 保証が発動しました。順番すり抜け発見として進行します。", "hint");
    handleResult(retryPayload, forcedResult, "chapter2");
  }

  async function executeChapter3() {
    const amount = Number(el.amount.value || 0);
    const inTutorial = !state.missionComplete;
    const tuning = getTuningValues();
    const preciseAmount = Math.abs(amount - 1.0000000013) < 1e-12;
    const deterministicWin = !inTutorial && preciseAmount && tuning.pennyCycles >= 3;
    if (Math.abs(amount - 1.0000000013) >= 1e-9) {
      if (inTutorial) {
        setResult(
          "未検出（理由がわかりました）",
          "-",
          "いまの数字では小銭ふくらみが起きません。",
          "注文量を 1.0000000013 に自動セットしました。準備→実行→SPACE で再挑戦してください。"
        );
        el.amount.value = "1.0000000013";
        pushLogLine("ヒント: 小銭ふくらみは 1.0000000013 付近の数字で起きます。", "hint");
        appendStory("Chapter 3 ヒント: 注文量を 1.0000000013 に自動設定しました。");
        renderVisualMiss("chapter3");
      } else {
        setResult(
          "未検出（調整不足）",
          "-",
          "数量が鍵値から外れているため、脆弱性が開きませんでした。",
          "下の視覚ヒントの緑ゾーンへ数量を寄せて再挑戦"
        );
        if (!state.gameOver) applyNearMissHint("chapter3", { amount });
        renderVisualMiss("chapter3");
      }
      clearPendingTimingBoost();
      refreshUi();
      ensurePlayablePoints();
      return;
    }

    const payload = {
      orders: buildPennyCycle(amount, { cycles: inTutorial ? 3 : tuning.pennyCycles }),
      algo: "greedy",
      leverage: 1.0,
    };
    const result = await runEngine(payload);
    const types = bugTypesFromResult(result);
    if (types.includes("penny")) {
      handleResult(payload, result, "chapter3");
      state.raceArmed = false;
      return;
    }

    if (!inTutorial) {
      if (deterministicWin) {
        pushLogLine("補正: 小銭ふくらみの確定条件を満たしたため、確定ルートを適用します。", "hint");
        const retryPayload = {
          orders: buildPennyCycle(amount, { cycles: Math.max(3, tuning.pennyCycles) }),
          algo: "greedy",
          leverage: 1.0,
        };
        const retryResult = await runEngine(retryPayload);
        const retryTypes = bugTypesFromResult(retryResult);
        if (retryTypes.includes("penny")) {
          handleResult(retryPayload, retryResult, "chapter3");
          state.raceArmed = false;
          return;
        }

        const forcedResult = {
          ...retryResult,
          score: String(Number(retryResult.score || 0) + 105),
          bugs: {
            ...(retryResult.bugs || {}),
            penny: Math.max(3, Number((retryResult.bugs || {}).penny || 0)),
          },
          log_tail: [...(retryResult.log_tail || []), "[freeplay-guarantee] chapter3 forced penny"],
        };
        handleResult(retryPayload, forcedResult, "chapter3");
        state.raceArmed = false;
        return;
      }

      handleResult(payload, result, "chapter3");
      if (!state.gameOver) applyNearMissHint("chapter3", { amount });
      state.raceArmed = false;
      return;
    }

    // Chapter 3 has fixed required amount + timing. Guarantee success after timing success.
    pushLogLine("補正: Chapter 3 の小銭判定を再実行しています。", "hint");
    const retryPayload = {
      orders: buildPennyCycle(amount, { cycles: 3 }),
      algo: "greedy",
      leverage: 1.0,
    };
    const retryResult = await runEngine(retryPayload);
    const retryTypes = bugTypesFromResult(retryResult);
    if (retryTypes.includes("penny")) {
      handleResult(retryPayload, retryResult, "chapter3");
      state.raceArmed = false;
      return;
    }

    const forcedResult = {
      ...retryResult,
      score: String(Number(retryResult.score || 0) + 105),
      bugs: {
        ...(retryResult.bugs || {}),
        penny: Math.max(1, Number((retryResult.bugs || {}).penny || 0)),
      },
      log_tail: [...(retryResult.log_tail || []), "[tutorial-guarantee] chapter3 forced penny"],
    };
    pushLogLine("補正: Chapter 3 保証が発動しました。小銭ふくらみ発見として進行します。", "hint");
    handleResult(retryPayload, forcedResult, "chapter3");
    state.raceArmed = false;
  }

  async function onPrimaryAction() {
    if (state.gameOver) return;
    if (state.timing.active) {
      appendStory("いま判定中です。先にSPACEで結果を確定してください。");
      pushLogLine("進行中: 先に現在のタイミング判定を完了してください。", "hint");
      return;
    }
    if (state.unlockOpen || state.panelTourOpen) {
      appendStory("先に解放内容を確認して「次へ進む」を押してください。");
      return;
    }

    const mode = getActiveMode();
    if (mode === "chapter1") {
      if (!spendHackCostOrFail()) return;
      appendStory("自販機のコンベアが動き始めました。SPACEでタイミングを合わせます。");
      beginTiming("chapter1");
      return;
    }

    if (mode === "chapter2") {
      if (!spendHackCostOrFail()) return;
      appendStory("割り込み待機を開始。白い線が右の赤ゾーンに来た瞬間にSPACEを押してください。");
      beginTiming("chapter2");
      return;
    }

    if (!state.raceArmed) {
      setResult(
        "準備不足",
        "-",
        "小銭ループがまだ準備されていません。",
        "先に「小銭ループを準備」を押す"
      );
      setFlowState("idle", "現在: ステップ1。先に小銭ループ準備ボタンを押してください。");
      pushLogLine("注意: 先に『小銭ループを準備』を押してください。", "warn");
      appendStory("まだ小銭ループの準備ができていません。準備ボタンを先に押してください。");
      return;
    }

    if (!spendHackCostOrFail()) return;
    appendStory("小銭ループを開始。SPACEでタイミングを合わせて判定を確定します。");
    beginTiming("chapter3");
  }

  async function onSpaceKey() {
    if (state.gameOver) return;
    if (state.unlockOpen || state.panelTourOpen) return;
    if (!state.timing.active) return;
    const mode = state.timing.mode;
    const now = performance.now();
    renderTimingCursor(now);
    if (!isTimingSuccess()) {
      const miss = getTimingMissInfo();
      const missText =
        miss && !miss.inside
          ? ` 受付まであと ${miss.gapPercent.toFixed(1)}%（${miss.direction}へ）`
          : "";
      if (mode === "chapter2") {
        el.timingText.textContent = `惜しい！ まだ右の赤ゾーンに入っていません。${missText} もう一度SPACE。`;
        setFlowState("timing", "現在: ステップ2。右の赤い割り込みゾーンで押し直してください。");
        pushLogLine(`惜しい: まだ割り込み受付ゾーン外です。${missText}`, "warn");
        appendStory(`割り込み失敗。赤ゾーンまでの距離: ${missText || "位置情報取得中"}`);
        applyNearMissHint("chapter2", getTuningValues());
      } else {
        el.timingText.textContent = `惜しい！ 白い線の中心が金色ゾーン外です。${missText} もう一度SPACEで再挑戦。`;
        setFlowState("timing", "現在: ステップ2。惜しいです。白い線を金色ゾーンに重ねて押し直しましょう。");
        pushLogLine(`惜しい: 判定ゾーン外です。${missText}`, "warn");
        appendStory(`目押し失敗。受付までの距離: ${missText || "位置情報取得中"}`);
        if (mode === "chapter1") applyNearMissHint("chapter1", getTuningValues());
        if (mode === "chapter3") applyNearMissHint("chapter3", { amount: Number(el.amount.value || 0) });
      }
      renderVisualMiss(mode, { timingMiss: miss });
      return;
    }

    const timingBoost = evaluateTimingBoost(mode);
    state.pendingTimingBoost = timingBoost;
    endTiming();
    setResult(
      "目押し成功",
      "-",
      mode === "chapter2" ? "割り込みタイミングの固定に成功しました。" : "タイミング固定に成功しました。",
      timingBoost.multiplier > 1
        ? `結果を確定しています...（${timingBoost.label}）`
        : "結果を確定しています..."
    );
    setFlowState("processing", "現在: ステップ3（結果待ち）。あなたの入力で最終判定しています。");
    if (timingBoost.multiplier > 1) {
      pushLogLine(`成功: 目押し評価 ${timingBoost.label}。今回の配当が上がります。`, "success");
    }
    if (mode === "chapter2") {
      pushLogLine("成功: 割り込みタイミングを固定しました。順番判定を実行します。", "success");
      appendStory("割り込み目押し成功。順番すり抜け判定を実行します。");
    } else {
      pushLogLine("成功: 目押しが決まりました。結果を確定します。", "success");
      appendStory("目押し成功。結果を確定します。");
    }

    try {
      if (mode === "chapter1") await executeChapter1();
      else if (mode === "chapter2") await executeChapter2();
      else if (mode === "chapter3") await executeChapter3();
    } catch (err) {
      clearPendingTimingBoost();
      setResult(
        "実行失敗",
        "-",
        `通信に失敗しました。今回の ${HACK_COST}pt は返還されません。残高 ${Math.floor(state.score)}pt。`,
        "もう一度実行する"
      );
      setFlowState("fail", "現在: ステップ3。通信エラーです。もう一度試してください。");
      pushLogLine(`注意: 通信エラー。今回の投入 ${HACK_COST}pt は没収扱いです。`, "warn");
      appendStory(`エラー: ${err.message}`);
      refreshUi();
      ensurePlayablePoints();
    }
  }

  function renderTimingCursor(now) {
    if (!state.timing.active) return;
    const p = timingProgress(now);
    el.timingCursor.style.left = `${(p * 100).toFixed(2)}%`;
  }

  function animate(now) {
    renderTimingCursor(now);
    requestAnimationFrame(animate);
  }

  function bindEvents() {
    el.start.addEventListener("click", () => {
      state.hasStarted = true;
      state.gameOver = false;
      closeGameOverOverlay();
      el.intro.classList.add("hidden");
      appendStory("ミッション開始。あなたは自販機の隠し仕様を追うハッカーです。");
      appendStory(`初期資金は ${INITIAL_POINTS}pt。1回の実行ごとに ${HACK_COST}pt を投入します。`);
      appendStory("最初は1つだけ。『100円入れる』を押して、中央SPACEを狙ってください。");
      setFlowState("idle", "現在: ステップ1（ボタンを押す）から始めます。");
      pushLogLine(`開始: 初期資金 ${INITIAL_POINTS}pt。まずは『100円入れる』で ${HACK_COST}pt 投入。`, "info");
      refreshUi();
      startPanelTour();
      queuePersistProgress();
    });

    el.injectRace.addEventListener("click", () => {
      if (state.unlockOpen || state.panelTourOpen) return;
      state.raceArmed = true;
      setResult("準備完了", "-", "小銭ループの準備ができました。", "次は「小銭ループを実行」を押す");
      setFlowState("idle", "現在: ステップ1。準備完了です。次は実行ボタンを押します。");
      pushLogLine("準備完了: 小銭ループの準備ができました。", "hint");
      appendStory("小銭ループをセットしました。実行後にSPACE中央で確定してください。");
    });

    el.primary.addEventListener("click", () => {
      onPrimaryAction();
    });

    const refreshFromControl = () => {
      if (!state.missionComplete) {
        queuePersistProgress();
        return;
      }
      state.raceArmed = false;
      refreshUi();
      queuePersistProgress();
    };
    if (el.targetBug) el.targetBug.addEventListener("change", refreshFromControl);
    if (el.syncJitter) el.syncJitter.addEventListener("input", refreshFromControl);
    if (el.gasGap) el.gasGap.addEventListener("input", refreshFromControl);
    if (el.pennyCycles) el.pennyCycles.addEventListener("input", refreshFromControl);
    if (el.amount) el.amount.addEventListener("input", refreshFromControl);

    window.addEventListener("keydown", (ev) => {
      if (ev.code === "Space") {
        ev.preventDefault();
        onSpaceKey();
      }
    });

    window.addEventListener("focus", () => {
      refreshSecretMapFromStorage();
      refreshHackSettingsFromStorage({ notify: true });
      refreshUi();
    });
    window.addEventListener("storage", (ev) => {
      if (ev.key === HACK_SETTINGS_KEY || ev.key === HACK_SECRET_KEY) {
        refreshSecretMapFromStorage();
        refreshHackSettingsFromStorage({ notify: true });
        refreshUi();
        return;
      }
      if (ev.key === GAME_PROGRESS_KEY) {
        restoreProgressFromStorage();
        refreshUi();
      }
    });
    window.addEventListener("pagehide", () => {
      persistProgressNow();
    });
    window.addEventListener("beforeunload", () => {
      persistProgressNow();
    });

    el.panelTourNext.addEventListener("click", () => {
      if (!state.panelTourOpen) return;
      if (state.panelTourIndex >= panelTourSteps.length - 1) {
        endPanelTour();
        return;
      }
      state.panelTourIndex += 1;
      showPanelTourStep();
    });

    el.panelTourSkip.addEventListener("click", () => {
      if (!state.panelTourOpen) return;
      endPanelTour();
    });

    el.unlockClose.addEventListener("click", () => {
      closeUnlockPopup();
      appendStory("解放内容を確認しました。次のチャプター手順で新しいバグ検証に進みましょう。");
      queuePersistProgress();
    });
    if (el.gameOverRestart) {
      el.gameOverRestart.addEventListener("click", () => {
        resetGameProgress();
      });
    }
  }

  function init() {
    refreshSecretMapFromStorage();
    refreshHackSettingsFromStorage();
    const restored = restoreProgressFromStorage();
    if (!restored) {
      setResult(
        "待機中",
        "-",
        `まずは導入を読んでミッション開始を押してください。初期資金は ${INITIAL_POINTS}pt です。`,
        `ミッション開始ボタンを押す（1回の実行コスト ${HACK_COST}pt）`,
        { persist: false }
      );
      setFlowState("idle", "現在: 待機中（ミッション開始を押してください）", { persist: false });
      pushLogLine(
        `待機中: 『ミッション開始』で開始。初期 ${INITIAL_POINTS}pt / 実行コスト ${HACK_COST}pt。`,
        "info",
        { persist: false }
      );
      queuePersistProgress();
    }
    refreshUi();
    bindEvents();
    requestAnimationFrame(animate);
  }

  init();
})();
