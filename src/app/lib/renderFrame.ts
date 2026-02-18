type FrameButton = {
  label: string;
  action?: "post" | "post_redirect" | "link" | "mint" | "tx";
  target?: string;
};

export function escapeAttr(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/\"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderFrameHtml(opts: {
  title: string;
  imageUrl: string;
  postUrl: string;
  buttons: FrameButton[];
  state?: Record<string, any>;
  aspectRatio?: "1:1" | "1.91:1";
}) {
  const { title, imageUrl, postUrl, buttons, state, aspectRatio } = opts;

  const tags: string[] = [];
  tags.push(`<meta property="og:title" content="${escapeAttr(title)}" />`);
  tags.push(`<meta property="og:image" content="${escapeAttr(imageUrl)}" />`);

  tags.push(`<meta property="fc:frame" content="vNext" />`);
  tags.push(`<meta property="fc:frame:image" content="${escapeAttr(imageUrl)}" />`);
  if (aspectRatio) tags.push(`<meta property="fc:frame:image:aspect_ratio" content="${aspectRatio}" />`);
  tags.push(`<meta property="fc:frame:post_url" content="${escapeAttr(postUrl)}" />`);
  if (state) tags.push(`<meta property="fc:frame:state" content="${escapeAttr(JSON.stringify(state))}" />`);

  buttons.forEach((b, i) => {
    const idx = i + 1;
    tags.push(`<meta property="fc:frame:button:${idx}" content="${escapeAttr(b.label)}" />`);
    if (b.action) tags.push(`<meta property="fc:frame:button:${idx}:action" content="${b.action}" />`);
    if (b.target) tags.push(`<meta property="fc:frame:button:${idx}:target" content="${escapeAttr(b.target)}" />`);
  });

  // Open Frames compatibility
  tags.push(`<meta property="of:accepts:anonymous" content="1.0" />`);
  tags.push(`<meta property="of:image" content="${escapeAttr(imageUrl)}" />`);
  tags.push(`<meta property="of:post_url" content="${escapeAttr(postUrl)}" />`);
  if (state) tags.push(`<meta property="of:state" content="${escapeAttr(JSON.stringify(state))}" />`);
  if (aspectRatio) tags.push(`<meta property="of:image:aspect_ratio" content="${aspectRatio}" />`);
  buttons.forEach((b, i) => {
    const idx = i + 1;
    tags.push(`<meta property="of:button:${idx}" content="${escapeAttr(b.label)}" />`);
    if (b.action) tags.push(`<meta property="of:button:${idx}:action" content="${b.action}" />`);
    if (b.target) tags.push(`<meta property="of:button:${idx}:target" content="${escapeAttr(b.target)}" />`);
  });

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    ${tags.join("\n    ")}
  </head>
  <body></body>
</html>`;
}
