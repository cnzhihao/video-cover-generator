const fontFamily = `Inter, system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;

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
      foreground: { centerX: 0.72, centerY: 0.5, widthRatio: 0.52, heightRatio: 1.08 },
      textBox: { x: 0.06, y: 0.18, width: 0.44, height: 0.58 },
      gradient: { type: "left-to-right", startOpacity: 0.78, midOpacity: 0.55, endOpacity: 0, endPosition: 0.68 },
    },
    "4x3": {
      ...layoutBase["4x3"],
      mode: "horizontal",
      foreground: { centerX: 0.72, centerY: 0.52, widthRatio: 0.56, heightRatio: 1.08 },
      textBox: { x: 0.07, y: 0.17, width: 0.46, height: 0.58 },
      gradient: { type: "left-to-right", startOpacity: 0.76, midOpacity: 0.55, endOpacity: 0, endPosition: 0.62 },
    },
    "3x4": {
      ...layoutBase["3x4"],
      mode: "vertical",
      foreground: { centerX: 0.5, centerY: 0.38, widthRatio: 1.08, heightRatio: 0.82 },
      textBox: { x: 0.08, y: 0.76, width: 0.84, height: 0.2 },
      gradient: { type: "bottom-to-top", startOpacity: 0.78, midOpacity: 0.55, endOpacity: 0, endPosition: 0.58 },
    },
  },
  weekly: {
    "16x9": {
      ...layoutBase["16x9"],
      headerBox: { x: 0.07, y: 0.09, width: 0.45, height: 0.16 },
      titleBox: { x: 0.07, y: 0.31, width: 0.66, height: 0.34 },
      subtitleBox: { x: 0.07, y: 0.66, width: 0.58, height: 0.12 },
      avatarBox: { x: 0.74, y: 0.47, width: 0.22, height: 0.42 },
    },
    "4x3": {
      ...layoutBase["4x3"],
      headerBox: { x: 0.08, y: 0.08, width: 0.55, height: 0.15 },
      titleBox: { x: 0.08, y: 0.29, width: 0.72, height: 0.34 },
      subtitleBox: { x: 0.08, y: 0.64, width: 0.62, height: 0.12 },
      avatarBox: { x: 0.68, y: 0.56, width: 0.26, height: 0.35 },
    },
    "3x4": {
      ...layoutBase["3x4"],
      headerBox: { x: 0.08, y: 0.07, width: 0.72, height: 0.13 },
      titleBox: { x: 0.08, y: 0.27, width: 0.78, height: 0.34 },
      subtitleBox: { x: 0.08, y: 0.61, width: 0.72, height: 0.14 },
      avatarBox: { x: 0.58, y: 0.67, width: 0.34, height: 0.25 },
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
  title: "用一个系统跑通内容生产",
  subtitle: "从选题到发布的可复用工作流",
  weekLabel: "2026-06-W3",
  imageState: { scale: 1, offsetX: 0, offsetY: 0 },
  showSafeArea: false,
};

const els = {
  imageInput: document.querySelector("#imageInput"),
  uploadText: document.querySelector("#uploadText"),
  message: document.querySelector("#message"),
  titleInput: document.querySelector("#titleInput"),
  subtitleInput: document.querySelector("#subtitleInput"),
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
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
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
    } else {
      buffer += char;
    }
  }

  if (buffer) tokens.push(buffer);
  return tokens.filter((token, index, arr) => token !== " " || (index > 0 && arr[index - 1] !== " "));
}

function wrapText(ctx, text, maxWidth, maxLines) {
  const tokens = splitTextTokens(text);
  const lines = [];
  let line = "";

  tokens.forEach((token) => {
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
  const { image, imageState, title, subtitle } = data;
  fillBase(ctx, layout);

  ctx.save();
  ctx.filter = "blur(32px) brightness(70%) saturate(55%) contrast(90%)";
  drawImageCover(ctx, image, -50, -50, layout.width + 100, layout.height + 100);
  ctx.restore();

  const foreground = layout.foreground;
  const fw = layout.width * foreground.widthRatio;
  const fh = layout.height * foreground.heightRatio;
  const fx = layout.width * foreground.centerX - fw / 2;
  const fy = layout.height * foreground.centerY - fh / 2;

  ctx.save();
  if (layout.mode === "horizontal") {
    const fade = ctx.createLinearGradient(fx, 0, fx + fw * 0.35, 0);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = fade;
    ctx.fillRect(fx, fy, fw, fh);
  }
  drawImageCover(ctx, image, fx, fy, fw, fh, imageState.offsetX, imageState.offsetY, imageState.scale);
  ctx.restore();

  const g = layout.gradient;
  const gradient = g.type === "bottom-to-top"
    ? ctx.createLinearGradient(0, layout.height, 0, layout.height * (1 - g.endPosition))
    : ctx.createLinearGradient(0, 0, layout.width * g.endPosition, 0);
  gradient.addColorStop(0, `rgba(0,0,0,${g.startOpacity})`);
  gradient.addColorStop(0.55, `rgba(0,0,0,${g.midOpacity})`);
  gradient.addColorStop(1, `rgba(0,0,0,${g.endOpacity})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, layout.width, layout.height);

  const vignette = ctx.createRadialGradient(layout.width / 2, layout.height / 2, layout.width * 0.2, layout.width / 2, layout.height / 2, layout.width * 0.74);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.4)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, layout.width, layout.height);

  const box = rectFromRatio(layout, layout.textBox);
  const pad = layout.width * 0.01;
  const titleFit = fitText(ctx, title || "请输入主标题", {
    maxWidth: box.w - pad * 2,
    maxHeight: box.h * 0.62,
    maxLines: 2,
    maxSize: layout.mode === "vertical" ? 92 : 96,
    minSize: 42,
    weight: 900,
    lineHeight: 1.06,
  });
  const subFit = fitText(ctx, subtitle || "请输入副标题", {
    maxWidth: box.w - pad * 2,
    maxHeight: box.h * 0.3,
    maxLines: 2,
    maxSize: Math.round(titleFit.size * 0.42),
    minSize: 28,
    weight: 700,
    lineHeight: 1.25,
  });

  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  setFont(ctx, titleFit.size, 900);
  drawTextLines(ctx, titleFit.lines, box.x + pad, box.y + titleFit.size, titleFit.size, 1.06, "#ffffff");
  setFont(ctx, subFit.size, 700);
  const subY = box.y + titleFit.lines.length * titleFit.size * 1.06 + subFit.size + layout.height * 0.035;
  drawTextLines(ctx, subFit.lines, box.x + pad, subY, subFit.size, 1.25, "rgba(255,255,255,0.82)");
  ctx.shadowColor = "transparent";
}

