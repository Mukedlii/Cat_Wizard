import { NextResponse } from "next/server";

function jsonEscapeForMeta(content: string) {
  return content
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET() {
  const name = process.env.NEXT_PUBLIC_APP_NAME ?? "Cat Wizard";
  const homeUrl = process.env.NEXT_PUBLIC_APP_HOME_URL ?? "https://example.com";
  const iconUrl = process.env.NEXT_PUBLIC_APP_ICON_URL ?? `${homeUrl}/icon.png`;
  const splashImageUrl = process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE_URL ?? `${homeUrl}/splash.png`;
  const splashBg = process.env.NEXT_PUBLIC_APP_SPLASH_BG ?? "#f5f0ec";

  const embed = {
    version: "1",
    imageUrl: `${homeUrl}/cover.png`,
    button: {
      title: "Open",
      action: {
        type: "launch_miniapp",
        name,
        url: homeUrl,
        splashImageUrl,
        splashBackgroundColor: splashBg,
      },
    },
  };

  const embedStr = jsonEscapeForMeta(JSON.stringify(embed));

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="og:title" content="${name}" />
    <meta property="og:image" content="${homeUrl}/cover.png" />
    <meta name="fc:miniapp" content="${embedStr}" />
    <meta name="fc:frame" content="${embedStr}" />
    <meta property="og:description" content="Browse Cat Wizard NFTs and mint." />
  </head>
  <body></body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" },
  });
}
