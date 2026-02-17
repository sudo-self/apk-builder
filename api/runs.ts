// api/runs.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: 'GitHub token is not configured' });
  }

  // Disable caching to ensure fresh data is always fetched
  res.setHeader('Cache-Control', 'no-cache, max-age=0');

  try {
    const response = await fetch(`https://api.github.com/repos/sudo-self/apk-builder-actions/actions/runs?event=repository_dispatch&per_page=5`, {
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
