const fontFamily = `Inter, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
const weeklyDefaultImageSrc = "assets/weekly-sticker.png";
const weeklyDefaultImageId = "default";
const weeklyImageDbName = "video-cover-generator";
const weeklyImageStoreName = "weekly-images";
const legacyWeeklyImageCacheKey = "video-cover-generator.weekly-image";
const defaultImageStatesByType = {
  "talking-head": {
    "16x9": { scale: 1, offsetX: 0, offsetY: 0 },
    "4x3": { scale: 1, offsetX: 0, offsetY: 0 },
    "3x4": { scale: 1, offsetX: 0, offsetY: 0 },
  },
  weekly: {
    "16x9": { scale: 1, offsetX: 186, offsetY: -160 },
    "4x3": { scale: 1, offsetX: 246, offsetY: 193 },
    "3x4": { scale: 1, offsetX: 288, offsetY: -300 },
  },
  tutorial: {
    "16x9": { scale: 1, offsetX: 0, offsetY: 0 },
    "4x3": { scale: 1, offsetX: 0, offsetY: 0 },
    "3x4": { scale: 1, offsetX: 0, offsetY: 0 },
  },
};

const layoutBase = {
  "16x9": { key: "16x9", label: "16:9", width: 1440, height: 810 },
  "4x3": { key: "4x3", label: "4:3", width: 1440, height: 1080 },
  "3x4": { key: "3x4", label: "3:4", width: 1080, height: 1440 },
};

const layouts = {
  "talking-head": {
    "16x9": {
      ...layoutBase["16x9"],
      mode: "horizontal",
      imageBox: { x: 0.5, y: 0, width: 0.5, height: 1 },
      textBox: { x: 0.06, y: 0.19, width: 0.59, height: 0.56 },
      mask: { solidUntil: 0.5, fadeUntil: 0.6 },
    },
    "4x3": {
      ...layoutBase["4x3"],
      mode: "horizontal",
      imageBox: { x: 0.5, y: 0, width: 0.5, height: 1 },
      textBox: { x: 0.07, y: 0.2, width: 0.58, height: 0.54 },
      mask: { solidUntil: 0.5, fadeUntil: 0.6 },
    },
    "3x4": {
      ...layoutBase["3x4"],
      mode: "vertical",
      imageBox: { x: 0, y: 0, width: 1, height: 1 },
      subjectBox: { x: 0, y: 0, width: 1, height: 0.6 },
      textBox: { x: 0.08, y: 0.68, width: 0.84, height: 0.24 },
      mask: { fadeStart: 0.4, fadeEnd: 1 },
    },
  },
  weekly: {
    "16x9": {
      ...layoutBase["16x9"],
      headerBox: { x: 0.07, y: 0.09, width: 0.45, height: 0.16 },
      titleBox: { x: 0.07, y: 0.31, width: 0.66, height: 0.34 },
      subtitleBox: { x: 0.07, y: 0.66, width: 0.58, height: 0.12 },
      avatarBox: { x: 0.63, y: 0.26, width: 0.33, height: 0.63 },
    },
    "4x3": {
      ...layoutBase["4x3"],
      headerBox: { x: 0.08, y: 0.08, width: 0.55, height: 0.15 },
      titleBox: { x: 0.08, y: 0.29, width: 0.72, height: 0.34 },
      subtitleBox: { x: 0.08, y: 0.64, width: 0.62, height: 0.12 },
      avatarBox: { x: 0.55, y: 0.385, width: 0.39, height: 0.525 },
    },
    "3x4": {
      ...layoutBase["3x4"],
      headerBox: { x: 0.08, y: 0.07, width: 0.72, height: 0.13 },
      titleBox: { x: 0.08, y: 0.27, width: 0.78, height: 0.34 },
      subtitleBox: { x: 0.08, y: 0.61, width: 0.72, height: 0.14 },
      avatarBox: { x: 0.41, y: 0.545, width: 0.51, height: 0.375 },
    },
  },
  tutorial: {
    "16x9": {
      ...layoutBase["16x9"],
      screenshotBox: { x: 0.08, y: 0.12, width: 0.84, height: 0.76, radius: 32 },
      textPanel: { x: 0.09, y: 0.14, width: 0.42, height: 0.34, radius: 24 },
    },
    "4x3": {
      ...layoutBase["4x3"],
      screenshotBox: { x: 0.08, y: 0.12, width: 0.84, height: 0.76, radius: 32 },
      textPanel: { x: 0.09, y: 0.13, width: 0.5, height: 0.3, radius: 24 },
    },
    "3x4": {
      ...layoutBase["3x4"],
      screenshotBox: { x: 0.08, y: 0.18, width: 0.84, height: 0.7, radius: 28 },
      textPanel: { x: 0.08, y: 0.08, width: 0.72, height: 0.24, radius: 22 },
    },
  },
};

const state = {
  type: "talking-head",
  activeLayout: "16x9",
  image: null,
  imageName: "",
  imagesByType: {
    "talking-head": { image: null, name: "" },
    weekly: { image: null, name: "" },
    tutorial: { image: null, name: "" },
  },
  title: "用一个系统跑通内容生产",
  subtitle: "从选题到发布的可复用工作流",
  titleSize: 100,
  subtitleSize: 100,
  weekLabel: "2026-06-W3",
  weeklyImageLibrary: [],
  weeklySelectedImageId: weeklyDefaultImageId,
  imageStates: {
    "talking-head": {},
    weekly: {},
    tutorial: {},
  },
  showSafeArea: false,
};

const els = {
  imageInput: document.querySelector("#imageInput"),
  uploadText: document.querySelector("#uploadText"),
  message: document.querySelector("#message"),
  titleInput: document.querySelector("#titleInput"),
  subtitleInput: document.querySelector("#subtitleInput"),
  weeklyLibraryField: document.querySelector("#weeklyLibraryField"),
  weeklyImageGrid: document.querySelector("#weeklyImageGrid"),
  titleSizeInput: document.querySelector("#titleSizeInput"),
  subtitleSizeInput: document.querySelector("#subtitleSizeInput"),
  titleSizeOutput: document.querySelector("#titleSizeOutput"),
  subtitleSizeOutput: document.querySelector("#subtitleSizeOutput"),
  weekInput: document.querySelector("#weekInput"),
  weekField: document.querySelector("#weekField"),
  scaleInput: document.querySelector("#scaleInput"),
  offsetXInput: document.querySelector("#offsetXInput"),
  offsetYInput: document.querySelector("#offsetYInput"),
  scaleOutput: document.querySelector("#scaleOutput"),
  offsetXOutput: document.querySelector("#offsetXOutput"),
  offsetYOutput: document.querySelector("#offsetYOutput"),
  resetImageButton: document.querySelector("#resetImageButton"),
  safeAreaButton: document.querySelector("#safeAreaButton"),
  mainCanvas: document.querySelector("#mainCanvas"),
  emptyState: document.querySelector("#emptyState"),
  activeLayoutLabel: document.querySelector("#activeLayoutLabel"),
  adjustLayoutLabel: document.querySelector("#adjustLayoutLabel"),
  preview16x9: document.querySelector("#preview16x9"),
  preview4x3: document.querySelector("#preview4x3"),
  preview3x4: document.querySelector("#preview3x4"),
  downloadCombinedButton: document.querySelector("#downloadCombinedButton"),
  download16x9Button: document.querySelector("#download16x9Button"),
  download4x3Button: document.querySelector("#download4x3Button"),
  download3x4Button: document.querySelector("#download3x4Button"),
};

const previewCanvases = {
  "16x9": els.preview16x9,
  "4x3": els.preview4x3,
  "3x4": els.preview3x4,
};

function defaultImageState(type = state.type, layoutKey = state.activeLayout) {
  return { ...(defaultImageStatesByType[type]?.[layoutKey] || { scale: 1, offsetX: 0, offsetY: 0 }) };
}

function getImageState(layoutKey, type = state.type) {
  if (!state.imageStates[type]) {
    state.imageStates[type] = {};
  }
  if (!state.imageStates[type][layoutKey]) {
    state.imageStates[type][layoutKey] = defaultImageState(type, layoutKey);
  }
  return state.imageStates[type][layoutKey];
}

function getActiveImageState() {
  return getImageState(state.activeLayout, state.type);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rectFromRatio(layout, box) {
  return {
    x: box.x * layout.width,
    y: box.y * layout.height,
    w: box.width * layout.width,
    h: box.height * layout.height,
    radius: box.radius || 0,
  };
}

function splitTextTokens(text) {
  const normalized = String(text || "").replace(/\r\n?/g, "\n").replace(/[^\S\n]+/g, " ").trim();
  const tokens = [];
  let buffer = "";

  for (const char of normalized) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push(char);
    } else if (char === " ") {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push(" ");
    } else if (char === "\n") {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push("\n");
    } else {
      buffer += char;
    }
  }

  if (buffer) tokens.push(buffer);
  return tokens.filter((token, index, arr) => token !== " " || (index > 0 && arr[index - 1] !== " " && arr[index - 1] !== "\n"));
}

function wrapText(ctx, text, maxWidth, maxLines) {
  const tokens = splitTextTokens(text);
  const lines = [];
  let line = "";

  tokens.forEach((token) => {
    if (token === "\n") {
      lines.push(line.trim());
      line = "";
      return;
    }

    const probe = line + token;
    if (ctx.measureText(probe).width <= maxWidth || !line) {
      line = probe;
      return;
    }

    lines.push(line.trim());
    line = token.trimStart();
  });

  if (line) lines.push(line.trim());
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[kept.length - 1] || "";
    while (last.length && ctx.measureText(`${last}...`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    kept[kept.length - 1] = `${last}...`;
    return kept;
  }

  return lines;
}

function setFont(ctx, size, weight = 700) {
  ctx.font = `${weight} ${size}px ${fontFamily}`;
}

function fitText(ctx, text, options) {
  const { maxWidth, maxHeight, maxLines, maxSize, minSize, weight, lineHeight } = options;
  let size = maxSize;
  let lines = [];

  while (size >= minSize) {
    setFont(ctx, size, weight);
    lines = wrapText(ctx, text, maxWidth, maxLines);
    const height = lines.length * size * lineHeight;
    if (height <= maxHeight) break;
    size -= 2;
  }

  return { size, lines };
}

function drawTextLines(ctx, lines, x, y, size, lineHeight, color) {
  ctx.fillStyle = color;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * size * lineHeight);
  });
}

function parseRichText(text) {
  const source = String(text || "");
  const parts = [];
  let inverted = false;
  let buffer = "";

  for (const char of source) {
    if (char === "`") {
      if (buffer) {
        parts.push({ text: buffer, inverted });
        buffer = "";
      }
      inverted = !inverted;
      continue;
    }
    buffer += char;
  }

  if (buffer) parts.push({ text: buffer, inverted });
  return parts;
}

