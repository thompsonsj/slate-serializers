// Fails when text that can reach release-please's release notes contains an HTML tag.
//
// release-please parses its release PR body as HTML. An unclosed tag in a note (e.g. `<b>` from a commit title)
// swallows the sections that follow, so those packages get no GitHub release or tag.
//
// Usage: PR_TITLE=... PR_BODY=... node check-release-notes-text.mjs <commits.json>
// commits.json is `gh api repos/{owner}/{repo}/pulls/{number}/commits --paginate --slurp` (an array of pages).

import { readFileSync, appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const TAG_START = /<[A-Za-z]/
// Lines release-please reads from a commit body as extra changelog entries.
const CONVENTIONAL_LINE = /^(\w+)(\([^)]*\))?!?: /
// A breaking-change note runs on until a blank line or another entry.
const BREAKING_CHANGE_LINE = /^BREAKING[ -]CHANGE: /
// release-please uses this block of a merged PR's body instead of its commit messages.
const COMMIT_OVERRIDE = /BEGIN_COMMIT_OVERRIDE([\s\S]*?)END_COMMIT_OVERRIDE/

/** Returns the text release-please may turn into release notes, with where each piece came from. */
export const releaseNoteCandidates = (title, commitMessages, prBody = '') => {
  const candidates = [{ source: 'PR title', text: title }]
  for (const message of commitMessages) {
    const [subject, ...body] = message.split('\n')
    // A single-commit PR is squashed under the commit subject; otherwise subjects become `* ` bullets, which are ignored.
    if (commitMessages.length === 1) {
      candidates.push({ source: 'commit subject', text: subject })
    }
    const source = `line in the body of "${subject}"`
    let inBreakingChange = false
    for (const line of body.map((l) => l.trim())) {
      if (CONVENTIONAL_LINE.test(line)) {
        inBreakingChange = false
        candidates.push({ source, text: line })
      } else if (BREAKING_CHANGE_LINE.test(line)) {
        inBreakingChange = true
        candidates.push({ source, text: line })
      } else if (inBreakingChange && line !== '') {
        candidates.push({ source, text: line })
      } else {
        inBreakingChange = false
      }
    }
  }
  const override = prBody.match(COMMIT_OVERRIDE)
  if (override) {
    for (const line of override[1].split('\n').map((l) => l.trim())) {
      if (line !== '') {
        candidates.push({ source: 'BEGIN_COMMIT_OVERRIDE block in the PR body', text: line })
      }
    }
  }
  return candidates
}

export const findProblems = (title, commitMessages, prBody) =>
  releaseNoteCandidates(title, commitMessages, prBody).filter(({ text }) => TAG_START.test(text))

const main = () => {
  const commits = JSON.parse(readFileSync(process.argv[2], 'utf8')).flat()
  const problems = findProblems(
    process.env.PR_TITLE ?? '',
    commits.map((c) => c.commit.message),
    process.env.PR_BODY ?? '',
  )
  if (problems.length === 0) {
    console.log('No HTML tags in text that can become release notes.')
    return
  }
  const advice =
    'release-please reads this text as HTML, and an unclosed tag stops it creating some GitHub releases. ' +
    'Remove the angle brackets (e.g. write "b tag" instead of "<b>"). Backticks do not help.'
  for (const { source, text } of problems) {
    console.log(`::error title=HTML tag in ${source}::${text} — ${advice}`)
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = problems.map(({ source, text }) => `| ${source} | \`${text.replace(/\|/g, '\\|')}\` |`)
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      ['### HTML tags found in release note text', '', advice, '', '| Where | Text |', '| - | - |', ...rows, ''].join('\n'),
    )
  }
  process.exitCode = 1
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
}
