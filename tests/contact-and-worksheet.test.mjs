import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { contactTopics, contactHref } from '../templates/contact-topics.mjs';

const contactScript = fs.readFileSync(new URL('../assets/contact.js', import.meta.url), 'utf8');
const worksheetScript = fs.readFileSync(new URL('../insights/assets/worksheet.js', import.meta.url), 'utf8');

function contactFixture(search) {
  const listeners = {};
  const options = [{ value: '', textContent: 'General enquiry', dataset: {} }, ...Object.entries(contactTopics).map(([value, data]) => ({ value, textContent: data.label, dataset: { prompt: data.prompt } }))];
  const topic = { value: '', options, get selectedOptions() { return options.filter(option => option.value === this.value); }, addEventListener: (name, fn) => { listeners[`topic:${name}`] = fn; } };
  const hint = { textContent: '' };
  const fields = { name: 'Test reader', company: 'Example & Co', email: 'test@example.com', country: 'UK', message: 'Keep my existing message & questions.' };
  const form = { addEventListener: (name, fn) => { listeners[`form:${name}`] = fn; } };
  const location = { search, href: '' };
  const document = { getElementById: id => ({ contactForm: form, 'contact-topic': topic, 'contact-topic-help': hint })[id] };
  class FormData { get(key) { return key === 'topic' ? topic.value : fields[key]; } }
  vm.runInNewContext(contactScript, { document, window: { location }, URLSearchParams, FormData, queueMicrotask });
  return { topic, hint, fields, location, change: () => listeners['topic:change'](), submit: () => listeners['form:submit']({ preventDefault() {} }) };
}

test('each article topic survives the contact handoff and email encoding', () => {
  for (const [slug, definition] of Object.entries(contactTopics)) {
    const url = new URL(contactHref({ slug }), 'https://www.bluewawa.media');
    const fixture = contactFixture(url.search);
    assert.equal(fixture.topic.value, slug);
    assert.equal(fixture.hint.textContent, definition.prompt);
    assert.equal(fixture.fields.message, 'Keep my existing message & questions.');
    fixture.submit();
    const mail = new URL(fixture.location.href);
    assert.equal(mail.protocol, 'mailto:');
    assert.equal(mail.pathname, 'hello@bluewawa.media');
    assert.ok(mail.searchParams.get('subject').includes(definition.label));
    assert.ok(mail.searchParams.get('body').includes(fixture.fields.message));
    assert.ok(mail.searchParams.get('body').includes(`https://www.bluewawa.media/insights/${slug}/`));
  }
});

test('unknown or hostile topic values fall back to a general enquiry', () => {
  for (const search of ['', '?topic=unknown', '?topic=__proto__', '?topic=%3Cscript%3Ealert(1)%3C/script%3E']) {
    const fixture = contactFixture(search);
    assert.equal(fixture.topic.value, '');
    assert.equal(fixture.hint.textContent, 'Choose a topic, or describe your plans below.');
    fixture.submit();
    const body = new URL(fixture.location.href).searchParams.get('body');
    assert.ok(body.includes('Topic: General enquiry'));
    assert.ok(!body.includes('Related guide:'));
    assert.ok(!body.includes('alert(1)'));
  }
});

test('reader can change or clear a suggested topic without changing their message', () => {
  const fixture = contactFixture('?topic=rednote-marketing-costs');
  fixture.topic.value = 'wechat-content-calendar';
  fixture.change();
  fixture.submit();
  assert.ok(new URL(fixture.location.href).searchParams.get('subject').includes('WeChat content planning'));
  fixture.topic.value = '';
  fixture.change();
  fixture.submit();
  assert.ok(!new URL(fixture.location.href).searchParams.get('body').includes('Related guide:'));
  assert.equal(fixture.fields.message, 'Keep my existing message & questions.');
});

function worksheetFixture({ clipboardFails = false, printFails = false } = {}) {
  const actions = {}, windowEvents = {};
  const copy = { hidden: true, addEventListener: (name, fn) => { actions.copy = fn; } };
  const print = { hidden: true, addEventListener: (name, fn) => { actions.print = fn; } };
  const text = { value: 'BLANK WORKSHEET\nBrand: [ ]\nGuide: https://www.bluewawa.media/insights/example/\n', focused: false, selected: false, focus() { this.focused = true; }, select() { this.selected = true; } };
  const status = { textContent: '' };
  const worksheet = { querySelector: selector => ({ textarea: text, '[role="status"]': status, '[data-copy-worksheet]': copy, '[data-print-worksheet]': print })[selector] };
  const nodes = new Map(), classes = new Set();
  const document = {
    querySelector: () => worksheet,
    getElementById: id => nodes.get(id),
    createElement: tag => ({ tag, children: [], append(child) { this.children.push(child); }, remove() { nodes.delete(this.id); } }),
    body: { append(node) { nodes.set(node.id, node); }, classList: { add: name => classes.add(name), remove: name => classes.delete(name) } }
  };
  let copied, printed;
  const navigator = { clipboard: { async writeText(value) { if (clipboardFails) throw new Error('Clipboard denied'); copied = value; } } };
  const window = { addEventListener: (name, fn) => { windowEvents[name] = fn; }, print() { if (printFails) throw new Error('Printing unavailable'); printed = nodes.get('worksheet-print')?.children[0].textContent; } };
  vm.runInNewContext(worksheetScript, { document, window, navigator });
  return { actions, copy, print, text, status, classes, nodes, windowEvents, get copied() { return copied; }, get printed() { return printed; } };
}

test('copy returns the complete worksheet; denied clipboard access selects a manual fallback', async () => {
  const fixture = worksheetFixture();
  assert.equal(fixture.copy.hidden, false);
  await fixture.actions.copy();
  assert.equal(fixture.copied, fixture.text.value);
  assert.match(fixture.status.textContent, /Worksheet copied/);
  const denied = worksheetFixture({ clipboardFails: true });
  await denied.actions.copy();
  assert.ok(denied.text.focused && denied.text.selected);
  assert.match(denied.status.textContent, /Automatic copying is unavailable/);
});

test('print uses the full worksheet and cleans up after completion or failure', () => {
  const fixture = worksheetFixture();
  assert.equal(fixture.print.hidden, false);
  fixture.actions.print();
  assert.equal(fixture.printed, fixture.text.value);
  assert.ok(fixture.classes.has('printing-worksheet'));
  fixture.windowEvents.afterprint();
  assert.equal(fixture.classes.size, 0);
  assert.equal(fixture.nodes.size, 0);
  const failure = worksheetFixture({ printFails: true });
  failure.actions.print();
  assert.equal(failure.nodes.size, 0);
  assert.equal(failure.classes.size, 0);
  assert.match(failure.status.textContent, /Printing is unavailable/);
});