function splitRichTextTokens(text) {
  const normalized = String(text || "").replace(/\r\n?/g, "\n").replace(/[^\S\n]+/g, " ");
  const tokens = [];
  let buffer = "";

  for (const char of normalized) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push(char);
    } else if (char === " ") {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push(" ");
    } else if (char === "\n") {
      if (buffer) {
        tokens.push(buffer);
        buffer = "";
      }
      tokens.push("\n");
    } else {
      buffer += char;
    }
  }

  if (buffer) tokens.push(buffer);
  return tokens.filter((token, index, arr) => token !== " " || (arr[index - 1] !== " " && arr[index - 1] !== "\n"));
}

function richTextTokens(text) {
  return parseRichText(text).flatMap((part) => {
    if (part.inverted) {
      return String(part.text || "")
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .flatMap((segment, index, arr) => {
          const label = segment.replace(/\s+/g, " ").trim();
          const tokens = label ? [{ text: label, inverted: true }] : [];
          if (index < arr.length - 1) tokens.push({ text: "\n", inverted: false });
          return tokens;
        });
    }

    return splitRichTextTokens(part.text).map((token) => ({ text: token, inverted: false }));
  });
}

function lineWidth(ctx, line) {
  return line.reduce((width, token) => width + ctx.measureText(token.text).width, 0);
}

function trimRichLineEnd(line) {
  const trimmed = [...line];
  while (trimmed.length && trimmed[trimmed.length - 1].text === " ") {
    trimmed.pop();
  }
  return trimmed;
}

