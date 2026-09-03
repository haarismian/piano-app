#!/usr/bin/env node
/* build.js — inline css/js into single-file builds.
   dist/index.html   standalone page, openable from anywhere
   dist/artifact.html  fragment for publishing as a Claude Artifact
     (the host supplies doctype/head/charset/viewport, so those are stripped) */
const fs = require('fs'), path = require('path');
const root = __dirname;
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

const html = read('index.html');
const css = read('css/style.css');
const scripts = ['theory', 'keyboard', 'audio', 'curriculum', 'store', 'session', 'app']
  .map(n => ({ name: n, src: read(`js/${n}.js`) }));

// guard against a stray </script> inside a source file breaking the inline block
for (const s of scripts) {
  if (/<\/script/i.test(s.src)) throw new Error(`js/${s.name}.js contains </script> and cannot be inlined`);
}

const inlineScripts = scripts
  .map(s => `<script>/* ${s.name}.js */\n${s.src}\n</script>`)
  .join('\n');

// the page body, between </header>-ish markers: take everything from <body> to the first <script>
const bodyStart = html.indexOf('<body>') + '<body>'.length;
const bodyEnd = html.indexOf('<script src=');
const body = html.slice(bodyStart, bodyEnd).trim();

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });

const titleTag = (html.match(/<title>[\s\S]*?<\/title>/) || ['<title>Comp</title>'])[0];
/* The favicon href is a data-URI SVG full of "<" and ">", so it cannot be
   matched with [^>]*: that truncates the tag mid-attribute and the unclosed
   quote then swallows the <style> block. Take the whole source line instead. */
const iconTag = (html.split('\n').find(l => l.trim().startsWith('<link rel="icon"')) || '').trim();

// ---- standalone ----
fs.writeFileSync(path.join(root, 'dist/index.html'),
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#12141a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Comp">
${titleTag}
${iconTag}
<style>
${css}
</style>
</head>
<body>
${body}
${inlineScripts}
</body>
</html>
`);

// ---- artifact fragment ----
fs.writeFileSync(path.join(root, 'dist/artifact.html'),
`<title>Comp Piano</title>
<style>
${css}
</style>
${body}
${inlineScripts}
`);

const kb = f => (fs.statSync(path.join(root, f)).size / 1024).toFixed(0) + ' KB';
console.log('dist/index.html   ', kb('dist/index.html'));
console.log('dist/artifact.html', kb('dist/artifact.html'));