function renderWeekly(ctx, layout, data) {
  const { image, imageState, title, subtitle, weekLabel } = data;
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
  const titleSize = clamp(layout.width * 0.076, 72, 118);

  setFont(ctx, Math.round(titleSize * 0.31), 800);
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  drawLetterSpacedText(ctx, "OPC WEEKLY", header.x, header.y + titleSize * 0.28, Math.max(5, layout.width * 0.004));

  setFont(ctx, Math.round(titleSize * 0.5), 900);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(weekLabel || "2026-06-W3", header.x, header.y + titleSize * 0.82);

  const mainFit = fitText(ctx, title || "请输入主标题", {
    maxWidth: titleBox.w,
    maxHeight: titleBox.h,
    maxLines: 2,
    maxSize: Math.round(titleSize),
    minSize: 46,
    weight: 900,
    lineHeight: 1.04,
  });
  setFont(ctx, mainFit.size, 900);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  drawTextLines(ctx, mainFit.lines, titleBox.x, titleBox.y + mainFit.size, mainFit.size, 1.04, "#ffffff");

  const subFit = fitText(ctx, subtitle || "请输入副标题", {
    maxWidth: subtitleBox.w,
    maxHeight: subtitleBox.h,
    maxLines: 2,
    maxSize: Math.round(mainFit.size * 0.42),
    minSize: 28,
    weight: 700,
    lineHeight: 1.2,
  });
  setFont(ctx, subFit.size, 700);
  drawTextLines(ctx, subFit.lines, subtitleBox.x, subtitleBox.y + subFit.size, subFit.size, 1.2, "rgba(255,255,255,0.78)");
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
  const { image, imageState, title, subtitle } = data;
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

  const panel = rectFromRatio(layout, layout.textPanel);
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

  const pad = Math.min(panel.w * 0.08, 40);
  const titleFit = fitText(ctx, title || "请输入主标题", {
    maxWidth: panel.w - pad * 2,
    maxHeight: panel.h * 0.58,
    maxLines: 2,
    maxSize: layout.key === "3x4" ? 72 : 76,
    minSize: 34,
    weight: 900,
    lineHeight: 1.06,
  });
  const subFit = fitText(ctx, subtitle || "请输入副标题", {
    maxWidth: panel.w - pad * 2,
    maxHeight: panel.h * 0.28,
    maxLines: 2,
    maxSize: Math.round(titleFit.size * 0.42),
    minSize: 24,
    weight: 700,
    lineHeight: 1.22,
  });

  setFont(ctx, titleFit.size, 900);
  const startY = panel.y + pad + titleFit.size;
  drawTextLines(ctx, titleFit.lines, panel.x + pad, startY, titleFit.size, 1.06, "#ffffff");
  setFont(ctx, subFit.size, 700);
  const subY = startY + titleFit.lines.length * titleFit.size * 1.06 + subFit.size * 0.72;
  drawTextLines(ctx, subFit.lines, panel.x + pad, subY, subFit.size, 1.22, "rgba(255,255,255,0.8)");
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
    const fg = layout.foreground;
    drawBox({
      x: fg.centerX - fg.widthRatio / 2,
      y: fg.centerY - fg.heightRatio / 2,
      width: fg.widthRatio,
      height: fg.heightRatio,
    }, "图片主体区", "rgba(96,165,250,0.85)");
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

  if (!data.image) {
    drawPlaceholder(ctx, layout);
    return canvas;
  }

  if (type === "talking-head") renderTalkingHead(ctx, layout, data);
  if (type === "weekly") renderWeekly(ctx, layout, data);
  if (type === "tutorial") renderTutorial(ctx, layout, data);
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
  els.scaleOutput.value = Number(state.imageState.scale).toFixed(2);
  els.offsetXOutput.value = Math.round(state.imageState.offsetX);
  els.offsetYOutput.value = Math.round(state.imageState.offsetY);
  els.weekField.hidden = state.type !== "weekly";
  els.safeAreaButton.textContent = state.showSafeArea ? "隐藏安全区" : "显示安全区";
  els.safeAreaButton.setAttribute("aria-pressed", String(state.showSafeArea));

  const activeLayout = layouts[state.type][state.activeLayout];
  els.activeLayoutLabel.textContent = `${activeLayout.label} · ${activeLayout.width} × ${activeLayout.height}`;

  document.querySelectorAll(".type-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.type === state.type);
  });
  document.querySelectorAll(".layout-tab, .preview-card").forEach((item) => {
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
}

function setMessage(text) {
  els.message.textContent = text || "";
}

function updateImageStateFromInputs() {
  state.imageState.scale = Number(els.scaleInput.value);
  state.imageState.offsetX = Number(els.offsetXInput.value);
  state.imageState.offsetY = Number(els.offsetYInput.value);
}

function setImageState(next) {
  state.imageState = { ...state.imageState, ...next };
  els.scaleInput.value = state.imageState.scale;
  els.offsetXInput.value = state.imageState.offsetX;
  els.offsetYInput.value = state.imageState.offsetY;
  renderAll();
}

function loadImageFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setMessage("请上传图片文件");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      state.image = image;
      state.imageName = file.name;
      els.uploadText.textContent = file.name;
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
    renderAll();
  });
});

