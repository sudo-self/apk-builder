// api/download.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ message: 'GitHub token is not configured' });
  }

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid url parameter' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github+json',
      },
      redirect: 'manual', // We need to handle the redirect manually
    });

    // GitHub API returns a 302 redirect to the actual artifact download URL (on AWS S3)
    if (response.status === 302) {
      const redirectUrl = response.headers.get('location');
      if (redirectUrl) {
        // Redirect the client to the actual download URL
        return res.redirect(302, redirectUrl);
      }
    }

    // If we don't get a redirect, something went wrong
    const errorData = await response.text();
    res.status(response.status).send(errorData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An internal error occurred' });
  }
}
