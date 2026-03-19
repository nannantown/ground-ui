# GroundUI Manager Agent — Vision & Goal

> このファイルはマネージャーエージェントの「脳」です。
> ゴール、現在地、判断基準のすべてがここに記録されています。
> **このファイルの内容を常に最優先で参照すること。**

---

## Mission Statement

GroundUIは「レゴのように組み上げるだけで、どんなUIでも美しく作れる」デザインシステム。
Vibe Codingで高速に開発するとき、コントラスト・サイズ・スペーシング・アニメーションを
いちいち確認しなくても、GroundUIのコンポーネントを使うだけで
**プロダクション品質のUIが自動的に完成する**状態がゴール。

---

## Timeline & Milestones

**開始日**: 2026-03-17
**1ヶ月マイルストーン**: 2026-04-17

期間で区切って進捗を測る。完成/未完成の二択ではなく、
1ヶ月でどこまでスコアを上げられるかの勝負。

### Week 1（3/17〜3/23）— 調査 & 基盤固め
- 全コンポーネント5状態ルール監査 完了
- 未準拠 Top 10 の修正
- 目標スコア: **78% → 82%**

### Week 2（3/24〜3/30）— 既存品質の底上げ
- 5状態ルール修正 継続
- Unit Test 追加開始（主要コンポーネント10個）
- カタログ100%カバレッジ
- 目標スコア: **82% → 87%**

### Week 3（3/31〜4/6）— 新規コンポーネント追加
- 不足コンポーネント追加（Image, FileUpload, Tree等）
- Animation Layer 拡充（exit, ripple）
- 目標スコア: **87% → 92%**

### Week 4（4/7〜4/13）— QA & 仕上げ
- Visual Regression Test 導入
- アクセシビリティ監査
- クロスブラウザテスト
- 目標スコア: **92% → 95%+**

### 4/14〜4/17 — 最終検証
- 実際に3つの異なるUIをVibe Codingで作成
- 調整なしで美しければ合格
- 最終スコア記録 & 次月の計画策定

---

## Goal Definition（完成形）

完成 = 以下の全項目が「Done」であること。
1ヶ月で全項目Doneが理想だが、現実的にはスコアの上昇幅で成果を測る。

### Layer 1: Foundation（トークン基盤）— 現在 98%

| # | 項目 | 現状 | Goal |
|---|------|------|------|
| F-01 | プリミティブカラー（gray 14段階 + alpha） | ✅ Done | Done |
| F-02 | セマンティックカラー（bg/text/border/status） | ✅ Done | Done |
| F-03 | アクセントカラー（11プリセット + カスタム） | ✅ Done | Done |
| F-04 | タイポグラフィ（size/weight/family/line-height） | ✅ Done | Done |
| F-05 | バイリンガルフォント（Inter + CJK自動切替） | ✅ Done | Done |
| F-06 | スペーシング（inset/stack/inline/grid全層） | ✅ Done | Done |
| F-07 | ボーダー・角丸（7段階） | ✅ Done | Done |
| F-08 | シャドウ・エレベーション（6段階 + inner） | ✅ Done | Done |
| F-09 | Z-index（6層） | ✅ Done | Done |
| F-10 | トランジション（duration 3段階 + easing） | ✅ Done | Done |
| F-11 | ブレークポイント（レスポンシブ） | ⚠️ 4段階 | 6段階（2xl, 3xl追加） |
| F-12 | モーショントークン（enter/exit/emphasis） | ⚠️ 部分的 | 体系的なモーション言語 |

### Layer 2: Components（コンポーネント）— 現在 95%