document.querySelectorAll(".layout-tab, .preview-card").forEach((item) => {
  item.addEventListener("click", () => {
    state.activeLayout = item.dataset.layout;
    renderAll();
  });
});

els.imageInput.addEventListener("change", (event) => {
  loadImageFile(event.target.files[0]);
});

els.titleInput.addEventListener("input", () => {
  state.title = els.titleInput.value;
  renderAll();
});

els.subtitleInput.addEventListener("input", () => {
  state.subtitle = els.subtitleInput.value;
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
  setImageState({ scale: 1, offsetX: 0, offsetY: 0 });
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
    offsetX: state.imageState.offsetX,
    offsetY: state.imageState.offsetY,
  };
});

els.mainCanvas.addEventListener("pointermove", (event) => {
  if (!dragStart) return;
  const rect = els.mainCanvas.getBoundingClientRect();
  const layout = layouts[state.type][state.activeLayout];
  const factorX = layout.width / rect.width;
  const factorY = layout.height / rect.height;
  const nextX = clamp(dragStart.offsetX + (event.clientX - dragStart.x) * factorX, -300, 300);
  const nextY = clamp(dragStart.offsetY + (event.clientY - dragStart.y) * factorY, -300, 300);
  setImageState({ offsetX: nextX, offsetY: nextY });
});

els.mainCanvas.addEventListener("pointerup", () => {
  dragStart = null;
});

els.mainCanvas.addEventListener("pointercancel", () => {
  dragStart = null;
});

renderAll();
