import api, { route } from '@forge/api';

export const isMockJira = (): boolean => process.env.MOCK_JIRA === 'true';

export const createJiraIssue = async (fields: Record<string, any>): Promise<string> => {
  if (isMockJira()) {
    return `MOCK-${fields.project?.key ?? 'UW'}-${Math.floor(Math.random() * 9000)}`;
  }
  const client = await api.asApp();
  const response = await client.requestJira(route`/rest/api/3/issue`, {
    method: 'POST',
    body: JSON.stringify({ fields }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create Jira issue: ${response.status} ${text}`);
  }
  const data = (await response.json()) as { key: string };
  return data.key;
};

export const addIssueLinkProperty = async (
  issueKey: string,
  propertyKey: string,
  value: unknown,
): Promise<void> => {
  if (isMockJira()) {
    return;
  }
  const client = await api.asApp();
  const response = await client.requestJira(
    route`/rest/api/3/issue/${issueKey}/properties/${propertyKey}`,
    {
      method: 'PUT',
      body: JSON.stringify(value),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to persist issue property: ${response.status} ${text}`);
  }
};
