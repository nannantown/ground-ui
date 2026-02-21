#!/usr/bin/env npx tsx
/**
 * Token Code Generator
 *
 * Reads tokens.json (single source of truth) and generates
 * platform-specific token files:
 *   --ts    → TypeScript consts  (src/tokens/_generated.ts)
 *   --dart  → Dart ThemeExtension (out/flutter/ground_tokens.dart)
 *   --css   → CSS custom properties snippet (out/css/tokens.generated.css)
 *
 * Usage:
 *   npx tsx scripts/generate-tokens.ts --ts
 *   npx tsx scripts/generate-tokens.ts --dart
 *   npx tsx scripts/generate-tokens.ts --ts --dart --css
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const tokens = JSON.parse(readFileSync(resolve(ROOT, 'src/tokens/tokens.json'), 'utf-8'))

const args = process.argv.slice(2)
const targets = new Set(args.length ? args : ['--ts', '--dart', '--css'])

// ── Helpers ─────────────────────────────────────────────

function resolveRef(value: unknown, root: Record<string, unknown>): unknown {
  if (typeof value === 'object' && value !== null && '$ref' in value) {
    const path = (value as { $ref: string }).$ref.split('.')
    let current: unknown = root
    for (const key of path) {
      current = (current as Record<string, unknown>)[key]
    }
    return resolveRef(current, root)
  }
  return value
}

function flattenTokens(
  obj: Record<string, unknown>,
  prefix: string,
  root: Record<string, unknown>,
): [string, string | number][] {
  const result: [string, string | number][] = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    const resolved = resolveRef(value, root)
    if (typeof resolved === 'string' || typeof resolved === 'number') {
      result.push([path, resolved])
    } else if (typeof resolved === 'object' && resolved !== null) {
      result.push(...flattenTokens(resolved as Record<string, unknown>, path, root))
    }
  }
  return result
}

// ── TypeScript Generator ────────────────────────────────

function generateTypeScript(): string {
  const lines = [
    '// Auto-generated from tokens.json — do not edit manually',
    '// Run: npx tsx scripts/generate-tokens.ts --ts',
    '',
  ]

  for (const [section, data] of Object.entries(tokens)) {
    if (section === '$schema') continue
    const flat = flattenTokens(data as Record<string, unknown>, '', tokens)
    const name = section.replace(/([A-Z])/g, '_$1').toLowerCase()

    lines.push(`export const ${name} = {`)
    for (const [path, value] of flat) {
      const escaped = typeof value === 'string' ? value.replace(/'/g, "\\'") : value
      const jsValue = typeof value === 'number' ? value : `'${escaped}'`
      lines.push(`  '${path}': ${jsValue},`)
    }
    lines.push('} as const')
    lines.push('')
  }

  return lines.join('\n')
}

// ── Dart Generator ──────────────────────────────────────

function hexToFlutterColor(hex: string): string {
  const clean = hex.replace('#', '')
  if (clean.length === 6) return `Color(0xFF${clean.toUpperCase()})`
  if (clean.length === 8) return `Color(0x${clean.toUpperCase()})`
  return `Color(0xFF000000) /* unparseable: ${hex} */`
}

function rgbaToFlutterColor(rgba: string): string {
  const match = rgba.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/)
  if (!match) return `Color(0x00000000) /* unparseable: ${rgba} */`
  const r = Math.round(parseFloat(match[1]))
  const g = Math.round(parseFloat(match[2]))
  const b = Math.round(parseFloat(match[3]))
  const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()
  return `Color(0x${toHex(a)}${toHex(r)}${toHex(g)}${toHex(b)})`
}

function toDartColor(value: string): string | null {
  if (value.startsWith('#')) return hexToFlutterColor(value)
  if (value.startsWith('rgba') || value.startsWith('rgb')) return rgbaToFlutterColor(value)
  return null
}

function toDartName(path: string): string {
  // Convert dot-separated path to camelCase.
  // "gray.950" → "gray950", "bg.primary" → "bgPrimary"
  return path
    .split('.')
    .map((seg, i) => {
      if (i === 0) return seg
      // If segment starts with a digit, keep as-is (no capital needed)
      if (/^\d/.test(seg)) return seg
      return seg.charAt(0).toUpperCase() + seg.slice(1)
    })
    .join('')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase()) // kebab-case to camel
}

function generateDart(): string {
  const lines = [
    '// Auto-generated from tokens.json — do not edit manually',
    '// Run: npx tsx scripts/generate-tokens.ts --dart',
    '',
    "import 'package:flutter/material.dart';",
    '',
    '/// GroundUI design tokens.',
    '///',
    '/// Usage:',
    '/// ```dart',
    '/// final tokens = GroundTokens();',
    '/// Container(color: tokens.bgPrimary)',
    '/// ```',
    'class GroundTokens {',
    '  const GroundTokens();',
    '',
  ]

  // Colors
  lines.push('  // ── Colors ──────────────────────────────────')
  for (const section of ['primitive', 'semantic']) {
    const flat = flattenTokens(tokens[section], '', tokens)
    for (const [path, value] of flat) {
      if (typeof value !== 'string') continue
      const dartColor = toDartColor(value)
      if (!dartColor) continue
      const name = toDartName(`${section}.${path}`)
      lines.push(`  final Color ${name} = const ${dartColor};`)
    }
  }

  // Spacing (as doubles)
  lines.push('')
  lines.push('  // ── Spacing ─────────────────────────────────')
  const spacingFlat = flattenTokens(tokens.spacing, '', tokens)
  for (const [path, value] of spacingFlat) {
    if (typeof value !== 'string') continue
    const numMatch = value.match(/^([\d.]+)px$/)
    if (!numMatch) continue
    lines.push(`  final double spacing${toDartName(path).charAt(0).toUpperCase() + toDartName(path).slice(1)} = ${numMatch[1]};`)
  }

  // Radius
  lines.push('')
  lines.push('  // ── Radius ──────────────────────────────────')
  const radiusFlat = flattenTokens(tokens.radius, '', tokens)
  for (const [path, value] of radiusFlat) {
    if (typeof value !== 'string') continue
    const numMatch = value.match(/^([\d.]+)px$/)
    if (!numMatch) continue
    lines.push(`  final double radius${toDartName(path).charAt(0).toUpperCase() + toDartName(path).slice(1)} = ${numMatch[1]};`)
  }

  // Font sizes
  lines.push('')
  lines.push('  // ── Typography ──────────────────────────────')
  const fontSizeFlat = flattenTokens(tokens.typography.fontSize, '', tokens)
  for (const [path, value] of fontSizeFlat) {
    if (typeof value !== 'string') continue
    const numMatch = value.match(/^([\d.]+)px$/)
    if (!numMatch) continue
    lines.push(`  final double fontSize${toDartName(path).charAt(0).toUpperCase() + toDartName(path).slice(1)} = ${numMatch[1]};`)
  }

  // Font weights
  const weightFlat = flattenTokens(tokens.typography.fontWeight, '', tokens)
  for (const [path, value] of weightFlat) {
    if (typeof value !== 'number') continue
    lines.push(`  final FontWeight fontWeight${toDartName(path).charAt(0).toUpperCase() + toDartName(path).slice(1)} = FontWeight.w${value};`)
  }

  // z-index
  lines.push('')
  lines.push('  // ── Z-Index ─────────────────────────────────')
  const zFlat = flattenTokens(tokens.zIndex, '', tokens)
  for (const [path, value] of zFlat) {
    lines.push(`  final int zIndex${toDartName(path).charAt(0).toUpperCase() + toDartName(path).slice(1)} = ${value};`)
  }

  lines.push('}')
  lines.push('')

  // ThemeData extension
  lines.push('/// Extension to integrate GroundUI tokens into Flutter ThemeData.')
  lines.push('///')
  lines.push('/// Usage:')
  lines.push('/// ```dart')
  lines.push("/// final theme = GroundTheme.dark();")
  lines.push('/// MaterialApp(theme: theme)')
  lines.push('/// ```')
  lines.push('class GroundTheme {')
  lines.push('  static const _tokens = GroundTokens();')
  lines.push('')
  lines.push('  static ThemeData dark() {')
  lines.push('    return ThemeData(')
  lines.push('      brightness: Brightness.dark,')
  lines.push('      scaffoldBackgroundColor: _tokens.semanticBgPrimary,')
  lines.push('      cardColor: _tokens.semanticBgCard,')
  lines.push('      colorScheme: ColorScheme.dark(')
  lines.push('        surface: _tokens.semanticBgPrimary,')
  lines.push('        error: _tokens.semanticErrorDefault,')
  lines.push('      ),')
  lines.push('    );')
  lines.push('  }')
  lines.push('')
  lines.push('  static ThemeData light() {')
  lines.push('    return ThemeData(')
  lines.push('      brightness: Brightness.light,')
  lines.push("      scaffoldBackgroundColor: const Color(0xFFFFFFFF),")
  lines.push("      cardColor: const Color(0xFFFFFFFF),")
  lines.push('      colorScheme: ColorScheme.light(')
  lines.push("        surface: const Color(0xFFFFFFFF),")
  lines.push('        error: _tokens.semanticErrorDefault,')
  lines.push('      ),')
  lines.push('    );')
  lines.push('  }')
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

