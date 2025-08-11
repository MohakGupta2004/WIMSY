const getData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const getVoiceUrl = async (text) => {
    try {
        const response = await axios.post('http://localhost:5000/server', { 'text': text });
        console.log(response.data);
        return response.data;
    } catch (error) {   
        console.error('Error fetching voice URL:', error);
    }
}

// TTS Bot 
const audioElement = document.querySelector('audio');
const audioContainer = document.querySelector('.audio');
const generateAnotherButton = document.querySelector('.generateAnother');
const generateVoiceBtn = document.querySelector('#generateVoiceBtn');
const generateVoiceBtnImg = document.querySelector('#generateVoiceBtnImg');
const ttsLoading = document.querySelector('#ttsLoading');
const loadingCat = document.querySelector('#loadingCat');
const form = document.querySelector('.textForm');


const catPoses = [
    'sq1.png',
    'sq2.png', 
    'sq3.png',
];

let catAnimationInterval;

function startCatAnimation() {
    let currentPose = 0;
    catAnimationInterval = setInterval(() => {
        if (loadingCat) {
            loadingCat.src = catPoses[currentPose];
            currentPose = (currentPose + 1) % catPoses.length;
        }
    }, 500);
}

function stopCatAnimation() {
    if (catAnimationInterval) {
        clearInterval(catAnimationInterval);
        catAnimationInterval = null;
    }
    if (loadingCat) {
        loadingCat.src = 'cat-removebg-preview.png';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if(!text) {
        alert('Please enter some text');
        return;
    }
    
    // loading state
    ttsLoading.classList.remove('hidden');
    audioContainer.classList.add('hidden');
    startCatAnimation(); 
    
    try {
        const voiceUrl = await getVoiceUrl(text);
        audioElement.src = voiceUrl['audioUrl'];
        audioContainer.classList.remove('hidden');
        generateVoiceBtnImg.src = 'catWithHeadphn.png';
        e.target.text.value = '';
    } catch (error) {
        console.error('Error generating audio:', error);
        alert('Failed to generate audio. Please try again.');
    } finally {
        // Hide loading state
        ttsLoading.classList.add('hidden');
        stopCatAnimation(); // Stop the cat animation
    }
});

generateAnotherButton.addEventListener('click', () => {
    audioElement.src = '';
    audioContainer.classList.add('hidden');
    ttsLoading.classList.add('hidden');
    stopCatAnimation(); // Make sure animation is stopped
    generateVoiceBtnImg.src = 'catWithMic.png';
    form.text.value = '';
    form.text.focus();
});


// Echo Bot (Recording) functionality
let mediaRecorder;
let recordedChunks = [];
let recordingStartTime;
let recordingTimer;
let isRecording = false;
let echoBotStarted = false;
let micStream = null; // Store the microphone stream globally
const echoBotStartButton = document.getElementById('startEchoBot');
const mainRecordingPanel = document.getElementById('mainRecordingPanel');
const recordButton = document.getElementById('record');
const recordingLabel = document.getElementById('recordingLabel');
const recordingTimerElement = document.getElementById('recordingTimer');
const recordingPulse = document.getElementById('recordingPulse');
const audioVisualizer = document.getElementById('audioVisualizer');
const recordedAudioContainer = document.getElementById('recordedAudioContainer');
const recordedAudio = document.getElementById('recordedAudio');
const recordingDuration = document.getElementById('recordingDuration');
const playAgainButton = document.getElementById('playAgain');
const recordNewButton = document.getElementById('recordNew');
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
        
        // Add event listeners with named handler functions
        recordButton.addEventListener('click', handleRecordButtonClick);
        playAgainButton?.addEventListener('click', handlePlayAgainButtonClick);
        recordNewButton?.addEventListener('click', handleRecordNewButtonClick);

    } catch (error) {
        console.error('Error accessing microphone:', error);
        recordingLabel.textContent = 'Microphone access denied';
        recordingLabel.className = 'text-sm font-medium text-red-600';
    }
}