function trimRichLineStart(line) {
  const trimmed = [...line];
  while (trimmed.length && trimmed[0].text === " ") {
    trimmed.shift();
  }
  return trimmed;
}

function truncateRichLine(ctx, line, maxWidth) {
  const ellipsis = { text: "...", inverted: false };
  const truncated = trimRichLineEnd(line);

  while (truncated.length && lineWidth(ctx, [...truncated, ellipsis]) > maxWidth) {
    const last = truncated[truncated.length - 1];
    if (last.text.length > 1) {
      last.text = last.text.slice(0, -1);
    } else {
      truncated.pop();
    }
  }

  truncated.push(ellipsis);
  return truncated;
}

function wrapRichText(ctx, text, maxWidth, maxLines, truncate = true) {
  const tokens = richTextTokens(text);
  const lines = [];
  let line = [];

  tokens.forEach((token) => {
    if (token.text === "\n") {
      lines.push(trimRichLineEnd(line));
      line = [];
      return;
    }

    if (!line.length && token.text === " ") return;
    const nextLine = [...line, token];
    if (lineWidth(ctx, nextLine) <= maxWidth || !line.length) {
      line = nextLine;
      return;
    }

    lines.push(trimRichLineEnd(line));
    line = token.text === " " ? [] : [token];
  });

  if (line.length) lines.push(trimRichLineEnd(line));
  const normalized = lines.map(trimRichLineStart).filter((item, index, arr) => item.length || (index > 0 && index < arr.length - 1));

  if (!truncate) {
    return normalized;
  }

  if (normalized.length > maxLines) {
    const kept = normalized.slice(0, maxLines);
    kept[kept.length - 1] = truncateRichLine(ctx, kept[kept.length - 1], maxWidth);
    return kept;
  }

  return normalized;
}

function fitRichText(ctx, text, options) {
  const { maxWidth, maxHeight, maxLines, maxSize, minSize, weight, lineHeight } = options;
  let size = maxSize;
  let lines = [];

  while (size >= minSize) {
    setFont(ctx, size, weight);
    lines = wrapRichText(ctx, text, maxWidth, maxLines, false);
    const height = lines.length * size * lineHeight;
    if (lines.length <= maxLines && height <= maxHeight) break;
    size -= 2;
  }

  setFont(ctx, size, weight);
  lines = wrapRichText(ctx, text, maxWidth, maxLines, true);

  return { size, lines };
}

function scaledTextSize(size, percent) {
  return Math.round(size * (Number(percent) || 100) / 100);
}

function scaledMinTextSize(size, percent) {
  return scaledTextSize(size, Math.min(Number(percent) || 100, 100));
}

function drawRichTextLines(ctx, lines, x, y, size, lineHeight, color) {
  const bgPadX = Math.max(8, size * 0.1);
  const bgPadY = Math.max(4, size * 0.08);
  const bgHeight = size + bgPadY * 2;
  const bgTopOffset = size * 0.88 + bgPadY;

  lines.forEach((line, lineIndex) => {
    const baseline = y + lineIndex * size * lineHeight;
    let cursor = x;
    let runStart = null;
    let runWidth = 0;

    line.forEach((token) => {
      const tokenWidth = ctx.measureText(token.text).width;
      if (token.inverted) {
        if (runStart === null) runStart = cursor;
        runWidth += tokenWidth;
      } else if (runStart !== null) {
        roundedRectPath(ctx, runStart - bgPadX, baseline - bgTopOffset, runWidth + bgPadX * 2, bgHeight, Math.max(2, size * 0.04));
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        runStart = null;
        runWidth = 0;
      }
      cursor += tokenWidth;
    });

    if (runStart !== null) {
      roundedRectPath(ctx, runStart - bgPadX, baseline - bgTopOffset, runWidth + bgPadX * 2, bgHeight, Math.max(2, size * 0.04));
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }

    cursor = x;
    line.forEach((token) => {
      ctx.fillStyle = token.inverted ? "#050505" : color;
      ctx.fillText(token.text, cursor, baseline);
      cursor += ctx.measureText(token.text).width;
    });
  });
}

function drawLetterSpacedText(ctx, text, x, y, spacing) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + spacing;
  }
}