// ── CSS Generator ───────────────────────────────────────

function generateCSS(): string {
  const lines = [
    '/* Auto-generated from tokens.json — do not edit manually */',
    '/* Run: npx tsx scripts/generate-tokens.ts --css */',
    '',
    ':root {',
  ]

  const cssMap: Record<string, string> = {
    'primitive.gray': '--p-gray',
    'primitive.whiteAlpha': '--p-white',
    'primitive.blackAlpha': '--p-black',
    'primitive.green': '--p-green',
    'primitive.emerald': '--p-emerald',
    'primitive.amber': '--p-amber',
    'primitive.red': '--p-red',
    'primitive.blue': '--p-blue',
    'primitive.sky': '--p-sky',
    'primitive.slate': '--p-slate',
    'spacing': '--space',
    'radius': '--radius',
  }

  for (const [section, data] of Object.entries(tokens)) {
    if (section === '$schema') continue
    const flat = flattenTokens(data as Record<string, unknown>, section, tokens)
    for (const [path, value] of flat) {
      let cssVar: string | null = null
      for (const [prefix, varPrefix] of Object.entries(cssMap)) {
        if (path.startsWith(prefix + '.')) {
          const suffix = path.slice(prefix.length + 1).replace(/\./g, '-')
          cssVar = `${varPrefix}-${suffix}`
          break
        }
      }
      if (cssVar) {
        lines.push(`  ${cssVar}: ${value};`)
      }
    }
  }

  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

// ── Main ────────────────────────────────────────────────

function ensureDir(filePath: string) {
  mkdirSync(dirname(filePath), { recursive: true })
}

if (targets.has('--ts')) {
  const out = resolve(ROOT, 'src/tokens/_generated.ts')
  ensureDir(out)
  writeFileSync(out, generateTypeScript())
  console.log(`✓ TypeScript → ${out}`)
}

if (targets.has('--dart')) {
  const out = resolve(ROOT, 'out/flutter/ground_tokens.dart')
  ensureDir(out)
  writeFileSync(out, generateDart())
  console.log(`✓ Dart → ${out}`)
}

if (targets.has('--css')) {
  const out = resolve(ROOT, 'out/css/tokens.generated.css')
  ensureDir(out)
  writeFileSync(out, generateCSS())
  console.log(`✓ CSS → ${out}`)
}

console.log('Done.')
