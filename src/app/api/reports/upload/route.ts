import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dataUri } = body;

    if (!name || !dataUri) {
      return NextResponse.json({ error: 'Missing name or dataUri' }, { status: 400 });
    }

    // Validate data URI
    const matches = /^data:(.+);base64,(.+)$/.exec(dataUri);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid data URI' }, { status: 400 });
    }

    const b64 = matches[2];
    const buffer = Buffer.from(b64, 'base64');

    // Ensure public/reports exists
    const reportsDir = path.join(process.cwd(), 'public', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Sanitize filename
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(reportsDir, safeName);

    // Prevent writing files larger than 20MB
    if (buffer.length > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    fs.writeFileSync(outPath, buffer);

    return NextResponse.json({ ok: true, path: `/reports/${safeName}` });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
