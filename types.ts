
export enum BuildStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  MONITORING = 'monitoring',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface BuildConfig {
  buildId: string;
  hostName: string;
  name: string;
  launchUrl: string;
  launcherName: string;
  themeColor: string;
  iconChoice: string;
}

export interface GitHubWorkflowRun {
  id: number;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
}

export type ViewType = 'home' | 'docs';
