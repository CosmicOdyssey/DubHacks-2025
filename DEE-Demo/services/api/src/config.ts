export type AppConfig = {
  port: number;
  logLevel: string;
  databaseUrl?: string;
  githubWebhookSecret?: string;
  githubApiToken?: string;
  bitbucketWebhookSecret?: string;
  jiraSharedSecret?: string;
  jiraBaseUrl?: string;
  jiraEmail?: string;
  jiraApiToken?: string;
  gitlabApiToken?: string;
  gitlabBaseUrl?: string;
  awsRegion?: string;
  awsS3Bucket?: string;
};

function readNumber(value: string | undefined, fallback: number): number {
  const n = value ? Number(value) : NaN;
  return Number.isFinite(n) ? n : fallback;
}

export const config: AppConfig = {
  port: readNumber(process.env.PORT, 4000),
  logLevel: process.env.LOG_LEVEL || 'info',
  databaseUrl: process.env.DATABASE_URL,
  githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  githubApiToken: process.env.GITHUB_API_TOKEN,
  bitbucketWebhookSecret: process.env.BITBUCKET_WEBHOOK_SECRET,
  jiraSharedSecret: process.env.JIRA_SHARED_SECRET,
  jiraBaseUrl: process.env.JIRA_BASE_URL,
  jiraEmail: process.env.JIRA_EMAIL,
  jiraApiToken: process.env.JIRA_API_TOKEN,
  gitlabApiToken: process.env.GITLAB_API_TOKEN,
  gitlabBaseUrl: process.env.GITLAB_BASE_URL || 'https://gitlab.com/api/v4',
  awsRegion: process.env.AWS_REGION,
  awsS3Bucket: process.env.AWS_S3_BUCKET,
};


