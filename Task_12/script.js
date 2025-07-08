let mediaRecorder;
let audioChunks = [];
let timerInterval;
let seconds = 0;

const startBtn = document.getElementById('startRecord');
const stopBtn = document.getElementById('stopRecord');
const timerDisplay = document.getElementById('timer');
const recordingsList = document.getElementById('recordingsList');

startBtn.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];
  seconds = 0;
  timerDisplay.textContent = '0s';

  mediaRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const listItem = document.createElement('li');

    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `recording-${new Date().getTime()}.webm`;
    downloadLink.textContent = 'Download';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      recordingsList.removeChild(listItem);
    };

    listItem.appendChild(audio);
    listItem.appendChild(document.createElement('br'));
    listItem.appendChild(downloadLink);
    listItem.appendChild(document.createTextNode(' '));
    listItem.appendChild(deleteBtn);

    recordingsList.appendChild(listItem);

    // Reset timer after recording
    timerDisplay.textContent = '0s';
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;

  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `${seconds}s`;
  }, 1000);
});

stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  clearInterval(timerInterval);
});