function roundedRectPath(ctx, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function clipRoundedRect(ctx, x, y, w, h, radius) {
  roundedRectPath(ctx, x, y, w, h, radius);
  ctx.clip();
}

function drawImageCover(ctx, image, dx, dy, dw, dh, offsetX = 0, offsetY = 0, scale = 1) {
  if (!image) return;
  const effectiveScale = Math.max(1, scale);
  const imageRatio = image.width / image.height;
  const targetRatio = dw / dh;
  let sw = image.width;
  let sh = image.height;

  if (imageRatio > targetRatio) {
    sw = image.height * targetRatio;
  } else {
    sh = image.width / targetRatio;
  }

  sw /= effectiveScale;
  sh /= effectiveScale;
  const sx = clamp((image.width - sw) / 2 - offsetX / scale, 0, image.width - sw);
  const sy = clamp((image.height - sh) / 2 - offsetY / scale, 0, image.height - sh);
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawImageContain(ctx, image, dx, dy, dw, dh, offsetX = 0, offsetY = 0, scale = 1) {
  if (!image) return;
  const ratio = Math.min(dw / image.width, dh / image.height) * scale;
  const w = image.width * ratio;
  const h = image.height * ratio;
  const x = dx + (dw - w) / 2 + offsetX;
  const y = dy + (dh - h) / 2 + offsetY;
  ctx.drawImage(image, x, y, w, h);
}

function fillBase(ctx, layout) {
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, layout.width, layout.height);
}

function drawPlaceholder(ctx, layout) {
  fillBase(ctx, layout);
  const bg = ctx.createLinearGradient(0, 0, layout.width, layout.height);
  bg.addColorStop(0, "#101827");
  bg.addColorStop(1, "#050505");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, layout.width, layout.height);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = Math.max(2, layout.width * 0.002);
  ctx.setLineDash([18, 16]);
  const margin = layout.width * 0.08;
  roundedRectPath(ctx, margin, layout.height * 0.16, layout.width - margin * 2, layout.height * 0.68, 30);
  ctx.stroke();
  ctx.restore();

  setFont(ctx, Math.round(layout.width * 0.045), 900);
  ctx.fillStyle = "#f5f7fb";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("上传参考图后生成封面", layout.width / 2, layout.height / 2);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function renderTalkingHead(ctx, layout, data) {
  const { image, imageState, title, subtitle, titleSize, subtitleSize } = data;
  fillBase(ctx, layout);

  if (layout.mode === "horizontal") {
    const imageBox = rectFromRatio(layout, layout.imageBox);
    drawImageCover(ctx, image, imageBox.x, imageBox.y, imageBox.w, imageBox.h, imageState.offsetX, imageState.offsetY, imageState.scale);

    const solidX = layout.width * layout.mask.solidUntil;
    const fadeX = layout.width * layout.mask.fadeUntil;
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, solidX, layout.height);

    const mask = ctx.createLinearGradient(solidX, 0, fadeX, 0);
    mask.addColorStop(0, "rgba(5,5,5,1)");
    mask.addColorStop(1, "rgba(5,5,5,0)");
    ctx.fillStyle = mask;
    ctx.fillRect(solidX, 0, fadeX - solidX, layout.height);
  } else {
    const imageBox = rectFromRatio(layout, layout.imageBox);
    drawImageCover(ctx, image, imageBox.x, imageBox.y, imageBox.w, imageBox.h, imageState.offsetX, imageState.offsetY, imageState.scale);

    const fadeStart = layout.height * layout.mask.fadeStart;
    const fadeEnd = layout.height * layout.mask.fadeEnd;
    const mask = ctx.createLinearGradient(0, fadeStart, 0, fadeEnd);
    mask.addColorStop(0, "rgba(5,5,5,0)");
    mask.addColorStop(1, "rgba(5,5,5,1)");
    ctx.fillStyle = mask;
    ctx.fillRect(0, fadeStart, layout.width, fadeEnd - fadeStart);
  }

  const box = rectFromRatio(layout, layout.textBox);
  const pad = layout.width * 0.01;
  const titleLineHeight = layout.mode === "vertical" ? 1.3 : 1.38;
  const subLineHeight = 1.48;
  const textGap = layout.height * (layout.mode === "vertical" ? 0.06 : 0.075);
  const hasSubtitle = Boolean(String(subtitle || "").trim());
  const titleFit = fitRichText(ctx, title || "请输入主标题", {
    maxWidth: box.w - pad * 2,
    maxHeight: box.h * 0.7,
    maxLines: 3,
    maxSize: scaledTextSize(layout.mode === "vertical" ? 92 : 96, titleSize),
    minSize: scaledMinTextSize(42, titleSize),
    weight: 900,
    lineHeight: titleLineHeight,
  });
  const subFit = hasSubtitle ? fitRichText(ctx, subtitle, {
    maxWidth: box.w - pad * 2,
    maxHeight: box.h * 0.24,
    maxLines: 2,
    maxSize: scaledTextSize(Math.round(titleFit.size * 0.42), subtitleSize),
    minSize: scaledMinTextSize(28, subtitleSize),
    weight: 700,
    lineHeight: subLineHeight,
  }) : { size: 0, lines: [] };

  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  const titleBlockHeight = titleFit.lines.length * titleFit.size * titleLineHeight;
  const subBlockHeight = subFit.lines.length * subFit.size * subLineHeight;
  const totalTextHeight = titleBlockHeight + (hasSubtitle ? textGap + subBlockHeight : 0);
  const textStartY = layout.mode === "horizontal"
    ? box.y + (box.h - totalTextHeight) / 2
    : box.y;
  setFont(ctx, titleFit.size, 900);
  drawRichTextLines(ctx, titleFit.lines, box.x + pad, textStartY + titleFit.size, titleFit.size, titleLineHeight, "#ffffff");
  if (hasSubtitle) {
    setFont(ctx, subFit.size, 700);
    const subY = textStartY + titleBlockHeight + textGap + subFit.size;
    drawRichTextLines(ctx, subFit.lines, box.x + pad, subY, subFit.size, subLineHeight, "rgba(255,255,255,0.82)");
  }
  ctx.shadowColor = "transparent";
}

function renderWeekly(ctx, layout, data) {
  const { image, imageState, title, subtitle, titleSize: titleSizePercent, subtitleSize, weekLabel } = data;
  const bg = ctx.createLinearGradient(0, 0, layout.width, layout.height);
  bg.addColorStop(0, "#0b1020");
  bg.addColorStop(0.55, "#111827");
  bg.addColorStop(1, "#050505");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, layout.width, layout.height);

  const glow = ctx.createRadialGradient(layout.width * 0.82, layout.height * 0.72, 0, layout.width * 0.82, layout.height * 0.72, layout.width * 0.38);
  glow.addColorStop(0, "rgba(45,212,191,0.26)");
  glow.addColorStop(0.42, "rgba(59,130,246,0.12)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, layout.width, layout.height);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  const step = Math.round(layout.width * 0.045);
  for (let x = -step; x < layout.width + step; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + layout.height * 0.35, layout.height);
    ctx.stroke();
  }
  ctx.restore();

  const header = rectFromRatio(layout, layout.headerBox);
  const titleBox = rectFromRatio(layout, layout.titleBox);
  const subtitleBox = rectFromRatio(layout, layout.subtitleBox);
  const avatar = rectFromRatio(layout, layout.avatarBox);
  const baseTitleSize = clamp(layout.width * 0.076, 72, 118);
  const headerSize = layout.key === "3x4" ? baseTitleSize * 1.5 : baseTitleSize;

  setFont(ctx, Math.round(headerSize * 0.31), 800);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  drawLetterSpacedText(ctx, "OPC WEEKLY", header.x, header.y + headerSize * 0.28, Math.max(5, layout.width * 0.004));

  setFont(ctx, Math.round(headerSize * 0.5), 900);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(weekLabel || "2026-06-W3", header.x, header.y + headerSize * 0.82);

  const titleLineHeight = 1.15;
  const subLineHeight = 1.3;
  const textGap = layout.height * 0.075;
  const hasSubtitle = Boolean(String(subtitle || "").trim());
  const mainFit = fitRichText(ctx, title || "请输入主标题", {
    maxWidth: titleBox.w,
    maxHeight: titleBox.h,
    maxLines: 2,
    maxSize: scaledTextSize(Math.round(baseTitleSize), titleSizePercent),
    minSize: scaledMinTextSize(46, titleSizePercent),
    weight: 900,
    lineHeight: titleLineHeight,
  });
  setFont(ctx, mainFit.size, 900);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  drawRichTextLines(ctx, mainFit.lines, titleBox.x, titleBox.y + mainFit.size, mainFit.size, titleLineHeight, "#ffffff");

  const titleBlockHeight = mainFit.lines.length * mainFit.size * titleLineHeight;
  const subFit = hasSubtitle ? fitRichText(ctx, subtitle, {
    maxWidth: subtitleBox.w,
    maxHeight: subtitleBox.h,
    maxLines: 2,
    maxSize: scaledTextSize(Math.round(mainFit.size * 0.42), subtitleSize),
    minSize: scaledMinTextSize(28, subtitleSize),
    weight: 700,
    lineHeight: subLineHeight,
  }) : { size: 0, lines: [] };
  if (hasSubtitle) {
    setFont(ctx, subFit.size, 700);
    const subY = titleBox.y + titleBlockHeight + textGap + subFit.size;
    drawRichTextLines(ctx, subFit.lines, titleBox.x, subY, subFit.size, subLineHeight, "rgba(255,255,255,0.78)");
  }
  ctx.shadowColor = "transparent";

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.44)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 18;
  drawImageContain(ctx, image, avatar.x, avatar.y, avatar.w, avatar.h, imageState.offsetX * 0.25, imageState.offsetY * 0.25, imageState.scale);
  ctx.restore();

  const vignette = ctx.createRadialGradient(layout.width / 2, layout.height / 2, layout.width * 0.2, layout.width / 2, layout.height / 2, layout.width * 0.76);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, layout.width, layout.height);
}

