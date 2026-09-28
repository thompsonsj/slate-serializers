import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findProblems } from './check-release-notes-text.mjs'

const texts = (title, messages = []) => findProblems(title, messages).map(({ text }) => text)

test('flags tags that break release-please', () => {
  for (const title of [
    'feat(html): map <b> and <strike>',
    'fix: support Array<string> config',
    'fix: handle x<y',
    'feat: add <br/> handling',
  ]) {
    assert.deepEqual(texts(title), [title])
  }
})

test('allows text without tags', () => {
  for (const title of [
    'feat(html): map b and strike tags',
    'fix: a < b comparison',
    'chore: a -> b',
    'fix: a > b',
    'docs: thanks <3',
    'fix: map `b` tags',
    'chore: release main',
  ]) {
    assert.deepEqual(texts(title), [])
  }
})

test('checks the commit subject of a single-commit PR, which is squashed under that subject', () => {
  assert.deepEqual(texts('feat: tidy', ['fix(html): ignore <head>\n\nDetails.']), ['fix(html): ignore <head>'])
})

test('ignores commit subjects of a multi-commit PR, which become bullets in the squash body', () => {
  assert.deepEqual(texts('feat: tidy', ['fix(html): ignore <head>', 'chore: lint']), [])
})

test('checks conventional-commit lines in commit bodies, which release-please reads as extra entries', () => {
  const message = 'chore: deps\n\nfix(html): drop <title> text\nBREAKING CHANGE: <div> wrappers are lifted'
  assert.deepEqual(texts('chore: deps', [message]), ['fix(html): drop <title> text', 'BREAKING CHANGE: <div> wrappers are lifted'])
})

test('ignores prose lines in commit bodies', () => {
  const message = 'fix(html): lift wrappers\n\nTop-level <div> wrappers no longer nest blocks.\n* fix(html): ignore <head>'
  assert.deepEqual(texts('fix(html): lift wrappers', [message]), [])
})
