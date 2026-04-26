'use client'

import { useEffect } from 'react'

const COPY_BUTTON_CLASS = 'sf-copy-button'

const KEYWORDS = /^(?:flow|fun|unit|module|import|from|as|export|return|if|else|while|for|in|match|case|default|try|catch|finally|throw|rethrow|break|saut|and|or|not)$/
const TYPES = /^(?:int8|int16|int32|int64|uint8|uint16|uint32|uint64|float16|bfloat16|float32|float64|float|int|bool|string|char|Flow|list)$/
const BUILTINS = /^(?:map|filter|fold|reduce|any|all|zip_with|flat_map|take_while|drop_while|sort_by|group_by|len|str|fprint|fprintln|now|now_ms|date|year|month|day|hour|minute|second|weekday|sleep|timestamp_to_date|date_to_timestamp)$/
const BOOLEANS = /^(?:true|false|null)$/
const NUMBERS = /^(?:0x[0-9a-fA-F_]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)$/
const OPERATORS = /^(?:=>|->|<-|\+\+|--|\+=|-=|\*=|\/=|%=|\*\*=?|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:])$/

const TOKEN_REGEX = new RegExp(
  [
    '(?:\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    '(?:"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')',
    '(?:0x[0-9a-fA-F_]+|\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)',
    '(?:=>|->|<-|\\+\\+|--|\\+=|-=|\\*=|\\/=|%=|\\*\\*=?|==|!=|<=|>=|&&|\\|\\||[+\\-*/%=<>!&|^~?:])',
    '(?:\\b[A-Za-z_][A-Za-z0-9_]*\\b)',
  ].join('|'),
  'g'
)

type Palette = Record<string, string>

const LIGHT_PALETTE: Palette = {
  'sf-comment': '#64748b',
  'sf-string': '#0f9d58',
  'sf-keyword': '#2563eb',
  'sf-type': '#7c3aed',
  'sf-builtin': '#c2410c',
  'sf-boolean': '#d97706',
  'sf-number': '#b91c1c',
  'sf-operator': '#0f172a',
}

const DARK_PALETTE: Palette = {
  'sf-comment': '#94a3b8',
  'sf-string': '#22c55e',
  'sf-keyword': '#60a5fa',
  'sf-type': '#c084fc',
  'sf-builtin': '#fb923c',
  'sf-boolean': '#fbbf24',
  'sf-number': '#fca5a5',
  'sf-operator': '#e2e8f0',
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function classify(token: string, before: string, after: string): string | null {
  if (token.startsWith('//') || token.startsWith('/*')) return 'sf-comment'
  if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) return 'sf-string'
  if (KEYWORDS.test(token)) return 'sf-keyword'
  if (TYPES.test(token)) return 'sf-type'
  if (BUILTINS.test(token)) return 'sf-builtin'
  if (BOOLEANS.test(token)) return 'sf-boolean'
  if (NUMBERS.test(token)) return 'sf-number'
  if (OPERATORS.test(token)) return 'sf-operator'
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token) && (before === '.' || after === '(')) return 'sf-builtin'
  return null
}

function tokenStyle(tokenClass: string, palette: Palette): string {
  const color = palette[tokenClass] ?? '#0f172a'
  const base = `display:inline; white-space:pre; font-style:normal; color:${color};`
  if (tokenClass === 'sf-comment') {
    return `${base} font-style:italic;`
  }
  if (tokenClass === 'sf-keyword') {
    return `${base} font-weight:600;`
  }
  return base
}

function highlight(source: string, palette: Palette): string {
  let cursor = 0
  let html = ''

  for (const match of source.matchAll(TOKEN_REGEX)) {
    const start = match.index ?? 0
    const value = match[0]
    const before = start > 0 ? source[start - 1] : ''
    const after = start + value.length < source.length ? source[start + value.length] : ''

    if (start > cursor) {
      html += escapeHtml(source.slice(cursor, start))
    }

    const tokenClass = classify(value, before, after)
    const escaped = escapeHtml(value)
    html += tokenClass
      ? `<span class="${tokenClass}" style="${tokenStyle(tokenClass, palette)}">${escaped}</span>`
      : escaped
    cursor = start + value.length
  }

  if (cursor < source.length) {
    html += escapeHtml(source.slice(cursor))
  }

  return html
}

function applySkiFlowHighlighting(root: ParentNode = document) {
  const blocks = root.querySelectorAll<HTMLElement>('div.nextra-code pre code.nextra-code')
  const darkMode = document.documentElement.classList.contains('dark')
  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE

  for (const code of blocks) {
    const source = code.textContent ?? ''

    code.innerHTML = `<span class="sf-root" style="display:inline; white-space:pre;">${highlight(source, palette)}</span>`
    code.dataset.sfProcessed = 'true'

    const pre = code.parentElement
    const wrapper = pre?.parentElement
    if (!pre || !wrapper) continue

    if (!wrapper.querySelector(`button.${COPY_BUTTON_CLASS}`)) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = COPY_BUTTON_CLASS
      button.textContent = 'Copier'
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(source)
          button.textContent = 'Copié'
          window.setTimeout(() => {
            button.textContent = 'Copier'
          }, 1200)
        } catch {
          button.textContent = 'Erreur'
          window.setTimeout(() => {
            button.textContent = 'Copier'
          }, 1200)
        }
      })
      wrapper.appendChild(button)
    }
  }
}

export function SkiFlowDomHighlighter() {
  useEffect(() => {
    applySkiFlowHighlighting()

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (!(mutation.target instanceof HTMLElement)) continue
        applySkiFlowHighlighting(mutation.target)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
