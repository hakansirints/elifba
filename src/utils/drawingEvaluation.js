/**
 * Arabic Calligraphy (Hat Kalemi / Qalam) Renderer & Drawing Evaluator
 * Calibrated specifically for children: forgiving finger-width tolerance band,
 * rewards natural tracing efforts while filtering out empty or stray scribbles.
 */

// Draw an authentic Arabic chisel-nib calligraphy ribbon
export function drawCalligraphicPath(ctx, points, color = '#1e382b', nibSize = 8, nibAngle = -0.65) {
  if (!points || points.length === 0) return;

  const cosA = Math.cos(nibAngle);
  const sinA = Math.sin(nibAngle);
  const halfNib = nibSize / 2;
  const vx = halfNib * cosA;
  const vy = halfNib * sinA;

  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (points.length === 1) {
    const [x, y] = points[0];
    ctx.beginPath();
    ctx.moveTo(x - vx, y - vy);
    ctx.lineTo(x + vx, y + vy);
    ctx.lineTo(x + vx + 1, y + vy + 1);
    ctx.lineTo(x - vx + 1, y - vy + 1);
    ctx.closePath();
    ctx.fill();
    return;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dist = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const steps = Math.max(1, Math.ceil(dist / 2));

    for (let s = 0; s < steps; s++) {
      const t0 = s / steps;
      const t1 = (s + 1) / steps;
      const x0 = p0[0] + (p1[0] - p0[0]) * t0;
      const y0 = p0[1] + (p1[1] - p0[1]) * t0;
      const x1 = p0[0] + (p1[0] - p0[0]) * t1;
      const y1 = p0[1] + (p1[1] - p0[1]) * t1;

      ctx.beginPath();
      ctx.moveTo(x0 - vx, y0 - vy);
      ctx.lineTo(x0 + vx, y0 + vy);
      ctx.lineTo(x1 + vx, y1 + vy);
      ctx.lineTo(x1 - vx, y1 - vy);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/**
 * Child-friendly evaluation of freehand drawing against reference letter.
 * Evaluates whether the child made an honest attempt along the guide lines,
 * tolerating natural hand tremors and finger drawing imprecision.
 */
export function evaluateDrawing(letterChar, paths, width = 400, height = 300, fontSpec = '') {
  if (!paths || paths.length === 0) {
    return { correct: false, score: 0, reason: 'empty' };
  }

  const totalPoints = paths.reduce((n, p) => n + p.length, 0);
  if (totalPoints < 6) {
    return { correct: false, score: 0, reason: 'too_short' };
  }

  if (typeof document === 'undefined') {
    return { correct: true, score: 100, reason: 'fallback' };
  }

  const W = 160, H = 160;

  // 1. Offscreen canvas for reference letter guide
  const refCanvas = document.createElement('canvas');
  refCanvas.width = W;
  refCanvas.height = H;
  const rctx = refCanvas.getContext('2d');
  if (!rctx) return { correct: true, score: 100, reason: 'fallback' };

  rctx.clearRect(0, 0, W, H);
  rctx.fillStyle = '#000';
  rctx.font = fontSpec || '100px Amiri, "Traditional Arabic", serif';
  rctx.textAlign = 'center';
  rctx.textBaseline = 'middle';
  rctx.fillText(letterChar, W / 2, H / 2);

  const refData = rctx.getImageData(0, 0, W, H).data;

  let refMinX = W, refMaxX = 0, refMinY = H, refMaxY = 0;
  let refPixelCount = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      if (refData[idx + 3] > 40) {
        refPixelCount++;
        if (x < refMinX) refMinX = x;
        if (x > refMaxX) refMaxX = x;
        if (y < refMinY) refMinY = y;
        if (y > refMaxY) refMaxY = y;
      }
    }
  }

  if (refPixelCount === 0) {
    return { correct: true, score: 100, reason: 'fallback' };
  }

  // Generous, kid-friendly tolerance zone (10px radius in 160x160 grid)
  const TOLERANCE = 10;
  const isTargetZone = new Uint8Array(W * H);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      if (refData[idx + 3] > 40) {
        for (let dy = -TOLERANCE; dy <= TOLERANCE; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= H) continue;
          for (let dx = -TOLERANCE; dx <= TOLERANCE; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= W) continue;
            if (dx * dx + dy * dy <= TOLERANCE * TOLERANCE) {
              isTargetZone[ny * W + nx] = 1;
            }
          }
        }
      }
    }
  }

  // 2. Render user's strokes on userCanvas with calligraphic nib
  const userCanvas = document.createElement('canvas');
  userCanvas.width = W;
  userCanvas.height = H;
  const uctx = userCanvas.getContext('2d');
  if (!uctx) return { correct: true, score: 100, reason: 'fallback' };

  uctx.clearRect(0, 0, W, H);

  for (const stroke of paths) {
    if (!stroke || stroke.length === 0) continue;
    const scaledPoints = stroke.map(([nx, ny]) => [nx * W, ny * H]);
    drawCalligraphicPath(uctx, scaledPoints, '#000', 6, -0.65);
  }

  const userData = uctx.getImageData(0, 0, W, H).data;
  let userPixelCount = 0;
  let hitsInTargetZone = 0;
  let coveredRefPixels = 0;
  const refCovered = new Uint8Array(W * H);
  let userMinX = W, userMaxX = 0, userMinY = H, userMaxY = 0;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      if (userData[idx + 3] > 30) {
        userPixelCount++;
        if (x < userMinX) userMinX = x;
        if (x > userMaxX) userMaxX = x;
        if (y < userMinY) userMinY = y;
        if (y > userMaxY) userMaxY = y;

        if (isTargetZone[y * W + x]) {
          hitsInTargetZone++;
        }

        // Coverage check (within 6px of original glyph)
        for (let dy = -6; dy <= 6; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= H) continue;
          for (let dx = -6; dx <= 6; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= W) continue;
            const rIdx = (ny * W + nx) * 4;
            if (refData[rIdx + 3] > 40 && !refCovered[ny * W + nx]) {
              refCovered[ny * W + nx] = 1;
              coveredRefPixels++;
            }
          }
        }
      }
    }
  }

  if (userPixelCount < 35) {
    return { correct: false, score: 0, reason: 'too_little' };
  }

  const accuracy = hitsInTargetZone / userPixelCount;
  const coverage = coveredRefPixels / refPixelCount;

  // Child-centric criteria:
  // - Accuracy: at least 42% of pixels are within the letter's corridor (filters out random scribbles)
  // - Coverage: at least 32% of the letter spine is drawn (confirms an actual attempt at the shape)
  // - Or high accuracy (52%+) with 22%+ coverage
  const isCorrect = (accuracy >= 0.42 && coverage >= 0.30) ||
                    (accuracy >= 0.52 && coverage >= 0.22) ||
                    (coverage >= 0.45 && accuracy >= 0.35);

  const score = Math.min(100, Math.round((accuracy * 0.5 + coverage * 0.5) * 120));

  let reason = 'good';
  if (!isCorrect) {
    if (accuracy < 0.42) {
      reason = 'off_target';
    } else {
      reason = 'incomplete';
    }
  }

  return {
    correct: isCorrect,
    score,
    accuracy: Math.round(accuracy * 100),
    coverage: Math.round(coverage * 100),
    reason,
  };
}