function renderTutorial(ctx, layout, data) {
  const { image, imageState, title, subtitle, titleSize, subtitleSize } = data;
  fillBase(ctx, layout);
  ctx.save();
  ctx.filter = "blur(36px) brightness(55%) saturate(80%) contrast(90%)";
  drawImageCover(ctx, image, -60, -60, layout.width + 120, layout.height + 120, imageState.offsetX * 0.2, imageState.offsetY * 0.2, 1);
  ctx.restore();

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(0, 0, layout.width, layout.height);

  const shot = rectFromRatio(layout, layout.screenshotBox);
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.52)";
  ctx.shadowBlur = 42;
  ctx.shadowOffsetY = 22;
  roundedRectPath(ctx, shot.x, shot.y, shot.w, shot.h, shot.radius);
  ctx.fillStyle = "#0c0f15";
  ctx.fill();
  ctx.restore();

  ctx.save();
  clipRoundedRect(ctx, shot.x, shot.y, shot.w, shot.h, shot.radius);
  if (layout.key === "3x4") {
    drawImageCover(ctx, image, shot.x, shot.y, shot.w, shot.h, imageState.offsetX, imageState.offsetY, imageState.scale);
  } else {
    drawImageContain(ctx, image, shot.x, shot.y, shot.w, shot.h, imageState.offsetX, imageState.offsetY, imageState.scale);
  }
  ctx.restore();

  roundedRectPath(ctx, shot.x, shot.y, shot.w, shot.h, shot.radius);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const panelSeed = rectFromRatio(layout, layout.textPanel);
  const panelInset = Math.max(18, layout.width * 0.018);
  const panelX = Math.max(panelSeed.x, shot.x + panelInset);
  const panelMaxW = Math.max(260, shot.x + shot.w - panelX - panelInset);
  const padX = Math.min(layout.width * 0.035, 48);
  const padY = Math.min(layout.height * 0.055, 48);
  const titleLineHeight = 1.06;
  const subLineHeight = 1.22;
  const textGap = layout.height * (layout.key === "3x4" ? 0.032 : 0.075);
  const hasSubtitle = Boolean(String(subtitle || "").trim());
  const titleFit = fitRichText(ctx, title || "请输入主标题", {
    maxWidth: panelMaxW - padX * 2,
    maxHeight: shot.h * (hasSubtitle ? 0.42 : 0.58),
    maxLines: 2,
    maxSize: scaledTextSize(layout.key === "3x4" ? 72 : 76, titleSize),
    minSize: scaledMinTextSize(34, titleSize),
    weight: 900,
    lineHeight: titleLineHeight,
  });
  const subFit = hasSubtitle ? fitRichText(ctx, subtitle, {
    maxWidth: panelMaxW - padX * 2,
    maxHeight: shot.h * 0.24,
    maxLines: 2,
    maxSize: scaledTextSize(Math.round(titleFit.size * 0.42), subtitleSize),
    minSize: scaledMinTextSize(24, subtitleSize),
    weight: 700,
    lineHeight: subLineHeight,
  }) : { size: 0, lines: [] };
  const getRichLinesWidth = (lines, size, weight) => {
    setFont(ctx, size, weight);
    return lines.reduce((max, line) => Math.max(max, lineWidth(ctx, line)), 0);
  };
  const titleTextW = getRichLinesWidth(titleFit.lines, titleFit.size, 900);
  const subTextW = getRichLinesWidth(subFit.lines, subFit.size, 700);
  const panelW = clamp(Math.ceil(Math.max(titleTextW, subTextW) + padX * 2), 260, panelMaxW);
  const titleBlockHeight = titleFit.lines.length * titleFit.size * titleLineHeight;
  const subBlockHeight = subFit.lines.length * subFit.size * subLineHeight;
  const textBlockHeight = titleBlockHeight + (hasSubtitle ? textGap + subBlockHeight : 0);
  const panelH = Math.min(Math.ceil(textBlockHeight + padY * 2), shot.h - panelInset * 2);
  const panel = {
    x: panelX,
    y: layout.key === "3x4"
      ? panelSeed.y
      : shot.y + (shot.h - panelH) / 2,
    w: panelW,
    h: panelH,
    radius: panelSeed.radius,
  };

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.48)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 14;
  roundedRectPath(ctx, panel.x, panel.y, panel.w, panel.h, panel.radius);
  ctx.fillStyle = "rgba(0,0,0,0.62)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  setFont(ctx, titleFit.size, 900);
  const textStartY = panel.y + (panel.h - textBlockHeight) / 2;
  const startY = textStartY + titleFit.size;
  drawRichTextLines(ctx, titleFit.lines, panel.x + padX, startY, titleFit.size, titleLineHeight, "#ffffff");
  if (hasSubtitle) {
    setFont(ctx, subFit.size, 700);
    const subY = textStartY + titleBlockHeight + textGap + subFit.size;
    drawRichTextLines(ctx, subFit.lines, panel.x + padX, subY, subFit.size, subLineHeight, "rgba(255,255,255,0.8)");
  }
}

