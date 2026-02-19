import { NextRequest, NextResponse } from 'next/server';

const DRIVE_ORIGIN = 'https://drive.google.com';

function isAllowedDriveUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'drive.google.com';
  } catch {
    return false;
  }
}

/** Allow redirects only to Google-owned hosts (Drive often redirects to googleusercontent.com CDN). */
function isAllowedRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const h = parsed.hostname;
    return h === 'drive.google.com' || h.endsWith('.google.com') || h.endsWith('.googleusercontent.com');
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }
  const trimmed = url.trim();
  if (!isAllowedDriveUrl(trimmed)) {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  try {
    const res = await fetch(trimmed, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioProxy/1.0)',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream error' }, { status: res.status === 403 ? 502 : res.status });
    }

    const finalUrl = res.url;
    if (!isAllowedRedirectUrl(finalUrl) && !finalUrl.startsWith(DRIVE_ORIGIN)) {
      return NextResponse.json({ error: 'Invalid redirect' }, { status: 400 });
    }

    let contentType = res.headers.get('content-type') || 'application/octet-stream';
    if (contentType.includes('text/html')) {
      return NextResponse.json({ error: 'Drive returned HTML (file may require sign-in or be unavailable)' }, { status: 502 });
    }
    const cacheControl = 'public, max-age=3600, s-maxage=3600';
    const disposition = res.headers.get('content-disposition');
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'Content-Disposition': disposition?.toLowerCase().includes('attachment') ? 'inline' : (disposition || 'inline'),
    };

    return new NextResponse(res.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error('Proxy media error:', err);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 502 });
  }
}