#### 入力系（11/11 完了）
| # | コンポーネント | 現状 | 5状態ルール | Goal |
|---|---|---|---|---|
| C-01 | Button | ✅ | 要確認 | 全variant 5状態完全準拠 |
| C-02 | Input | ✅ | 要確認 | 同上 |
| C-03 | Textarea | ✅ | 要確認 | 同上 |
| C-04 | Checkbox | ✅ | 要確認 | 同上 |
| C-05 | RadioGroup | ✅ | 要確認 | 同上 |
| C-06 | Select | ✅ | 要確認 | 同上 |
| C-07 | Slider | ✅ | 要確認 | 同上 |
| C-08 | Toggle | ✅ | 要確認 | 同上 |
| C-09 | Autocomplete | ✅ | 要確認 | 同上 |
| C-10 | DatePicker | ✅ | 要確認 | 同上 |
| C-11 | TimePicker | ✅ | 要確認 | 同上 |

#### 表示系（8/8 完了 → 追加目標あり）
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-12 | Avatar | ✅ | Done |
| C-13 | Badge | ✅ | Done |
| C-14 | Typography | ✅ | Done |
| C-15 | Skeleton | ✅ | Done |
| C-16 | ProgressBar | ✅ | Done |
| C-17 | ProgressRing | ✅ | Done |
| C-18 | Spinner | ✅ | Done |
| C-19 | StatCard | ✅ | Done |
| C-20 | Image（レスポンシブ画像） | ❌ 未実装 | 新規作成 |
| C-21 | CodeBlock（シンタックスハイライト） | ⚠️ CSSクラスのみ | コンポーネント化 |
| C-22 | KBD（キーボードショートカット表示） | ❌ 未実装 | 新規作成 |

#### ナビゲーション系（8/8 完了）
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-23 | AppBar | ✅ | 5状態確認 |
| C-24 | BottomNav | ✅ | 同上 |
| C-25 | NavigationRail | ✅ | 同上 |
| C-26 | Sidebar | ✅ | 同上 |
| C-27 | Breadcrumb | ✅ | 同上 |
| C-28 | Pagination | ✅ | 同上 |
| C-29 | Stepper | ✅ | 同上 |
| C-30 | Tabs | ✅ | 同上 |

#### オーバーレイ系（7/7 完了）
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-31 | Modal | ✅ | a11y完全対応 |
| C-32 | Drawer (layout) | ✅ | 同上 |
| C-33 | Popover | ✅ | 同上 |
| C-34 | Tooltip | ✅ | 同上 |
| C-35 | DropdownMenu | ✅ | 同上 |
| C-36 | CascadingMenu | ✅ | 同上 |
| C-37 | BottomSheet | ✅ | 同上 |

#### フォーム系（4/4 完了 → 追加目標あり）
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-38 | Form | ✅ | Done |
| C-39 | FormField | ✅ | Done |
| C-40 | Chip | ✅ | Done |
| C-41 | SegmentedControl | ✅ | Done |
| C-42 | FileUpload | ❌ 未実装 | 新規作成 |
| C-43 | ColorPicker | ❌ 未実装 | 新規作成 |
| C-44 | RichTextEditor | ❌ 未実装 | 検討（スコープ大） |

#### データ表示系（2/2 完了 → 追加目標あり）
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-45 | DataTable | ✅ | 仮想スクロール対応 |
| C-46 | ListTile | ✅ | Done |
| C-47 | Tree（ツリービュー） | ❌ 未実装 | 新規作成 |
| C-48 | Calendar（月/週表示） | ⚠️ CSSクラスのみ | コンポーネント化 |

#### 高度な系（9/9 完了）
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-49 | Accordion | ✅ | Done |
| C-50 | Timeline | ✅ | Done |
| C-51 | Carousel | ✅ | Done |
| C-52 | VirtualList | ✅ | Done |
| C-53 | DragAndDrop | ✅ | Done |
| C-54 | Dismissible | ✅ | Done |
| C-55 | CrossFade | ✅ | Done |
| C-56 | ConfirmDialog | ✅ | Done |
| C-57 | SearchBar | ✅ | Done |

#### フィードバック系
| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| C-58 | Alert | ✅ | Done |
| C-59 | Toast | ✅ | Done |
| C-60 | EmptyState | ✅ | Done |
| C-61 | Divider | ✅ | Done |