function drawSafeAreas(ctx, layout) {
  ctx.save();
  ctx.lineWidth = Math.max(2, layout.width * 0.002);
  ctx.setLineDash([14, 10]);
  ctx.font = `800 ${Math.max(18, layout.width * 0.018)}px ${fontFamily}`;
  ctx.textBaseline = "top";

  const drawBox = (box, label, color) => {
    const rect = rectFromRatio(layout, box);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    roundedRectPath(ctx, rect.x, rect.y, rect.w, rect.h, rect.radius || 14);
    ctx.stroke();
    ctx.fillText(label, rect.x + 14, rect.y + 12);
  };

  if (state.type === "talking-head") {
    drawBox(layout.textBox, "文字安全区", "rgba(45,212,191,0.85)");
    drawBox(layout.subjectBox || layout.imageBox, "图片主体区", "rgba(96,165,250,0.85)");
  } else if (state.type === "weekly") {
    drawBox(layout.headerBox, "栏目区", "rgba(45,212,191,0.85)");
    drawBox(layout.titleBox, "主标题区", "rgba(96,165,250,0.85)");
    drawBox(layout.subtitleBox, "副标题区", "rgba(167,139,250,0.85)");
    drawBox(layout.avatarBox, "头像区", "rgba(251,191,36,0.85)");
  } else {
    drawBox(layout.screenshotBox, "截图区", "rgba(96,165,250,0.85)");
    drawBox(layout.textPanel, "标题文案块", "rgba(45,212,191,0.85)");
  }

  ctx.restore();
}

function renderCover(type, layoutKey, data, options = {}) {
  const layout = layouts[type][layoutKey];
  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;
  const ctx = canvas.getContext("2d");
  const renderData = { ...data, imageState: getImageState(layoutKey, type) };

  if (!renderData.image) {
    drawPlaceholder(ctx, layout);
    return canvas;
  }

  if (type === "talking-head") renderTalkingHead(ctx, layout, renderData);
  if (type === "weekly") renderWeekly(ctx, layout, renderData);
  if (type === "tutorial") renderTutorial(ctx, layout, renderData);
  if (options.safeArea) drawSafeAreas(ctx, layout);

  return canvas;
}

function copyCanvas(source, target) {
  target.width = source.width;
  target.height = source.height;
  const ctx = target.getContext("2d");
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.drawImage(source, 0, 0);
}

function fitMainCanvasToStage() {
  const stage = els.mainCanvas.parentElement;
  if (!stage || !els.mainCanvas.width || !els.mainCanvas.height) return;

  const styles = window.getComputedStyle(stage);
  const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const availableWidth = Math.max(1, stage.clientWidth - paddingX);
  const availableHeight = Math.max(1, stage.clientHeight - paddingY);
  const scale = Math.min(
    availableWidth / els.mainCanvas.width,
    availableHeight / els.mainCanvas.height,
    1,
  );

  els.mainCanvas.style.width = `${Math.floor(els.mainCanvas.width * scale)}px`;
  els.mainCanvas.style.height = `${Math.floor(els.mainCanvas.height * scale)}px`;
}

function renderCombinedCanvas(canvas16x9, canvas4x3, canvas3x4) {
  const combined = document.createElement("canvas");
  combined.width = 1440;
  combined.height = 3330;
  const ctx = combined.getContext("2d");
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, combined.width, combined.height);
  ctx.drawImage(canvas16x9, 0, 0);
  ctx.drawImage(canvas4x3, 0, 810);
  ctx.drawImage(canvas3x4, (1440 - 1080) / 2, 810 + 1080);
  return combined;
}

function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

function getRenderedSet() {
  return {
    "16x9": renderCover(state.type, "16x9", state),
    "4x3": renderCover(state.type, "4x3", state),
    "3x4": renderCover(state.type, "3x4", state),
  };
}

function updateOutputs() {
  const activeImageState = getActiveImageState();
  els.scaleInput.value = activeImageState.scale;
  els.offsetXInput.value = activeImageState.offsetX;
  els.offsetYInput.value = activeImageState.offsetY;
  els.scaleOutput.value = Number(activeImageState.scale).toFixed(2);
  els.offsetXOutput.value = Math.round(activeImageState.offsetX);
  els.offsetYOutput.value = Math.round(activeImageState.offsetY);
  els.titleSizeInput.value = state.titleSize;
  els.subtitleSizeInput.value = state.subtitleSize;
  els.titleSizeOutput.value = `${Math.round(state.titleSize)}%`;
  els.subtitleSizeOutput.value = `${Math.round(state.subtitleSize)}%`;
  els.weekField.hidden = state.type !== "weekly";
  els.weeklyLibraryField.hidden = state.type !== "weekly";
  els.safeAreaButton.textContent = state.showSafeArea ? "隐藏安全区" : "显示安全区";
  els.safeAreaButton.setAttribute("aria-pressed", String(state.showSafeArea));

  const activeLayout = layouts[state.type][state.activeLayout];
  els.activeLayoutLabel.textContent = `${activeLayout.label} · ${activeLayout.width} × ${activeLayout.height}`;
  els.adjustLayoutLabel.textContent = `当前：${activeLayout.label}`;

  document.querySelectorAll(".type-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.type === state.type);
  });
  document.querySelectorAll(".layout-tab, .preview-card, .adjust-layout-button").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.layout === state.activeLayout);
  });

  const hasImage = Boolean(state.image);
  els.emptyState.classList.toggle("is-hidden", hasImage);
  [els.downloadCombinedButton, els.download16x9Button, els.download4x3Button, els.download3x4Button].forEach((button) => {
    button.disabled = !hasImage;
  });
}

