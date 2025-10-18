import ForgeUI, {
  Button,
  Form,
  Fragment,
  Heading,
  Link,
  Lozenge,
  ProjectPage,
  SectionMessage,
  Text,
  TextArea,
  TextField,
  useProductContext,
  useState,
  render,
} from '@forge/ui';
import { invoke } from '@forge/ui';

type IngestFormData = {
  repoLabel: string;
  gitUrl?: string;
  zipBase64?: string;
};

type AnalyzeFormData = {
  repoId: string;
  languages?: string;
};

const App = () => {
  const context = useProductContext();
  const projectKey = context?.projectKey ?? 'UNKNOWN';
  const [status, setStatus] = useState('Idle');
  const [repoId, setRepoId] = useState<string | undefined>(undefined);
  const [analysisModel, setAnalysisModel] = useState<string | undefined>(undefined);

  const handleIngest = async (formData: IngestFormData) => {
    setStatus('Parsing repository…');
    const payload = {
      projectKey,
      repoLabel: formData.repoLabel,
      gitUrl: formData.gitUrl || undefined,
      zipBase64: formData.zipBase64 || undefined,
    };
    const result = await invoke('ingestRepo', payload);
    setRepoId(result.repoId);
    setStatus(`Parsed ${result.fileCount} files → ${result.blockCount} blocks (repoId=${result.repoId}).`);
  };

  const handleAnalyze = async (formData: AnalyzeFormData) => {
    const id = formData.repoId || repoId;
    if (!id) {
      setStatus('Ingest a repository first.');
      return;
    }
    setStatus('Running Gemini batch analysis…');
    const languages = formData.languages
      ? formData.languages
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      : undefined;
    const result = await invoke('analyzeRepo', {
      repoId: id,
      languages,
    });
    setAnalysisModel(result.model);
    setStatus(`Updated ${result.updatedBlockIds.length} blocks using ${result.model}.`);
  };

  return (
    <ProjectPage>
      <Fragment>
        <Heading>UW Code Graph Agent</Heading>
        <Text>
          Analyze University of Washington repositories, build a block graph, and delegate work directly from Jira.
        </Text>
        <SectionMessage title="Status" appearance="information">
          <Text>{status}</Text>
          {analysisModel && <Lozenge appearance="new">{analysisModel}</Lozenge>}
        </SectionMessage>
        <Form onSubmit={handleIngest} submitButtonText="1. Ingest Repository">
          <TextField name="repoLabel" label="Repository Label" isRequired />
          <TextField name="gitUrl" label="Git URL (mock repos supported)" />
          <TextArea
            name="zipBase64"
            label="ZIP (base64-encoded)"
            description="Optional. Provide if analyzing an uploaded archive instead of Git."
          />
        </Form>
        <Form onSubmit={handleAnalyze} submitButtonText="2. Run Gemini Analysis">
          <TextField
            name="repoId"
            label="Repository ID"
            description="Defaults to the most recent ingest."
            defaultValue={repoId}
          />
          <TextField name="languages" label="Language filters (comma-separated)" />
        </Form>
        <Link
          href="/jira/forge/dubhacks-uw-code-graph"
          openNewTab
        >
          <Button text="Open Graph Explorer" appearance="primary" />
        </Link>
      </Fragment>
    </ProjectPage>
  );
};

export const run = render(<App />);
