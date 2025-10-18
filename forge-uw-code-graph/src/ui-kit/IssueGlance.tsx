import ForgeUI, {
  Button,
  Fragment,
  IssueGlance,
  Lozenge,
  SectionMessage,
  Stack,
  Tag,
  Text,
  useEffect,
  useProductContext,
  useState,
  render,
} from '@forge/ui';
import { invoke } from '@forge/ui';

type BlockSummary = {
  id: string;
  title: string;
  filePath: string;
  summary: string;
  tags: string[];
};

type IssueBlockResponse = {
  repoId?: string;
  blockIds: string[];
  blocks: BlockSummary[];
};

const App = () => {
  const context = useProductContext();
  const issueKey = context?.issueKey ?? 'UNKNOWN';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IssueBlockResponse>({ blockIds: [], blocks: [] });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await invoke('issueBlocks', { issueKey });
      setData(result);
      setLoading(false);
    })();
  }, [issueKey]);

  return (
    <IssueGlance>
      <Fragment>
        <Text>Linked UW code blocks</Text>
        {loading && <Lozenge appearance="moved">Loading…</Lozenge>}
        {!loading && data.blocks.length === 0 && (
          <SectionMessage title="No blocks linked yet" appearance="warning">
            <Text>Generate a work breakdown from the project page to populate this view.</Text>
          </SectionMessage>
        )}
        {!loading && data.blocks.length > 0 && (
          <Stack align="start" space="condensed">
            {data.blocks.map((block) => (
              <Stack key={block.id} align="start" space="none">
                <Text>
                  <strong>{block.title}</strong> · {block.filePath}
                </Text>
                <Text>{block.summary || 'No summary yet.'}</Text>
                <Stack direction="horizontal">
                  {block.tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
        {data.repoId && (
          <Button
            text="Open Graph Selection"
            appearance="default"
            href={`/jira/forge/dubhacks-uw-code-graph?repoId=${data.repoId}&blocks=${data.blockIds.join(',')}`}
          />
        )}
      </Fragment>
    </IssueGlance>
  );
};

export const run = render(<App />);
