/**
 * ESLint rule: no-emoji
 *
 * Disallows emoji characters in source code.
 * Use Lucide icons or SVG instead — consistent with GroundUI design principles.
 */

// Covers most common emoji ranges (Emoji_Presentation + Emoji_Modifier_Base + common sequences)
// eslint-disable-next-line no-misleading-character-class
const EMOJI_PATTERN =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{200D}\u{FE0F}\u{20E3}]/u

const MESSAGE =
  'Emoji characters are not allowed. Use Lucide icons or SVG instead.'

import type { Rule } from 'eslint'

function checkForEmoji(node: Rule.Node, value: string, context: Rule.RuleContext) {
  if (EMOJI_PATTERN.test(value)) {
    context.report({ node, message: MESSAGE })
  }
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow emoji characters in source code',
      recommended: true,
    },
    schema: [],
    messages: {
      noEmoji: MESSAGE,
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          checkForEmoji(node, node.value, context)
        }
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          checkForEmoji(node, quasi.value.raw, context)
        }
      },
      JSXText(node: Rule.Node & { value?: string }) {
        if (typeof node.value === 'string') {
          checkForEmoji(node, node.value, context)
        }
      },
    }
  },
}

export default rule
