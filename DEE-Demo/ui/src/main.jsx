import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import IssuePanel from './IssuePanel.jsx'
import { view } from '@forge/bridge'

async function mount() {
  const context = await view.getContext()
  const container = document.getElementById('root')
  const root = createRoot(container)
  if (context?.extension?.context?.issue) {
    const issueKey = context.extension.context.issue.key
    const projectKey = context.extension.context.project?.key
    root.render(
      <React.StrictMode>
        <IssuePanel issueKey={issueKey} projectKey={projectKey} />
      </React.StrictMode>
    )
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

mount()
