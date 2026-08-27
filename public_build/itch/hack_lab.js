(function () {
  const HACK_SETTINGS_KEY = "vending_glitch_hack_settings_v1";
  const HACK_PLAN_KEY = "vending_glitch_hack_plan_v1";
  const HACK_SECRET_KEY = "vending_glitch_secret_map_v1";
  const HACK_STORE_KEY = "vending_glitch_store_v1";
  const GAME_PROGRESS_KEY = "vending_glitch_game_progress_v2";

  const INITIAL_POINTS = 1000;
  const HACK_COST = 100;

  const DEFAULT_PLAN = Object.freeze({
    chapter1: { probeBudget: 2, stabilityBias: 60, entropyGate: 44, focusMode: "safe" },
    chapter2: { probeBudget: 2, stabilityBias: 56, entropyGate: 55, focusMode: "balanced" },
    chapter3: { probeBudget: 3, stabilityBias: 50, entropyGate: 62, focusMode: "greedy" },
  });

  const DEFAULT_SECRET_BASE = Object.freeze({
    chapter1: { bonusCenter: 53.0, sideCenter: 34.0, phase: 40, mainSpan: 13.5 },
    chapter2: { bonusCenter: 74.0, sideCenter: 62.0, phase: 120, mainSpan: 11.5 },
    chapter3: { bonusCenter: 49.0, sideCenter: 37.0, phase: 220, mainSpan: 12.0 },
  });

  const STORE_ITEMS = Object.freeze([
    {
      id: "hint_basics",
      cost: 120,
      name: "ヒント: 基本ロジック",
      description: "各パラメータが判定窓にどう効くかを表示します。",
      category: "hint",
    },
    {
      id: "hint_pairmap",
      cost: 180,
      name: "ヒント: 章別マップ",
      description: "各Chapterで有効な調整方向のヒントが解放されます。",
      category: "hint",
    },
    {
      id: "module_phase_lens",
      cost: 260,
      name: "モジュール: Phase Lens",
      description: "sweet spot推定の位相解像度が上がり、中心推定が安定します。",
      category: "module",
    },
    {
      id: "module_side_trace",
      cost: 320,
      name: "モジュール: Side Trace",
      description: "副次シグナルを使えるようになり、推定の偏りを補正します。",
      category: "module",
    },
    {
      id: "module_width_patch",
      cost: 240,
      name: "モジュール: Width Patch",
      description: "推定できる認証幅が広がり、目押し成功率が上がります。",
      category: "module",
    },
    {
      id: "module_deep_decoder",
      cost: 420,
      name: "モジュール: Deep Decoder",
      description: "高価ですが強力。sweet spot推定精度をさらに上げます。",
      category: "module",
    },
    {
      id: "snippet_safe",
      cost: 150,
      name: "コード断片: Safe",
      description: "安定寄りの設定をワンクリックでコードに挿入できます。",
      category: "snippet",
    },
    {
      id: "snippet_rush",
      cost: 220,
      name: "コード断片: Rush",
      description: "高配当狙いの設定をワンクリックでコードに挿入できます。",
      category: "snippet",
    },
  ]);

  const STORE_ID_SET = new Set(STORE_ITEMS.map((item) => item.id));
  const SCRIPT_BLOCK_KEYWORDS = new Set(["chapter", "mission", "profile"]);
  const FIELD_ALIASES = Object.freeze({
    probebudget: "probeBudget",
    probe: "probeBudget",
    budget: "probeBudget",
    stabilitybias: "stabilityBias",
    stability: "stabilityBias",
    bias: "stabilityBias",
    entropygate: "entropyGate",
    entropy: "entropyGate",
    gate: "entropyGate",
    focusmode: "focusMode",
    focus: "focusMode",
    mode: "focusMode",
    sweetleft: "sweetLeft",
    sweetwidth: "sweetWidth",
    scandepth: "scanDepth",
  });
  const DIRECT_ONLY_FIELDS = new Set(["sweetLeft", "sweetWidth", "scanDepth"]);

  const el = {
    code: document.getElementById("hack-code"),
    loadTemplateBtn: document.getElementById("load-template-btn"),
    validateBtn: document.getElementById("validate-btn"),
    saveBtn: document.getElementById("save-btn"),
    applySafeBtn: document.getElementById("apply-safe-btn"),
    applyRushBtn: document.getElementById("apply-rush-btn"),
    pointPill: document.getElementById("point-pill"),
    storeList: document.getElementById("store-list"),
    ownedList: document.getElementById("owned-list"),
    hintConsole: document.getElementById("hint-console"),
    previewList: document.getElementById("preview-list"),
    editorLog: document.getElementById("editor-log"),
    statusBanner: document.getElementById("status-banner"),
  };

  let secretMap = null;
  let storeState = { purchased: [] };
  let playerPoints = INITIAL_POINTS;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function mix(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function chapterKeys() {
    return ["chapter1", "chapter2", "chapter3"];
  }

  function cloneDefaultPlan() {
    return {
      chapter1: { ...DEFAULT_PLAN.chapter1 },
      chapter2: { ...DEFAULT_PLAN.chapter2 },
      chapter3: { ...DEFAULT_PLAN.chapter3 },
    };
  }

  function cloneDefaultSecret() {
    return {
      chapter1: { ...DEFAULT_SECRET_BASE.chapter1 },
      chapter2: { ...DEFAULT_SECRET_BASE.chapter2 },
      chapter3: { ...DEFAULT_SECRET_BASE.chapter3 },
    };
  }

  function createSecretMap() {
    const out = cloneDefaultSecret();
    for (const key of chapterKeys()) {
      out[key].bonusCenter = clamp(out[key].bonusCenter + (Math.random() * 6 - 3), 8, 92);
      out[key].sideCenter = clamp(out[key].sideCenter + (Math.random() * 10 - 5), 5, 95);
      out[key].phase = (out[key].phase + Math.random() * 240) % 360;
      out[key].mainSpan = clamp(out[key].mainSpan + (Math.random() * 3 - 1.5), 8.5, 18);
    }
    return out;
  }

  function sanitizeSecretMap(raw) {
    const out = cloneDefaultSecret();
    if (!raw || typeof raw !== "object") return out;
    for (const key of chapterKeys()) {
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
    } catch (_err) {
      const made = createSecretMap();
      localStorage.setItem(HACK_SECRET_KEY, JSON.stringify(made));
      return made;
    }
  }

  function normalizeFocusMode(v) {
    if (v === "safe" || v === "balanced" || v === "greedy") return v;
    return "balanced";
  }

  function normalizeChapterKey(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (raw === "chapter1" || raw === "ch1" || raw === "c1") return "chapter1";
    if (raw === "chapter2" || raw === "ch2" || raw === "c2") return "chapter2";
    if (raw === "chapter3" || raw === "ch3" || raw === "c3") return "chapter3";
    return "";
  }

  function normalizeFieldName(value) {
    const raw = String(value || "").trim().toLowerCase();
    return FIELD_ALIASES[raw] || "";
  }

  function parseFocusModeValue(value, token) {
    const raw = String(value || "").trim().replace(/^['"]|['"]$/g, "").toLowerCase();
    if (raw === "safe" || raw === "balanced" || raw === "greedy") {
      return raw;
    }
    throw createParserError("focusMode は safe / balanced / greedy のいずれかにしてください。", token);
  }

  function createParserError(message, token) {
    const line = token && Number.isFinite(token.line) ? token.line : 1;
    const column = token && Number.isFinite(token.column) ? token.column : 1;
    return new Error(`${message} (line ${line}, col ${column})`);
  }

  function tokenizeHackScript(source) {
    const text = String(source || "");
    const tokens = [];
    let index = 0;
    let line = 1;
    let column = 1;

    function currentChar() {
      return text[index] || "";
    }

    function nextChar() {
      return text[index + 1] || "";
    }

    function advance() {
      const ch = text[index] || "";
      index += 1;
      if (ch === "\n") {
        line += 1;
        column = 1;
      } else {
        column += 1;
      }
      return ch;
    }

    function push(type, value, tokenLine, tokenColumn) {
      tokens.push({ type, value, line: tokenLine, column: tokenColumn });
    }

    function isIdentifierStart(ch) {
      return /[A-Za-z_]/.test(ch);
    }

    function isIdentifierPart(ch) {
      return /[A-Za-z0-9_]/.test(ch);
    }

    function isDigit(ch) {
      return /[0-9]/.test(ch);
    }

    while (index < text.length) {
      const ch = currentChar();

      if (/\s/.test(ch)) {
        advance();
        continue;
      }

      if (ch === "/" && nextChar() === "/") {
        while (index < text.length && currentChar() !== "\n") advance();
        continue;
      }

      if (ch === "#") {
        while (index < text.length && currentChar() !== "\n") advance();
        continue;
      }

      if (ch === "/" && nextChar() === "*") {
        const startLine = line;
        const startColumn = column;
        let closed = false;
        advance();
        advance();
        while (index < text.length) {
          if (currentChar() === "*" && nextChar() === "/") {
            advance();
            advance();
            closed = true;
            break;
          }
          advance();
        }
        if (!closed) {
          throw createParserError("ブロックコメントが閉じられていません。", {
            line: startLine,
            column: startColumn,
          });
        }
        continue;
      }

      if (isIdentifierStart(ch)) {
        const startLine = line;
        const startColumn = column;
        let value = "";
        while (index < text.length && isIdentifierPart(currentChar())) {
          value += advance();
        }
        push("identifier", value, startLine, startColumn);
        continue;
      }

      if (isDigit(ch) || (ch === "-" && isDigit(nextChar()))) {
        const startLine = line;
        const startColumn = column;
        let value = "";
        if (ch === "-") value += advance();
        while (index < text.length && isDigit(currentChar())) value += advance();
        if (currentChar() === ".") {
          value += advance();
          while (index < text.length && isDigit(currentChar())) value += advance();
        }
        push("number", value, startLine, startColumn);
        continue;
      }

      if (ch === '"' || ch === "'") {
        const quote = ch;
        const startLine = line;
        const startColumn = column;
        let value = "";
        advance();
        while (index < text.length && currentChar() !== quote) {
          const part = advance();
          if (part === "\\") {
            const escaped = advance();
            if (escaped === "n") value += "\n";
            else if (escaped === "t") value += "\t";
            else if (escaped === quote) value += quote;
            else if (escaped === "\\") value += "\\";
            else value += escaped;
            continue;
          }
          if (part === "\n") {
            throw createParserError("文字列リテラル内で改行は使えません。", {
              line: startLine,
              column: startColumn,
            });
          }
          value += part;
        }
        if (currentChar() !== quote) {
          throw createParserError("文字列リテラルが閉じられていません。", {
            line: startLine,
            column: startColumn,
          });
        }
        advance();
        push("string", value, startLine, startColumn);
        continue;
      }

      if ("{}()=;,".includes(ch)) {
        const startLine = line;
        const startColumn = column;
        push("symbol", advance(), startLine, startColumn);
        continue;
      }

      throw createParserError(`不正な文字 \`${ch}\` が見つかりました。`, { line, column });
    }

    tokens.push({ type: "eof", value: "", line, column });
    return tokens;
  }

  function parseHackScript(source) {
    const plan = cloneDefaultPlan();
    const meta = { ignoredDirect: [], legacyJson: false };
    const tokens = tokenizeHackScript(source);
    const seenBlocks = new Set();
    let cursor = 0;

    function current() {
      return tokens[cursor] || tokens[tokens.length - 1];
    }

    function advance() {
      const token = current();
      cursor += 1;
      return token;
    }

    function matchSymbol(symbol) {
      if (current().type === "symbol" && current().value === symbol) {
        advance();
        return true;
      }
      return false;
    }

    function expectSymbol(symbol, message) {
      if (!matchSymbol(symbol)) {
        throw createParserError(message || `\`${symbol}\` が必要です。`, current());
      }
    }

    function expectIdentifier(message) {
      if (current().type !== "identifier") {
        throw createParserError(message || "識別子が必要です。", current());
      }
      return advance();
    }

    function parseValue() {
      const token = current();
      if (token.type === "number") {
        advance();
        return Number(token.value);
      }
      if (token.type === "string") {
        advance();
        return token.value;
      }
      if (token.type === "identifier") {
        advance();
        return token.value;
      }
      throw createParserError("値が必要です。数値・文字列・識別子のいずれかを書いてください。", token);
    }

    function applySetting(chapterKey, fieldName, value, token) {
      if (DIRECT_ONLY_FIELDS.has(fieldName)) {
        meta.ignoredDirect.push(`${chapterKey}.${fieldName}`);
        return;
      }

      if (fieldName === "focusMode") {
        plan[chapterKey].focusMode = parseFocusModeValue(value, token);
        return;
      }

      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        throw createParserError(`${fieldName} には数値が必要です。`, token);
      }

      if (fieldName === "probeBudget") plan[chapterKey].probeBudget = clamp(numeric, 1, 6);
      if (fieldName === "stabilityBias") plan[chapterKey].stabilityBias = clamp(numeric, 0, 100);
      if (fieldName === "entropyGate") plan[chapterKey].entropyGate = clamp(numeric, 0, 100);
    }

    function parseStatement(chapterKey) {
      const commandToken = expectIdentifier("設定名が必要です。");
      const fieldName = normalizeFieldName(commandToken.value);
      if (!fieldName) {
        throw createParserError(
          "未対応の命令です。probeBudget / stabilityBias / entropyGate / focusMode を使ってください。",
          commandToken
        );
      }

      if (matchSymbol("(")) {
        const value = parseValue();
        expectSymbol(")", "関数呼び出しの `)` が閉じられていません。");
        matchSymbol(";");
        applySetting(chapterKey, fieldName, value, commandToken);
        return;
      }

      if (matchSymbol("=")) {
        const value = parseValue();
        matchSymbol(";");
        applySetting(chapterKey, fieldName, value, commandToken);
        return;
      }

      throw createParserError(
        "設定は `probeBudget(3);` または `probeBudget = 3;` の形式で書いてください。",
        current()
      );
    }

    function parseBlock(chapterKey) {
      if (seenBlocks.has(chapterKey)) {
        throw createParserError(`${chapterKey} が重複しています。1つのChapterにつき1ブロックだけ書いてください。`, current());
      }
      seenBlocks.add(chapterKey);
      expectSymbol("{", "`{` が必要です。");
      while (!(current().type === "symbol" && current().value === "}")) {
        if (current().type === "eof") {
          throw createParserError("ブロックが閉じられていません。末尾に `}` を追加してください。", current());
        }
        parseStatement(chapterKey);
      }
      expectSymbol("}", "`}` が必要です。");
    }

    while (current().type !== "eof") {
      const token = current();
      if (token.type !== "identifier") {
        throw createParserError(
          "行頭には `chapter chapter1 { ... }` または `class Chapter1 { ... }` を書いてください。",
          token
        );
      }

      const blockWord = String(token.value || "").toLowerCase();

      if (SCRIPT_BLOCK_KEYWORDS.has(blockWord)) {
        advance();
        const nameToken = expectIdentifier("Chapter名が必要です。");
        const chapterKey = normalizeChapterKey(nameToken.value);
        if (!chapterKey) {
          throw createParserError("Chapter名は chapter1 / chapter2 / chapter3 のいずれかにしてください。", nameToken);
        }
        parseBlock(chapterKey);
        continue;
      }

      if (blockWord === "class") {
        advance();
        const nameToken = expectIdentifier("class名が必要です。");
        const chapterKey = normalizeChapterKey(nameToken.value);
        if (!chapterKey) {
          throw createParserError("class名は Chapter1 / Chapter2 / Chapter3 のいずれかにしてください。", nameToken);
        }
        if (current().type === "identifier" && String(current().value || "").toLowerCase() === "extends") {
          advance();
          expectIdentifier("extends の後に親クラス名が必要です。");
        }
        parseBlock(chapterKey);
        continue;
      }

      throw createParserError(
        "ブロックの開始方法が不正です。`chapter chapter1 { ... }` か `class Chapter1 { ... }` を使ってください。",
        token
      );
    }

    return { plan: sanitizePlan(plan).plan, meta };
  }

  function sanitizePlan(raw) {
    const out = cloneDefaultPlan();
    const meta = { ignoredDirect: [] };
    if (!raw || typeof raw !== "object") return { plan: out, meta };

    for (const key of chapterKeys()) {
      const src = raw[key];
      if (!src || typeof src !== "object") continue;

      if (Object.prototype.hasOwnProperty.call(src, "sweetLeft")) meta.ignoredDirect.push(`${key}.sweetLeft`);
      if (Object.prototype.hasOwnProperty.call(src, "sweetWidth")) meta.ignoredDirect.push(`${key}.sweetWidth`);
      if (Object.prototype.hasOwnProperty.call(src, "scanDepth")) meta.ignoredDirect.push(`${key}.scanDepth`);

      const probeBudget = Number(src.probeBudget);
      const stabilityBias = Number(src.stabilityBias);
      const entropyGate = Number(src.entropyGate);

      if (Number.isFinite(probeBudget)) out[key].probeBudget = clamp(probeBudget, 1, 6);
      if (Number.isFinite(stabilityBias)) out[key].stabilityBias = clamp(stabilityBias, 0, 100);
      if (Number.isFinite(entropyGate)) out[key].entropyGate = clamp(entropyGate, 0, 100);
      out[key].focusMode = normalizeFocusMode(String(src.focusMode || "balanced"));
    }

    return { plan: out, meta };
  }

  function parseLegacyJsonPlan(source) {
    let parsed;
    try {
      parsed = JSON.parse(source);
    } catch (_err) {
      throw new Error("HackScript の構文が読めません。テンプレートを基準に書いてください。");
    }
    const sanitized = sanitizePlan(parsed);
    sanitized.meta.legacyJson = true;
    return sanitized;
  }

  function parsePlanSource(source) {
    const text = String(source || "").trim();
    if (!text) {
      throw new Error("コード欄が空です。テンプレートを読み込んでください。");
    }
    if (text.startsWith("{")) {
      return parseLegacyJsonPlan(text);
    }
    return parseHackScript(text);
  }

  function readSavedPlan() {
    try {
      const raw = localStorage.getItem(HACK_PLAN_KEY);
      if (!raw) return cloneDefaultPlan();
      return parsePlanSource(raw).plan;
    } catch (_err) {
      return cloneDefaultPlan();
    }
  }

  function parseEditorPlan() {
    return parsePlanSource(String(el.code?.value || ""));
  }

  function sanitizeStoreState(raw) {
    const out = { purchased: [] };
    if (!raw || typeof raw !== "object") return out;
    const purchased = Array.isArray(raw.purchased) ? raw.purchased : [];
    out.purchased = [...new Set(purchased.map((v) => String(v)).filter((v) => STORE_ID_SET.has(v)))];
    return out;
  }

  function readStoreState() {
    try {
      const raw = localStorage.getItem(HACK_STORE_KEY);
      if (!raw) return { purchased: [] };
      return sanitizeStoreState(JSON.parse(raw));
    } catch (_err) {
      return { purchased: [] };
    }
  }

  function saveStoreState() {
    localStorage.setItem(HACK_STORE_KEY, JSON.stringify(storeState));
  }

  function owns(itemId) {
    return storeState.purchased.includes(itemId);
  }

  function readProgressScore() {
    try {
      const raw = localStorage.getItem(GAME_PROGRESS_KEY);
      if (!raw) return INITIAL_POINTS;
      const parsed = JSON.parse(raw);
      const score = Number(parsed.score);
      if (!Number.isFinite(score)) return INITIAL_POINTS;
      return Math.max(0, Math.floor(score));
    } catch (_err) {
      return INITIAL_POINTS;
    }
  }

  function writeProgressScore(score) {
    const nextScore = Math.max(0, Math.floor(Number(score) || 0));
    let progress = {
      v: 2,
      hasStarted: true,
      chapter: 1,
      score: nextScore,
      discovered: [],
      missionComplete: false,
      gameOver: nextScore < HACK_COST,
      raceArmed: false,
      amount: "1.0",
      targetBug: "double_refund",
      syncJitterMs: 0,
      gasGap: 55,
      pennyCycles: 3,
      storyHistory: [],
      logHistory: [],
      resultSnapshot: null,
      flowSnapshot: null,
    };

    try {
      const raw = localStorage.getItem(GAME_PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          progress = {
            ...progress,
            ...parsed,
          };
        }
      }
    } catch (_err) {
      // use default progress object
    }

    progress.score = nextScore;
    progress.gameOver = nextScore < HACK_COST;
    localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
  }

  function chapterLabel(key) {
    if (key === "chapter1") return "Chapter1: おつり二重取り";
    if (key === "chapter2") return "Chapter2: 順番すり抜け";
    return "Chapter3: 小銭ふくらみ";
  }

  function moduleProfile() {
    return {
      phase: owns("module_phase_lens") ? 0.24 : 0,
      side: owns("module_side_trace") ? 0.16 : 0,
      deep: owns("module_deep_decoder") ? 0.26 : 0,
      width: owns("module_width_patch") ? 4.8 : 0,
    };
  }

  function estimateChapterWindow(chapterKey, cfg) {
    const sec = secretMap[chapterKey];
    const modules = moduleProfile();

    const focusShift = cfg.focusMode === "safe" ? -4 : cfg.focusMode === "greedy" ? 5 : 1;
    const entropyShift = (cfg.entropyGate - 50) * 0.11;
    const stabilityShift = (cfg.stabilityBias - 50) * 0.07;
    const phaseWobble = Math.sin((sec.phase + cfg.probeBudget * 41 + cfg.entropyGate * 2.8) * (Math.PI / 180)) * 6.8;

    const baseCenter = clamp(50 + focusShift + entropyShift + stabilityShift + phaseWobble, 0, 100);
    let targetCenter = sec.bonusCenter;
    if (modules.side > 0) {
      targetCenter = mix(sec.bonusCenter, sec.sideCenter, 0.22);
    }

    let pull = 0.08 + cfg.probeBudget * 0.05 + modules.phase + modules.deep;
    if (owns("hint_basics")) pull += 0.04;
    if (owns("hint_pairmap")) pull += 0.06;
    pull = clamp(pull, 0.05, 0.88);

    let center = mix(baseCenter, targetCenter, pull);
    const noise = (6 - cfg.probeBudget) * 0.9 + Math.abs(cfg.entropyGate - 50) * 0.03;
    center = clamp(center + Math.sin((cfg.stabilityBias + sec.phase) * 0.17) * noise, 0, 100);

    let width =
      10.5 +
      cfg.stabilityBias * 0.13 +
      (cfg.focusMode === "safe" ? 5.0 : cfg.focusMode === "greedy" ? -1.8 : 2.0) +
      (3.5 - Math.min(cfg.probeBudget, 3.5)) * 1.1 +
      (Math.abs(cfg.entropyGate - 50) / 50) * 2.2;
    width += modules.width;
    width = clamp(width, 8, 42);

    const left = clamp(center - width / 2, 0, 95);
    const fixedWidth = clamp(width, 4, 95 - left);

    const confidence = clamp(Math.round(pull * 100 - noise * 4 + (modules.width > 0 ? 6 : 0)), 8, 97);
    const risk = clamp(
      Math.round((100 - cfg.stabilityBias) * 0.8 + (cfg.focusMode === "greedy" ? 18 : 0) - cfg.probeBudget * 4),
      4,
      95
    );

    return {
      left,
      width: fixedWidth,
      center,
      confidence,
      risk,
      pull,
    };
  }

  function compilePlan(plan) {
    const runtime = {};
    const reports = {};

    for (const key of chapterKeys()) {
      const cfg = plan[key] || DEFAULT_PLAN[key];
      const normalizedCfg = {
        probeBudget: clamp(Number(cfg.probeBudget), 1, 6),
        stabilityBias: clamp(Number(cfg.stabilityBias), 0, 100),
        entropyGate: clamp(Number(cfg.entropyGate), 0, 100),
        focusMode: normalizeFocusMode(String(cfg.focusMode || "balanced")),
      };

      const est = estimateChapterWindow(key, normalizedCfg);
      runtime[key] = {
        sweetLeft: est.left,
        sweetWidth: est.width,
      };
      reports[key] = {
        ...normalizedCfg,
        estimatedCenter: est.center,
        confidence: est.confidence,
        risk: est.risk,
        sweetLeft: est.left,
        sweetWidth: est.width,
        predictivePower: Math.round(est.pull * 100),
      };
    }

    return { runtime, reports };
  }

  function formatPlan(plan) {
    const safePlan = sanitizePlan(plan).plan;
    return [
      "// HackScript v1",
      "// 関数呼び出し風: probeBudget(3);",
      "// class 風: class Chapter2 { probeBudget = 4; } も使えます。",
      "",
      ...chapterKeys().map((key) => {
        const cfg = safePlan[key];
        return [
          `chapter ${key} {`,
          `  probeBudget(${cfg.probeBudget});`,
          `  stabilityBias(${cfg.stabilityBias});`,
          `  entropyGate(${cfg.entropyGate});`,
          `  focusMode("${cfg.focusMode}");`,
          `}`,
          "",
        ].join("\n");
      }),
    ].join("\n").trimEnd() + "\n";
  }

  function formatRuntime(settings) {
    return JSON.stringify(settings, null, 2);
  }

  function setLog(msg, tone = "ok") {
    if (!el.editorLog) return;
    const klass = tone === "warn" ? "warn" : "ok";
    const now = new Date().toLocaleTimeString("ja-JP");
    el.editorLog.textContent = `[${now}] ${msg}`;
    el.editorLog.className = `editor-log ${klass}`;
  }

  function setStatus(msg, tone = "ok") {
    if (!el.statusBanner) return;
    el.statusBanner.textContent = msg;
    el.statusBanner.className = `status-banner ${tone === "warn" ? "warn" : "ok"}`;
  }

  function renderPreview(compiled) {
    if (!el.previewList) return;
    const cards = chapterKeys()
      .map((key) => {
        const rep = compiled.reports[key];
        const left = rep.sweetLeft;
        const width = rep.sweetWidth;
        const right = left + width;
        const confidenceTone = rep.confidence >= 70 ? "ok" : rep.confidence >= 45 ? "" : "warn";
        return `
          <div class="preview-card">
            <div class="preview-head">
              <span>${chapterLabel(key)}</span>
              <span>focus=${rep.focusMode} / probe=${rep.probeBudget}</span>
            </div>
            <div class="preview-track">
              <div class="preview-zone" style="left:${left}%;width:${width}%;"></div>
            </div>
            <div class="preview-foot">
              推定window: ${left.toFixed(2)}%〜${right.toFixed(2)}% / 推定center: ${rep.estimatedCenter.toFixed(2)}%<br>
              信頼度: <span class="${confidenceTone}">${rep.confidence}%</span> / リスク: ${rep.risk}% / 解析力: ${rep.predictivePower}%
            </div>
          </div>
        `;
      })
      .join("");
    el.previewList.innerHTML = cards;
  }

  function renderOwnedList() {
    if (!el.ownedList) return;
    if (!storeState.purchased.length) {
      el.ownedList.innerHTML = "<div>まだ購入済み機能はありません。</div>";
      return;
    }
    const lines = storeState.purchased
      .map((id) => STORE_ITEMS.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => `<div>・${item.name}</div>`)
      .join("");
    el.ownedList.innerHTML = lines;
  }

  function buildHintLines() {
    const lines = [];
    if (owns("hint_basics")) {
      lines.push("基本: probeBudgetを上げるほど推定は安定しやすく、stabilityBiasを上げるほど判定幅が広がります。");
    }
    if (owns("hint_pairmap")) {
      lines.push("章別: Chapter1はsafe寄り、Chapter2はbalanced、Chapter3はgreedy寄りが当たりやすい傾向です。");
    }
    if (owns("module_phase_lens")) {
      lines.push("Phase Lens有効: entropyGateを40〜70に収めると中心推定のブレを抑えられます。");
    }
    if (owns("module_side_trace")) {
      lines.push("Side Trace有効: probeBudget 3以上で副次シグナル補正が効き、中心推定が寄りやすくなります。");
    }
    if (owns("module_width_patch")) {
      lines.push("Width Patch有効: 同じ設定でも認証幅が拡張され、目押し成功率が上がります。");
    }
    if (owns("module_deep_decoder")) {
      lines.push("Deep Decoder有効: 推定中心の収束率が高く、再現性が上がります。");
    }
    return lines;
  }

  function renderHintConsole() {
    if (!el.hintConsole) return;
    const lines = buildHintLines();
    if (!lines.length) {
      el.hintConsole.textContent = "ヒント未購入: ストアでヒントを買うと、ここに攻略情報が増えていきます。";
      return;
    }
    el.hintConsole.innerHTML = lines.map((line) => `<div>• ${line}</div>`).join("");
  }

  function updateSnippetButtons() {
    if (el.applySafeBtn) el.applySafeBtn.disabled = !owns("snippet_safe");
    if (el.applyRushBtn) el.applyRushBtn.disabled = !owns("snippet_rush");
  }

  function renderStore() {
    if (el.pointPill) {
      el.pointPill.textContent = `所持ポイント: ${playerPoints}pt（実行1回コスト ${HACK_COST}pt）`;
    }

    if (el.storeList) {
      const cards = STORE_ITEMS.map((item) => {
        const owned = owns(item.id);
        const affordable = playerPoints >= item.cost;
        const disabled = owned || !affordable;
        const buttonLabel = owned ? "購入済み" : affordable ? "購入する" : "pt不足";
        return `
          <div class="store-card ${owned ? "owned" : ""}">
            <div class="store-head">
              <span class="store-name">${item.name}</span>
              <span class="store-cost">${item.cost}pt</span>
            </div>
            <div class="store-desc">${item.description}</div>
            <button data-buy-id="${item.id}" ${disabled ? "disabled" : ""}>${buttonLabel}</button>
          </div>
        `;
      }).join("");
      el.storeList.innerHTML = cards;
    }

    renderOwnedList();
    renderHintConsole();
    updateSnippetButtons();
  }

  function purchaseItem(itemId) {
    const item = STORE_ITEMS.find((v) => v.id === itemId);
    if (!item) return;
    if (owns(item.id)) {
      setStatus(`${item.name} はすでに購入済みです。`, "warn");
      setLog(`購入済み: ${item.name}`, "warn");
      return;
    }
    if (playerPoints < item.cost) {
      setStatus(`ポイント不足です。必要 ${item.cost}pt / 現在 ${playerPoints}pt`, "warn");
      setLog(`購入失敗: ${item.name} (${item.cost}pt) / 所持 ${playerPoints}pt`, "warn");
      return;
    }

    playerPoints -= item.cost;
    storeState.purchased.push(item.id);
    storeState = sanitizeStoreState(storeState);
    saveStoreState();
    writeProgressScore(playerPoints);
    renderStore();

    const checked = validateEditor({ silentSuccess: true });
    if (!checked) {
      const fallback = cloneDefaultPlan();
      if (el.code) el.code.value = formatPlan(fallback);
      renderPreview(compilePlan(fallback));
    }

    setStatus(`${item.name} を購入しました。-${item.cost}pt（残り ${playerPoints}pt）。`);
    setLog(`購入成功: ${item.name} / -${item.cost}pt / 残り ${playerPoints}pt`, "ok");
  }

  function loadTemplate() {
    const plan = cloneDefaultPlan();
    if (el.code) el.code.value = formatPlan(plan);
    const compiled = compilePlan(plan);
    renderPreview(compiled);
    setStatus("HackScript テンプレートを読み込みました。直接指定は禁止なので、関数や代入で間接パラメータを調整してください。");
    setLog("テンプレート読み込み完了。", "ok");
  }

  function applySnippet(kind) {
    const needId = kind === "safe" ? "snippet_safe" : "snippet_rush";
    if (!owns(needId)) {
      setStatus("このコード断片は未購入です。先にストアで購入してください。", "warn");
      setLog(`未購入機能: ${needId}`, "warn");
      return;
    }

    let parsed;
    try {
      parsed = parseEditorPlan();
    } catch (_err) {
      parsed = { plan: cloneDefaultPlan(), meta: { ignoredDirect: [] } };
    }
    const next = parsed.plan;

    for (const key of chapterKeys()) {
      if (kind === "safe") {
        next[key].probeBudget = clamp(next[key].probeBudget + 1, 1, 6);
        next[key].stabilityBias = clamp(next[key].stabilityBias + 18, 0, 100);
        next[key].entropyGate = clamp(mix(next[key].entropyGate, 50, 0.45), 0, 100);
        next[key].focusMode = "safe";
      } else {
        next[key].probeBudget = clamp(next[key].probeBudget + 2, 1, 6);
        next[key].stabilityBias = clamp(next[key].stabilityBias - 10, 0, 100);
        next[key].entropyGate = clamp(next[key].entropyGate + 14, 0, 100);
        next[key].focusMode = "greedy";
      }
    }

    if (el.code) el.code.value = formatPlan(next);
    const compiled = compilePlan(next);
    renderPreview(compiled);
    setStatus(`コード断片 ${kind === "safe" ? "Safe" : "Rush"} を適用しました。検証して保存できます。`);
    setLog(`コード断片適用: ${kind}`, "ok");
  }

  function validateEditor(options = {}) {
    const { silentSuccess = false } = options;
    try {
      const parsed = parseEditorPlan();
      if (el.code) el.code.value = formatPlan(parsed.plan);
      const compiled = compilePlan(parsed.plan);
      renderPreview(compiled);

      if (parsed.meta.legacyJson) {
        setStatus("旧JSON形式を HackScript に変換しました。次回からはコード風の記法で編集してください。", "warn");
        setLog("旧JSON形式を検出し、HackScriptへ自動変換しました。", "warn");
      } else if (parsed.meta.ignoredDirect.length) {
        setStatus("検証OK。ただし sweetLeft/sweetWidth の直接指定は無効化されました。", "warn");
        setLog(`無効化された直接指定: ${parsed.meta.ignoredDirect.join(", ")}`, "warn");
      } else if (!silentSuccess) {
        setStatus("検証OK。保存すると本編に反映されます。");
        setLog("検証成功。プレビューを更新しました。", "ok");
      }
      return { parsed, compiled };
    } catch (err) {
      setStatus(String(err.message || err), "warn");
      setLog(String(err.message || err), "warn");
      return null;
    }
  }

  function saveAndBack() {
    const checked = validateEditor();
    if (!checked) return;
    localStorage.setItem(HACK_PLAN_KEY, formatPlan(checked.parsed.plan));
    localStorage.setItem(HACK_SETTINGS_KEY, formatRuntime(checked.compiled.runtime));
    setStatus("保存完了。本編へ戻って目押し体感の変化を確認してください。");
    setLog("保存成功。ゲームへ戻ります。", "ok");
    setTimeout(() => {
      window.location.href = "/";
    }, 700);
  }

  function bindEvents() {
    if (el.loadTemplateBtn) {
      el.loadTemplateBtn.addEventListener("click", () => {
        loadTemplate();
      });
    }

    if (el.validateBtn) {
      el.validateBtn.addEventListener("click", () => {
        validateEditor();
      });
    }

    if (el.saveBtn) {
      el.saveBtn.addEventListener("click", () => {
        saveAndBack();
      });
    }

    if (el.applySafeBtn) {
      el.applySafeBtn.addEventListener("click", () => {
        applySnippet("safe");
      });
    }

    if (el.applyRushBtn) {
      el.applyRushBtn.addEventListener("click", () => {
        applySnippet("rush");
      });
    }

    if (el.storeList) {
      el.storeList.addEventListener("click", (event) => {
        const btn = event.target instanceof Element ? event.target.closest("button[data-buy-id]") : null;
        if (!btn) return;
        const id = String(btn.getAttribute("data-buy-id") || "");
        if (!id) return;
        purchaseItem(id);
      });
    }

    window.addEventListener("storage", (ev) => {
      if (ev.key === GAME_PROGRESS_KEY) {
        playerPoints = readProgressScore();
        renderStore();
        return;
      }
      if (ev.key === HACK_STORE_KEY) {
        storeState = readStoreState();
        renderStore();
        return;
      }
      if (ev.key === HACK_SECRET_KEY) {
        secretMap = readSecretMap();
        const checked = validateEditor({ silentSuccess: true });
        if (!checked) {
          renderPreview(compilePlan(cloneDefaultPlan()));
        }
      }
    });
  }

  function init() {
    secretMap = readSecretMap();
    storeState = readStoreState();
    playerPoints = readProgressScore();

    const plan = readSavedPlan();
    if (el.code) {
      el.code.value = formatPlan(plan);
    }
    renderPreview(compilePlan(plan));
    renderStore();

    if (playerPoints < HACK_COST) {
      setStatus(
        `所持ポイントが ${playerPoints}pt のため新規購入は不可です。ゲーム本編でポイントを増やすか、再スタートしてください。`,
        "warn"
      );
    } else {
      setStatus("現在の HackScript 計画を読み込みました。直接指定は禁止、ストア購入で段階的に強化できます。");
    }
    setLog("初期化完了。", "ok");
    bindEvents();
  }

  init();
})();