function renderAll() {
  updateOutputs();

  ["16x9", "4x3", "3x4"].forEach((key) => {
    const canvas = renderCover(state.type, key, state);
    copyCanvas(canvas, previewCanvases[key]);
  });

  const main = renderCover(state.type, state.activeLayout, state, { safeArea: state.showSafeArea });
  copyCanvas(main, els.mainCanvas);
  fitMainCanvasToStage();
}

function setMessage(text) {
  els.message.textContent = text || "";
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function loadImageFromBlob(blob) {
  const url = URL.createObjectURL(blob);
  return loadImageElement(url).finally(() => URL.revokeObjectURL(url));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char]);
}

function setCurrentImage(image, name, type = state.type) {
  const nextImageState = { image, name };
  if (type === "talking-head" || type === "tutorial") {
    state.imagesByType["talking-head"] = nextImageState;
    state.imagesByType.tutorial = nextImageState;
  } else {
    state.imagesByType[type] = nextImageState;
  }

  if (state.type === type) {
    state.image = image;
    state.imageName = name;
    els.uploadText.textContent = name || "上传 PNG / JPG / WEBP";
  }
}

function loadImageFromSource(src, name, type = state.type) {
  return loadImageElement(src).then((image) => {
    setCurrentImage(image, name, type);
    setMessage("");
    if (state.type === type) renderAll();
    return image;
  });
}