function startRecording(stream) {
    recordedChunks = [];
    
    // Hide the progress container when starting a new recording
    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    uploadProgressContainer?.classList.add('hidden');
    
    // Also hide success and error boxes if they exist
    const successBox = document.getElementById('uploadSuccessBox');
    const errorBox = document.getElementById('uploadErrorBox');
    if (successBox) successBox.classList.add('hidden');
    if (errorBox) errorBox.classList.add('hidden');
    
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    });

    mediaRecorder.addEventListener('stop', async() => {
        console.log('Recording stopped');
        const blob = new Blob(recordedChunks, { type: 'audio/webm' });
        recordedChunks = []; 
        const audioURL = URL.createObjectURL(blob);
        console.log('Audio URL:', audioURL);
        recordedAudio.src = audioURL;
        // Show recorded audio container first so user can see the progress
        recordedAudioContainer.classList.remove('hidden');
        
        
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        try {
            const mrufAudioUrl = await axios.post(`http://localhost:5000/agent/chat/${userId}`, formData);
            console.log('MRUF LLM Audio URL:', mrufAudioUrl.data);
            const playBack_LLM_Audio = document.getElementById('LLMResponse');
            playBack_LLM_Audio.src = mrufAudioUrl.data.audioUrl;     
        } catch (error) {
            console.error('Unexpected Error', error);
        }
        
        // Calculate and display duration
        const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        recordingDuration.textContent = `Duration: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    // Start recording
    mediaRecorder.start();
    isRecording = true;
    recordingStartTime = Date.now();
    
    // Update UI
    recordButton.classList.add('animate-pulse');
    recordingPulse?.classList.remove('hidden');
    recordingLabel.textContent = 'Recording... Tap to stop';
    recordingLabel.className = 'text-sm font-medium text-red-600';
    recordingTimerElement?.classList.remove('hidden');
    audioVisualizer?.classList.remove('hidden');
    
    // Start timer
    startTimer();
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Update UI
        recordButton.classList.remove('animate-pulse');
        recordingPulse?.classList.add('hidden');
        recordingLabel.textContent = 'Processing...';
        recordingLabel.className = 'text-sm font-medium text-orange-600';
        audioVisualizer?.classList.add('hidden');
        
        // Stop timer
        if (recordingTimer) {
            clearInterval(recordingTimer);
        }
        
        setTimeout(() => {
            recordingLabel.textContent = 'Tap to Start Recording';
            recordingLabel.className = 'text-sm font-medium text-orange-700';
        }, 1000);
    }
}

function startTimer() {
    recordingTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        recordingTimerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function resetRecording() {
    recordedAudioContainer?.classList.add('hidden');
    recordingLabel.textContent = 'Tap to Start Recording';
    recordingLabel.className = 'text-sm font-medium text-orange-700';
    recordingTimerElement?.classList.add('hidden');
    recordingTimerElement.textContent = '00:00';
    transcriptText.textContent = ''; 
    
    // Reset progress bar and hide it
    const uploadProgressContainer = document.getElementById('uploadProgressContainer');
    const innerLoadingBar = document.querySelector('.innerLoadingBar');
    const uploadStatusText = document.querySelector('.uploadStatusText');
    if (innerLoadingBar && uploadStatusText) {
        innerLoadingBar.style.width = '0%';
        innerLoadingBar.classList.remove('bg-green-500', 'bg-red-500');
        innerLoadingBar.classList.add('bg-orange-500');
        uploadStatusText.textContent = 'Preparing...';
        
        // Hide the progress container
        uploadProgressContainer?.classList.add('hidden');
    }
    
    // Hide success and error boxes if they exist
    const successBox = document.getElementById('uploadSuccessBox');
    const errorBox = document.getElementById('uploadErrorBox');
    if (successBox) successBox.classList.add('hidden');
    if (errorBox) errorBox.classList.add('hidden');
}

echoBotStartButton.addEventListener('click', () => {
    if (!echoBotStarted) {
        echoBotStarted = true;
        mainRecordingPanel.classList.remove('hidden');
        echoBotStartButton.textContent = 'Stop Bot';
        userId = generateUserId();
        console.log('Starting Echo Bot with User ID:', userId);
        initializeRecording();
    } else {
        echoBotStarted = false;
        mainRecordingPanel.classList.add('hidden');
        echoBotStartButton.textContent = 'Start Bot';
        resetRecording();
        
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
        playAgainButton?.removeEventListener('click', handlePlayAgainButtonClick);
        recordNewButton?.removeEventListener('click', handleRecordNewButtonClick);
    }
});

function generateUserId() {
    // Generates a RFC4122 version 4 UUID
    return 'user_' + ([1e7]+-1e3+-4e3+-8e3+-1e11)
        .replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
}

