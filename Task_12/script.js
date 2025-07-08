let mediaRecorder;
let audioChunks = [];
let timerInterval;
let seconds = 0;

const startBtn = document.getElementById('startRecord');
const stopBtn = document.getElementById('stopRecord');
const timerDisplay = document.getElementById('timer');
const recordingsList = document.getElementById('recordingsList');

startBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.onstart = () => {
      seconds = 0;
      timerDisplay.textContent = '0s';

      timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `${seconds}s`;
      }, 1000);
    };

    mediaRecorder.onstop = () => {
      clearInterval(timerInterval);
      timerDisplay.textContent = '0s';

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
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;

  } catch (error) {
    alert("Microphone access denied or not supported.");
    console.error("Recording error:", error);
  }
});

stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});