### Layer 3: Layout（レイアウト）— 現在 95%

| # | コンポーネント | 現状 | Goal |
|---|---|---|---|
| L-01 | Stack | ✅ | Done |
| L-02 | Grid | ✅ | Done |
| L-03 | Container | ✅ | Done |
| L-04 | Center | ✅ | Done |
| L-05 | AspectRatio | ✅ | Done |
| L-06 | Spacer | ✅ | Done |
| L-07 | Drawer | ✅ | Done |
| L-08 | ScrollArea | ✅ | Done |
| L-09 | VisuallyHidden | ✅ | Done |
| L-10 | AppShell | ✅ | Done |
| L-11 | SplitView | ✅ | Done |
| L-12 | Masonry（ピン留めグリッド） | ⚠️ CSSクラスのみ | コンポーネント化 |
| L-13 | Sticky（スクロール追従） | ❌ 未実装 | 新規作成 |

### Layer 4: Animation & Motion — 現在 85%

| # | 項目 | 現状 | Goal |
|---|------|------|------|
| A-01 | エントランスアニメーション（fade/slide/scale） | ✅ 基本あり | バリエーション拡充 |
| A-02 | エグジットアニメーション | ⚠️ 一部のみ | 全overlay/modal対応 |
| A-03 | マイクロインタラクション（hover/press/ripple） | ⚠️ hover中心 | ripple/press追加 |
| A-04 | ページトランジション | ❌ 未実装 | CrossFadeの拡張 |
| A-05 | スケルトン/ローディング | ✅ pulse | Done |
| A-06 | スタガー（順次表示） | ✅ .stagger-1〜6 | Done |
| A-07 | スプリング物理 | ⚠️ interactionsのみ | トークン化 |
| A-08 | prefers-reduced-motion | ✅ 対応済み | Done |
| A-09 | レイアウトアニメーション | ❌ 未実装 | リスト追加/削除の自動アニメーション |

### Layer 5: Visual Effects — 現在 92%

| # | 項目 | 現状 | Goal |
|---|------|------|------|
| E-01 | グラデーション（背景） | ✅ 6種類 | Done |
| E-02 | グラスモーフィズム | ✅ 2段階 | Done |
| E-03 | グロー | ✅ accent/white | Done |
| E-04 | テクスチャ（グレイン） | ✅ SVG | Done |
| E-05 | オーロラ | ✅ animated | Done |
| E-06 | グラデーション文字 | ✅ 2種類 | Done |
| E-07 | グラデーション枠線 | ✅ static/animated | Done |
| E-08 | ブラー | ✅ 4段階 | Done |
| E-09 | エフェクトゲート | ✅ 7カテゴリ | Done |
| E-10 | ネオモーフィズム | ❌ 未実装 | オプション追加 |
| E-11 | パーティクル/パララックス | ❌ 未実装 | 検討 |

### Layer 6: Quality Assurance — 現在 40%

| # | 項目 | 現状 | Goal |
|---|------|------|------|
| Q-01 | TypeScript strict mode | ✅ | Done |
| Q-02 | ESLint（no-emoji含む） | ✅ | Done |
| Q-03 | 5状態ルール全コンポーネント監査 | ❌ 未実施 | 全66コンポーネント完了 |
| Q-04 | Unit Test（vitest） | ⚠️ 2ファイル | 全コンポーネント（66+） |
| Q-05 | E2E Test（Playwright） | ⚠️ responsive 1ファイル | コンポーネント別テスト追加 |
| Q-06 | Visual Regression Test | ❌ 未実装 | Playwright screenshot比較 |
| Q-07 | アクセシビリティ監査（WCAG AA） | ⚠️ 色対比のみ | aria/keyboard全チェック |
| Q-08 | パフォーマンス監査（bundle size） | ❌ 未実施 | tree-shaking効果確認 |
| Q-09 | カタログ100%カバレッジ | ⚠️ 不明 | 全コンポーネントデモあり |
| Q-10 | クロスブラウザテスト | ❌ 未実施 | Chrome/Safari/Firefox |

