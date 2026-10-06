(() => {
  const worksheet = document.querySelector('.worksheet');
  if (!worksheet) return;
  const text = worksheet.querySelector('textarea');
  const status = worksheet.querySelector('[role="status"]');
  const copy = worksheet.querySelector('[data-copy-worksheet]');
  const print = worksheet.querySelector('[data-print-worksheet]');
  copy.hidden = false;
  print.hidden = false;

  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text.value);
      status.textContent = 'Worksheet copied. Paste it into your own document to fill it in.';
    } catch {
      text.focus();
      text.select();
      status.textContent = 'Automatic copying is unavailable. The worksheet is selected; use your device’s Copy command or download the file.';
    }
  });

  function clearPrintView() {
    document.body.classList.remove('printing-worksheet');
    document.getElementById('worksheet-print')?.remove();
  }
  window.addEventListener('afterprint', clearPrintView);
  print.addEventListener('click', () => {
    clearPrintView();
    const printable = document.createElement('div');
    printable.id = 'worksheet-print';
    const content = document.createElement('pre');
    content.textContent = text.value;
    printable.append(content);
    document.body.append(printable);
    document.body.classList.add('printing-worksheet');
    try {
      window.print();
    } catch {
      clearPrintView();
      status.textContent = 'Printing is unavailable here. Download the worksheet to print it from your own document app.';
    }
  });
})();
