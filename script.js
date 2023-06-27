let mediaRecorder;
let recordedChunks = [];
let recordedActions = [];
let liveStream;

const startRecording = async () => {
  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(displayStream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    liveStream = new MediaStream();
    displayStream.getTracks().forEach(track => liveStream.addTrack(track));

    const liveVideoElement = document.getElementById('liveView');
    liveVideoElement.srcObject = liveStream;
  } catch (error) {
    console.error('Error starting screen recording:', error);
  }
};

const stopRecording = () => {
  mediaRecorder.stop();

  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('replayBtn').disabled = false;

  liveStream.getTracks().forEach(track => track.stop());
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
};

const replayActions = () => {
  let currentIndex = 0;
  const playbackInterval = setInterval(() => {
    if (currentIndex >= recordedActions.length) {
      clearInterval(playbackInterval);
      return;
    }

    const action = recordedActions[currentIndex];
    executeAction(action);
    currentIndex++;
  }, 1000);
};

const executeAction = (action) => {
  const [eventType, eventData] = action.split(':');
  switch (eventType.trim()) {
    case 'Keydown':
      document.dispatchEvent(new KeyboardEvent('keydown', { key: eventData.trim() }));
      break;
    case 'Click':
      const [x, y] = eventData.split(',').map(coord => parseInt(coord));
      document.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y }));
      break;
    default:
      console.warn('Unknown action:', action);
  }
};

document.addEventListener('keydown', (event) => {
  recordedActions.push(`Keydown: ${event.key}`);
});

document.addEventListener('click', (event) => {
  recordedActions.push(`Click: ${event.clientX}, ${event.clientY}`);
});

document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);
document.getElementById('replayBtn').addEventListener('click', replayActions);