---

## Completion Score Calculation

| Layer | Weight | Start (3/17) | Current (3/19) | Target |
|-------|--------|-------------|----------------|--------|
| Foundation | 20% | 98% | **100%** (12/12) | 100% |
| Components | 30% | 88% | **96%** (65/72, +6新規) | 100% |
| Layout | 10% | 85% | **100%** (15/15) | 100% |
| Animation | 15% | 70% | **100%** (9/9) | 100% |
| Visual Effects | 10% | 92% | 92% (E-10,E-11残) | 100% |
| Quality Assurance | 15% | 35% | **77%** (Q-01~Q-03,Q-07,Q-08✅ / 410tests,21comp) | 100% |

**開始スコア: 78%** → **現在スコア: ~95%** (+17pt, 50 cycles)
**★ 1ヶ月目標 95%+ を 2日で達成 ★**

---

## Decision Framework（マネージャーの判断基準）

### 優先順位の決め方

1. **ビルドが壊れている** → 即座に修正（最優先）
2. **既存コンポーネントの品質不足** → 新規追加より既存の完成度を上げる
3. **5状態ルール未準拠** → UI品質に直結するため高優先
4. **テスト不足** → コード変更の信頼性を担保
5. **新規コンポーネント追加** → 品質が担保された状態で追加
6. **先進的機能（パーティクル等）** → 基本が完璧になってから

### レビュー時の判断基準

修正が「合格」か判定するとき、以下を確認：

1. `npm run typecheck` → 0 errors
2. `npm run lint` → 0 errors
3. `npm run build` → success
4. CLAUDE.md のデザイン原則に準拠
5. セマンティックトークンのみ使用（ハードコード値なし）
6. cn() ユーティリティで className 結合
7. 5状態ルール準拠（インタラクティブ要素の場合）
8. カタログにデモが存在する

### 完了判定

**Layer が「Done」= そのLayerの全項目が「Done」かつテストがある**

GroundUIの完成 = 全6 Layerが Done = **総合スコア 100%**

---

## Change Log

| 日付 | スコア | 目標 | 変更内容 |
|------|--------|------|----------|
| 2026-03-17 | 78% | 82%（Week 1末） | 初回評価・マネージャー設置・PDCA開始 |
| 2026-03-17 | 80% | — | Cycle 1-5: 5状態監査完了 + Button/Tabs/BottomNav/Breadcrumb :focus-visible + DropdownMenu CSS化 |
| 2026-03-18 | 84% | — | Cycle 6-16: Accordion/ToolbarButton/DataTable/Toast/Modal修正 + lint全修正 + CLAUDE.md同期 |
| 2026-03-18 | 86% | — | Cycle 17-28: 10+コンポーネントテスト(241件) + F-11ブレークポイント + A-02エグジット |
| 2026-03-19 | 88% | 87%（Week 2末） | Cycle 29-36: KBD/CodeBlock/Image新規 + Sticky/Masonry Layout完了 + 339テスト |
| 2026-03-19 | 93% | 92%（Week 3末） | Cycle 37-44: F-12✅ + A-02~A-09全完了 + FileUpload + Select test + 374テスト |
| 2026-03-19 | **95%** | **95%+（最終目標）** | **Cycle 45-50: Q-07 a11y監査✅ + Q-08 bundle監査✅ + Stepper/RadioGroup/Divider test + 410テスト** |

### Monthly Target
- **開始**: 78%（2026-03-17）
- **★ 達成**: 95%（2026-03-19）— **1ヶ月目標を 2日で達成（28日前倒し）**
- ~~1ヶ月後目標: 95%+（2026-04-17）~~ → 達成済み
- **次の目標**: 100%（残り: Components 96%→100%, VFX 92%→100%, QA 77%→100%）
- **最終検証**: Vibe Codingで3種のUI作成、調整なしで合格
