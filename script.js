let mediaRecorder;
let recordedChunks = [];
let recordedActions = [];

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia();
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();

    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;
  } catch (error) {
    console.error('Error starting screen recording:', error);
  }
};

const stopRecording = () => {
  mediaRecorder.stop();

  document.getElementById('startBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  document.getElementById('replayBtn').disabled = false;
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
};

const replayActions = () => {
  recordedActions.forEach((action, index) => {
    setTimeout(() => {
      // Perform the recorded action
      // For demonstration purposes, we'll log the action to the console
      console.log(`Action ${index + 1}: ${action}`);
    }, index * 1000); // Delay each action by 1 second
  });
};

document.addEventListener('keydown', (event) => {
  recordedActions.push(`Keydown: ${event.key}`);
});

document.addEventListener('click', (event) => {
  recordedActions.push(`Click: (${event.clientX}, ${event.clientY})`);
});

document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);
document.getElementById('replayBtn').addEventListener('click', replayActions);
