// Echo Bot (Recording) functionality
let mediaRecorder;
let recordedChunks = [];
let recordingStartTime;
let recordingTimer;
let isRecording = false;
let echoBotStarted = false;
let micStream = null; // Store the microphone stream globally
const echoBotStartButton = document.getElementById('startBtn');
const chats = document.querySelector('.chats');
const recordButton = document.getElementById('record');
const micInstruction = document.getElementById('micInstruction');

// const mainRecordingPanel = document.getElementById('mainRecordingPanel');
// const recordingLabel = document.getElementById('recordingLabel');
// const recordingTimerElement = document.getElementById('recordingTimer');
// const recordingPulse = document.getElementById('recordingPulse');
// const audioVisualizer = document.getElementById('audioVisualizer');
// const recordedAudioContainer = document.getElementById('recordedAudioContainer');
// const recordedAudio = document.getElementById('recordedAudio');
// const recordingDuration = document.getElementById('recordingDuration');
// const playAgainButton = document.getElementById('playAgain');
// const recordNewButton = document.getElementById('recordNew');
let userId = 'default_user';


// Define handler functions so we can remove them later
function handleRecordButtonClick() {
    if (!isRecording) {
        startRecording(micStream);
    } else {
        stopRecording();
    }
}

function handlePlayAgainButtonClick() {
    recordedAudio.currentTime = 0;
    recordedAudio.play();
}

function handleRecordNewButtonClick() {
    resetRecording();
}

// Initialize recording functionality
async function initializeRecording() {
    try {
        // Get and store microphone stream globally
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        recordButton.addEventListener('click', handleRecordButtonClick);

    } catch (error) {
        console.error('Error accessing microphone:', error);
        recordingLabel.textContent = 'Microphone access denied';
        recordingLabel.className = 'text-sm font-medium text-red-600';
    }
}

function startRecording(stream) {
    recordedChunks = [];
    
    mediaRecorder = new MediaRecorder(stream);

    micInstruction.textContent = 'Listening...';

    mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    });

    mediaRecorder.addEventListener('stop', async() => {
        console.log('Recording stopped');
        micInstruction.textContent = 'Send Voice';
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        recordedChunks = []; 
        const audioURL = URL.createObjectURL(blob);
        console.log('Audio URL:', audioURL);
        // recordedAudio.src = audioURL;        

        
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        try {
            const transcibeRes = await axios.post(`http://localhost:5000/transcribe`, formData);
            const userReqTranscript = transcibeRes.data.text;
            const userResponseDiv = document.createElement('div');
            userResponseDiv.classList.add('message');
            userResponseDiv.classList.add('fromUser');
            userResponseDiv.classList.add('text-xs');
            userResponseDiv.textContent = userReqTranscript;
            chats.appendChild(userResponseDiv);
            
            // Fix: Send as JSON data
            const mrufAudioUrl = await axios.post(`http://localhost:5000/agent/chat/${userId}`, {
                userRes: userReqTranscript
            });
            console.log(mrufAudioUrl.data);
            console.log('MURF LLM Audio URL:', mrufAudioUrl.data);
            const playBack_LLM_Audio = document.getElementById('LLMResponse');
            const responseText = mrufAudioUrl.data['LLM_Response'];
            const LLMResponseDiv = document.createElement('div');
            LLMResponseDiv.classList.add('message');
            LLMResponseDiv.classList.add('fromWimsy');
            LLMResponseDiv.classList.add('text-xs');
            LLMResponseDiv.textContent = responseText;
            const LLMAudio = document.createElement('audio');
            LLMAudio.id = 'murfResponseAudio';
            LLMAudio.autoplay = true;
            LLMAudio.src = mrufAudioUrl.data.audioUrl;
            LLMResponseDiv.appendChild(LLMAudio);
            chats.appendChild(LLMResponseDiv);
        } catch (error) {
            console.error('Unexpected Error', error);
        }
        
        
    });
    mediaRecorder.start();
    isRecording = true;

}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
    }
}


echoBotStartButton.addEventListener('click', () => {
    if (!echoBotStarted) {
        echoBotStarted = true;
        echoBotStartButton.textContent = 'Stop Bot';
        userId = generateUserId();
        console.log('Started Bot with User ID:', userId);
        initializeRecording();
    } else {

        echoBotStarted = false;
        echoBotStartButton.textContent = 'Start Bot';
        
        // Completely stop microphone access
        if (micStream) {
            console.log('Releasing microphone access...');
            micStream.getTracks().forEach(track => {
                track.stop();
                console.log('Microphone track stopped:', track.id);
            });
            micStream = null;
        }
        
        // Also ensure mediaRecorder is properly stopped
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
        }
        
        // Remove event listeners from buttons to fully de-initialize
        recordButton.removeEventListener('click', handleRecordButtonClick);
    }
});

function generateUserId() {
    // Generates a RFC4122 version 4 UUID
    return 'user_' + ([1e7]+-1e3+-4e3+-8e3+-1e11)
        .replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
}

