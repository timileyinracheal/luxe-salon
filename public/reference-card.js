const referenceCard = document.querySelector('#reference-card');
const downloadButton = document.querySelector('#download-reference-card');
const feedback = document.querySelector('#reference-card-feedback');

if (referenceCard && downloadButton) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const context = canvas.getContext('2d');
  if (!context) {
    downloadButton.hidden = true;
    feedback.textContent = 'This browser could not create the card image.';
  } else {

    context.fillStyle = '#f7f2e7';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#c9ae76';
    context.lineWidth = 3;
    context.strokeRect(22, 22, 1156, 856);
    context.strokeStyle = 'rgba(167,123,50,.38)';
    context.lineWidth = 1;
    context.strokeRect(40, 40, 1120, 820);

    context.fillStyle = '#8d682b';
    context.strokeStyle = '#a77b32';
    context.lineWidth = 2;
    context.strokeRect(72, 72, 64, 64);
    context.font = '700 24px "Playfair Display", Georgia, serif';
    context.textAlign = 'center';
    context.fillText('LS', 104, 112);

    context.textAlign = 'left';
    context.fillStyle = '#29271f';
    context.font = '700 32px "Playfair Display", Georgia, serif';
    context.fillText('Luxe Salon', 158, 99);
    context.fillStyle = '#797266';
    context.font = '700 14px "DM Sans", sans-serif';
    context.fillText('ABUJA  ·  SUPPORTER CARD', 158, 126);

    context.fillStyle = '#47755c';
    context.strokeStyle = '#b9c9b9';
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(1000, 82, 112, 38, 3);
    context.fillStyle = '#edf1e9';
    context.fill();
    context.stroke();
    context.fillStyle = '#47755c';
    context.textAlign = 'center';
    context.font = '700 14px "DM Sans", sans-serif';
    context.fillText('PENDING', 1056, 106);

    context.textAlign = 'left';
    context.fillStyle = '#a77b32';
    context.font = '700 15px "DM Sans", sans-serif';
    context.fillText('A NEW CHAPTER STARTS WITH YOU', 74, 226);
    context.fillStyle = '#29271f';
    context.font = '600 45px "Playfair Display", Georgia, serif';
    context.fillText('Thank you for helping us', 74, 286);
    context.fillText('open our doors.', 74, 342);

    context.fillStyle = '#292c27';
    context.beginPath();
    context.roundRect(72, 390, 1056, 142, 4);
    context.fill();
    context.fillStyle = '#d9bd7d';
    context.font = '700 15px "DM Sans", sans-serif';
    context.fillText('PRIVATE REFERENCE  ·  TRANSFER NARRATION', 100, 433);
    context.fillStyle = '#fffdf7';
    context.font = '700 38px "DM Sans", sans-serif';
    context.fillText(referenceCard.dataset.reference, 100, 490);

    context.strokeStyle = '#d9cfba';
    context.beginPath();
    context.moveTo(72, 584);
    context.lineTo(1128, 584);
    context.stroke();
    context.fillStyle = '#8e7547';
    context.font = '700 14px "DM Sans", sans-serif';
    context.fillText('SUPPORTING', 74, 625);
    context.fillText('PLEDGE AMOUNT', 758, 625);

    context.fillStyle = '#29271f';
    context.font = '600 24px "DM Sans", sans-serif';
    drawWrappedText(context, referenceCard.dataset.item, 74, 670, 590, 34, 2);
    context.textAlign = 'right';
    context.fillText(referenceCard.dataset.amount, 1126, 670);
    context.textAlign = 'left';

    context.fillStyle = '#797266';
    context.font = '500 14px "DM Sans", sans-serif';
    context.fillText('Keep this reference for transfer and status checks.', 74, 804);
    context.textAlign = 'right';
    context.fillText('LUXE SALON  ·  ABUJA', 1126, 804);

    downloadButton.download = `luxe-salon-${referenceCard.dataset.reference}.png`;
    downloadButton.href = canvas.toDataURL('image/png');
    downloadButton.addEventListener('click', () => {
      feedback.textContent = 'Your reference card has been downloaded.';
    });
  }
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((lineText, index) => {
    context.fillText(lineText, x, y + index * lineHeight);
  });
}