// api/status.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { runId } = req.query;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: 'GitHub token is not configured' });
  }

  // Disable caching to ensure fresh data is always fetched
  res.setHeader('Cache-Control', 'no-cache, max-age=0');

  if (!runId) {
    return res.status(400).json({ message: 'Missing runId parameter' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/sudo-self/apk-builder-actions/actions/runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: 'An internal error occurred' });
  }
}
