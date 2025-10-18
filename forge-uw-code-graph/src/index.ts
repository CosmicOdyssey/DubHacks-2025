import Resolver from '@forge/resolver';
import { ingestHandler } from './api/ingest';
import { analyzeHandler } from './api/analyze';
import {
  delegateApplyHandler,
  delegateSuggestHandler,
  getGraphHandler,
  getIssueBlocksHandler,
} from './api/delegate';

const resolver = new Resolver();

resolver.define('ingestRepo', ingestHandler);
resolver.define('analyzeRepo', analyzeHandler);
resolver.define('delegateSuggest', delegateSuggestHandler);
resolver.define('delegateApply', delegateApplyHandler);
resolver.define('graphPage', getGraphHandler);
resolver.define('issueBlocks', getIssueBlocksHandler);

export const handler = resolver.getDefinitions();

export { run as projectPage } from './ui-kit/ProjectPage';
export { run as issueGlance } from './ui-kit/IssueGlance';