function openWeeklyImageDb() {
  if (!window.indexedDB) {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(weeklyImageDbName, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(weeklyImageStoreName)) {
        db.createObjectStore(weeklyImageStoreName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function weeklyImageStore(mode, callback) {
  return openWeeklyImageDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(weeklyImageStoreName, mode);
    const store = tx.objectStore(weeklyImageStoreName);
    const request = callback(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  }));
}

function loadWeeklyImageLibrary() {
  return weeklyImageStore("readonly", (store) => store.getAll())
    .then((items) => {
      state.weeklyImageLibrary.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
      state.weeklyImageLibrary = items
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
        .map((item) => ({ ...item, previewUrl: URL.createObjectURL(item.blob) }));
      renderWeeklyImageLibrary();
    })
    .catch(() => {
      state.weeklyImageLibrary = [];
      renderWeeklyImageLibrary();
    });
}

function saveWeeklyImageRecord(record) {
  return weeklyImageStore("readwrite", (store) => store.put(record));
}

function deleteWeeklyImageRecord(id) {
  return weeklyImageStore("readwrite", (store) => store.delete(id));
}

function weeklyImageItems() {
  return [
    {
      id: weeklyDefaultImageId,
      name: "默认图",
      previewUrl: weeklyDefaultImageSrc,
      removable: false,
    },
    ...state.weeklyImageLibrary.map((item) => ({
      id: item.id,
      name: item.name || "周报图",
      previewUrl: item.previewUrl,
      removable: true,
    })),
  ];
}

function renderWeeklyImageLibrary() {
  if (!els.weeklyImageGrid) return;

  els.weeklyImageGrid.innerHTML = weeklyImageItems().map((item) => `
    <div class="weekly-image-item${item.id === state.weeklySelectedImageId ? " is-active" : ""}" data-weekly-image-id="${escapeHtml(item.id)}" role="button" tabindex="0" aria-pressed="${item.id === state.weeklySelectedImageId}">
      ${item.removable ? `<button class="weekly-delete-button" data-delete-weekly-image="${escapeHtml(item.id)}" type="button" aria-label="删除 ${escapeHtml(item.name)}">×</button>` : ""}
      <img src="${escapeHtml(item.previewUrl)}" alt="${escapeHtml(item.name)}" />
      <span class="weekly-image-name">${escapeHtml(item.name)}</span>
    </div>
  `).join("");
}

function selectWeeklyDefaultImage() {
  state.weeklySelectedImageId = weeklyDefaultImageId;
  return loadImageFromSource(weeklyDefaultImageSrc, "默认周报贴纸", "weekly").then(() => {
    renderWeeklyImageLibrary();
  });
}

function selectWeeklyLibraryImage(id) {
  if (id === weeklyDefaultImageId) {
    selectWeeklyDefaultImage();
    return;
  }

  const item = state.weeklyImageLibrary.find((entry) => entry.id === id);
  if (!item) return;

  loadImageFromBlob(item.blob)
    .then((image) => {
      state.weeklySelectedImageId = id;
      setCurrentImage(image, item.name || "周报图", "weekly");
      setMessage("");
      renderWeeklyImageLibrary();
      renderAll();
    })
    .catch(() => setMessage("图片加载失败，请重新上传"));
}

function saveWeeklyImageFile(file) {
  const id = `weekly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    id,
    name: file.name || "周报图",
    blob: file,
    createdAt: Date.now(),
  };

  saveWeeklyImageRecord(record)
    .then(() => loadImageFromBlob(file))
    .then((image) => {
      const item = { ...record, previewUrl: URL.createObjectURL(file) };
      state.weeklyImageLibrary = [
        item,
        ...state.weeklyImageLibrary.filter((entry) => entry.id !== id),
      ];
      state.weeklySelectedImageId = id;
      setCurrentImage(image, record.name, "weekly");
      setMessage("");
      renderWeeklyImageLibrary();
      renderAll();
    })
    .catch(() => setMessage("浏览器图片库不可用，请重新上传"));
}

function deleteWeeklyLibraryImage(id) {
  const item = state.weeklyImageLibrary.find((entry) => entry.id === id);
  if (!item) return;

  deleteWeeklyImageRecord(id)
    .then(() => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      state.weeklyImageLibrary = state.weeklyImageLibrary.filter((entry) => entry.id !== id);
      if (state.weeklySelectedImageId === id) {
        selectWeeklyDefaultImage();
        return;
      }
      renderWeeklyImageLibrary();
    })
    .catch(() => setMessage("删除失败，请稍后再试"));
}

function syncImageForType() {
  const current = state.imagesByType[state.type];
  state.image = current?.image || null;
  state.imageName = current?.name || "";
  els.uploadText.textContent = state.imageName || "上传 PNG / JPG / WEBP";
}

function ensureWeeklyImage() {
  const weeklyImage = state.imagesByType.weekly;
  if (weeklyImage.image) {
    syncImageForType();
    renderAll();
    return;
  }

  try {
    window.localStorage.removeItem(legacyWeeklyImageCacheKey);
  } catch {
    // Ignore unavailable storage; weekly now falls back to the bundled default image.
  }
  state.image = null;
  state.imageName = "";
  els.uploadText.textContent = "正在加载周报贴纸...";
  renderAll();
  selectWeeklyDefaultImage().catch(() => {
    setMessage("图片加载失败，请重新上传");
  });
}

function updateImageStateFromInputs() {
  if (!state.imageStates[state.type]) {
    state.imageStates[state.type] = {};
  }
  state.imageStates[state.type][state.activeLayout] = {
    scale: Number(els.scaleInput.value),
    offsetX: Number(els.offsetXInput.value),
    offsetY: Number(els.offsetYInput.value),
  };
}

function setImageState(next) {
  if (!state.imageStates[state.type]) {
    state.imageStates[state.type] = {};
  }
  state.imageStates[state.type][state.activeLayout] = { ...getActiveImageState(), ...next };
  renderAll();
}

function loadImageFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setMessage("请上传图片文件");
    return;
  }

  if (state.type === "weekly") {
    saveWeeklyImageFile(file);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      setCurrentImage(image, file.name);
      setMessage("");
      renderAll();
    };
    image.onerror = () => setMessage("图片加载失败，请重新上传");
    image.src = reader.result;
  };
  reader.onerror = () => setMessage("图片加载失败，请重新上传");
  reader.readAsDataURL(file);
}

document.querySelectorAll(".type-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.type = button.dataset.type;
    if (state.type === "weekly") {
      ensureWeeklyImage();
      return;
    }
    syncImageForType();
    renderAll();
  });
});

document.querySelectorAll(".layout-tab, .preview-card, .adjust-layout-button").forEach((item) => {
  item.addEventListener("click", () => {
    state.activeLayout = item.dataset.layout;
    renderAll();
  });
});

els.imageInput.addEventListener("change", (event) => {
  loadImageFile(event.target.files[0]);
  event.target.value = "";
});

els.weeklyImageGrid.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-weekly-image]");
  if (deleteButton) {
    event.stopPropagation();
    deleteWeeklyLibraryImage(deleteButton.dataset.deleteWeeklyImage);
    return;
  }

  const item = event.target.closest("[data-weekly-image-id]");
  if (!item) return;
  selectWeeklyLibraryImage(item.dataset.weeklyImageId);
});

els.weeklyImageGrid.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target.closest("[data-delete-weekly-image]")) return;

  const item = event.target.closest("[data-weekly-image-id]");
  if (!item) return;
  event.preventDefault();
  selectWeeklyLibraryImage(item.dataset.weeklyImageId);
});

els.titleInput.addEventListener("input", () => {
  state.title = els.titleInput.value;
  renderAll();
});

els.subtitleInput.addEventListener("input", () => {
  state.subtitle = els.subtitleInput.value;
  renderAll();
});

els.titleSizeInput.addEventListener("input", () => {
  state.titleSize = Number(els.titleSizeInput.value);
  renderAll();
});

els.subtitleSizeInput.addEventListener("input", () => {
  state.subtitleSize = Number(els.subtitleSizeInput.value);
  renderAll();
});

els.weekInput.addEventListener("input", () => {
  state.weekLabel = els.weekInput.value;
  renderAll();
});

[els.scaleInput, els.offsetXInput, els.offsetYInput].forEach((input) => {
  input.addEventListener("input", () => {
    updateImageStateFromInputs();
    renderAll();
  });
});

els.resetImageButton.addEventListener("click", () => {
  if (!state.imageStates[state.type]) {
    state.imageStates[state.type] = {};
  }
  state.imageStates[state.type][state.activeLayout] = defaultImageState(state.type, state.activeLayout);
  renderAll();
});

els.safeAreaButton.addEventListener("click", () => {
  state.showSafeArea = !state.showSafeArea;
  renderAll();
});

els.download16x9Button.addEventListener("click", () => {
  downloadCanvas(renderCover(state.type, "16x9", state), "video-cover-16x9.png");
});

els.download4x3Button.addEventListener("click", () => {
  downloadCanvas(renderCover(state.type, "4x3", state), "video-cover-4x3.png");
});

els.download3x4Button.addEventListener("click", () => {
  downloadCanvas(renderCover(state.type, "3x4", state), "video-cover-3x4.png");
});

els.downloadCombinedButton.addEventListener("click", () => {
  const rendered = getRenderedSet();
  downloadCanvas(renderCombinedCanvas(rendered["16x9"], rendered["4x3"], rendered["3x4"]), "video-cover-combined.png");
});

let dragStart = null;
els.mainCanvas.addEventListener("pointerdown", (event) => {
  if (!state.image) return;
  els.mainCanvas.setPointerCapture(event.pointerId);
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    offsetX: getActiveImageState().offsetX,
    offsetY: getActiveImageState().offsetY,
  };
});

els.mainCanvas.addEventListener("pointermove", (event) => {
  if (!dragStart) return;
  const rect = els.mainCanvas.getBoundingClientRect();
  const layout = layouts[state.type][state.activeLayout];
  const factorX = layout.width / rect.width;
  const factorY = layout.height / rect.height;
  const nextX = clamp(dragStart.offsetX + (event.clientX - dragStart.x) * factorX, -1500, 1500);
  const nextY = clamp(dragStart.offsetY + (event.clientY - dragStart.y) * factorY, -1500, 1500);
  setImageState({ offsetX: nextX, offsetY: nextY });
});

els.mainCanvas.addEventListener("pointerup", () => {
  dragStart = null;
});

els.mainCanvas.addEventListener("pointercancel", () => {
  dragStart = null;
});

if (window.ResizeObserver) {
  const canvasStageObserver = new ResizeObserver(() => fitMainCanvasToStage());
  canvasStageObserver.observe(els.mainCanvas.parentElement);
} else {
  window.addEventListener("resize", fitMainCanvasToStage);
}

renderWeeklyImageLibrary();
loadWeeklyImageLibrary();
renderAll();
