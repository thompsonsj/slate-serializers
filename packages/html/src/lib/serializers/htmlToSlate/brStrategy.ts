import { ElementType } from 'htmlparser2'
import { ChildNode, Element, isTag } from 'domhandler'
import { getName } from 'domutils'

import { isBlock } from '../../utilities/blocks'
import { BrStrategy } from './config/types'
import { Context } from './whitespace'

/** Block tags that form document structure — not intrinsic break tags like `br`/`wbr`. */
const isStructuralBlock = (tagName: string) =>
  isBlock(tagName) && tagName !== 'br' && tagName !== 'wbr'

const isIgnorableSibling = (node: ChildNode | null | undefined): boolean => {
  if (!node) return false
  if (node.type === ElementType.Text) {
    return !/\S/.test((node as unknown as { data?: string }).data || '')
  }
  if (isTag(node)) {
    const name = getName(node)
    return name === 'br' || name === 'wbr'
  }
  return false
}

/** True when a later sibling (skipping whitespace / br) is a structural block element. */
export const isFollowedByStructuralBlock = (el: Element): boolean => {
  let sibling: ChildNode | null | undefined = el.next
  while (sibling) {
    if (isTag(sibling) && isStructuralBlock(getName(sibling))) {
      return true
    }
    if (!isIgnorableSibling(sibling)) {
      return false
    }
    sibling = sibling.next
  }
  return false
}

/** First `<br>` in a run that precedes a structural block (skipping whitespace). */
export const isFirstBrBeforeStructuralBlock = (el: Element): boolean => {
  if (!isFollowedByStructuralBlock(el)) return false
  let sibling: ChildNode | null | undefined = el.prev
  while (sibling) {
    if (isTag(sibling) && getName(sibling) === 'br') {
      return false
    }
    if (!isIgnorableSibling(sibling)) {
      return true
    }
    sibling = sibling.prev
  }
  return true
}

/**
 * Text payload for a converted `<br>`, or `null` to omit the break entirely.
 */
export const resolveBrText = ({
  el,
  context,
  brStrategy = 'block',
}: {
  el: Element
  context: Context | ''
  brStrategy?: BrStrategy
}): string | null => {
  if (brStrategy === 'block') {
    return context ? '\n' : ''
  }

  // newline: collapse a run of <br> immediately before a block to a single \n
  if (isFollowedByStructuralBlock(el)) {
    return isFirstBrBeforeStructuralBlock(el) ? '\n' : null
  }

  return '\n'
}

const isPlainTextLeaf = (node: unknown): node is { text: string } => {
  if (!node || typeof node !== 'object') return false
  const keys = Object.keys(node)
  return keys.length === 1 && keys[0] === 'text' && typeof (node as { text: unknown }).text === 'string'
}

const isDefaultBlock = (node: unknown): node is { children: unknown[] } => {
  if (!node || typeof node !== 'object' || !('children' in node)) return false
  const keys = Object.keys(node)
  return keys.length === 1 && keys[0] === 'children' && Array.isArray((node as { children: unknown[] }).children)
}

/** Merge adjacent plain-text leaves (same marks: none) so `\n` joins neighboring text. */
export const coalescePlainTextLeaves = (nodes: unknown[]): unknown[] => {
  const result: unknown[] = []
  for (const node of nodes) {
    if (node && typeof node === 'object' && Array.isArray((node as { children?: unknown[] }).children)) {
      const element = node as { children: unknown[] }
      result.push({
        ...element,
        children: coalescePlainTextLeaves(element.children),
      })
      continue
    }
    if (isPlainTextLeaf(node)) {
      const prev = result[result.length - 1]
      if (isPlainTextLeaf(prev)) {
        prev.text += node.text
        continue
      }
    }
    result.push(node)
  }
  return result
}

/**
 * At the document root, merge consecutive default blocks whose children are only
 * plain text into a single block (so top-level `Line 1<br>Line 2` becomes one node).
 */
export const coalesceDefaultBlocks = (nodes: unknown[]): unknown[] => {
  const coalescedChildren = coalescePlainTextLeaves(nodes)
  const result: unknown[] = []

  for (const node of coalescedChildren) {
    if (isDefaultBlock(node) && node.children.every(isPlainTextLeaf)) {
      const prev = result[result.length - 1]
      if (isDefaultBlock(prev) && prev.children.every(isPlainTextLeaf)) {
        const merged = coalescePlainTextLeaves([...prev.children, ...node.children])
        prev.children = merged as { text: string }[]
        continue
      }
    }
    result.push(node)
  }

  return result
}
