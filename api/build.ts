// api/build.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { buildConfig } = req.body;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: 'GitHub token is not configured' });
  }

  if (!buildConfig) {
    return res.status(400).json({ message: 'Missing buildConfig in request body' });
  }

  try {
    const response = await fetch('https://api.github.com/repos/sudo-self/apk-builder-actions/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        event_type: 'apk_build',
        client_payload: { buildConfig }
      })
    });

    if (response.ok) {
      res.status(200).json({ message: 'Build triggered successfully' });
    } else {
      const errorData = await response.json();
      res.status(response.status).json({ message: 'Failed to trigger build', error: errorData });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
}
