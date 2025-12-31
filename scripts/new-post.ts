#!/usr/bin/env bun

/**
 * 新しいブログ記事のテンプレートを生成するスクリプト
 *
 * 使い方:
 *   bun run new-post "記事タイトル"
 *   bun run new-post "記事タイトル" --slug custom-slug
 */

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
使い方:
  bun run new-post "記事タイトル"
  bun run new-post "記事タイトル" --slug custom-slug

例:
  bun run new-post "TypeScriptの型システムについて"
  bun run new-post "新機能リリース" --slug new-feature-release

オプション:
  --slug    カスタムスラッグを指定（省略時は自動生成）
  --help    このヘルプを表示
  `);
  process.exit(0);
}

const title = args[0];
let slug = '';

// --slug オプションをチェック
const slugIndex = args.indexOf('--slug');
if (slugIndex !== -1 && args[slugIndex + 1]) {
  slug = args[slugIndex + 1];
} else {
  // タイトルから自動生成
  slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // 日本語の場合は日付ベースのスラッグを使用
  if (!/[a-z]/.test(slug)) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    slug = `post-${dateStr}`;
  }
}

const now = new Date();
const dateStr = now.toISOString().split('T')[0];

const template = `---
title: "${title}"
description: ""
pubDate: ${dateStr}
tags: []
draft: false
---

# ${title}

ここに記事の内容を書きます。
`;

const filePath = `src/content/blog/${slug}.md`;

// ファイルが既に存在するかチェック
try {
  await Bun.file(filePath).text();
  console.error(`❌ エラー: ${filePath} は既に存在します`);
  process.exit(1);
} catch {
  // ファイルが存在しない場合は続行
}

// ファイルを作成
await Bun.write(filePath, template);

console.log(`✅ 新しい記事を作成しました: ${filePath}`);
console.log(`📝 タイトル: ${title}`);
console.log(`🔗 スラッグ: ${slug}`);
console.log(`\n次のコマンドで編集できます:`);
console.log(`  code ${filePath}`);
