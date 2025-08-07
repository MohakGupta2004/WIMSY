
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
const innerLoadingBar = document.querySelector('.innerLoadingBar');
const transcriptText = document.getElementById('transcriptText');



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
        
        // Reset and show progress bar
        const uploadProgressContainer = document.getElementById('uploadProgressContainer');
        const innerLoadingBar = document.querySelector('.innerLoadingBar');
        const uploadStatusText = document.querySelector('.uploadStatusText');
        
        // Show the progress container
        uploadProgressContainer.classList.remove('hidden');
        
        // Reset progress bar to initial state
        innerLoadingBar.style.width = '0%';
        innerLoadingBar.classList.remove('bg-green-500', 'bg-red-500');
        innerLoadingBar.classList.add('bg-orange-500');
        uploadStatusText.textContent = 'Preparing...';
        
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');

        try {
            // Simulate progress updates (since axios doesn't have built-in upload progress for small files)
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 10;
                if (progress <= 90) {
                    innerLoadingBar.style.width = `${progress}%`;
                    uploadStatusText.textContent = `Uploading ${progress}%`;
                }
            }, 200);
            
            // Actual upload
            const transcribe = await axios.post('http://localhost:5000/transcribe', formData); 
            console.log('Transcription response:', transcribe.data);
            transcriptText.textContent = transcribe.data.text || 'No transcription available';
            const post = await axios.post('http://localhost:5000/upload', formData);
            console.log('Post response:', post.data);
            
            // Complete the progress animation
            clearInterval(progressInterval);
            innerLoadingBar.style.width = '100%';
            innerLoadingBar.classList.remove('bg-orange-500');
            innerLoadingBar.classList.add('bg-green-500');
            uploadStatusText.textContent = 'Completed Upload 100%';
            
            // Create a separate success box with details
            const duration = Math.floor((Date.now() - recordingStartTime) / 1000);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const durationText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Create success box if it doesn't exist already
            let successBox = document.getElementById('uploadSuccessBox');
            if (!successBox) {
                successBox = document.createElement('div');
                successBox.id = 'uploadSuccessBox';
                successBox.className = 'mt-3 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg p-3';
                uploadProgressContainer.insertAdjacentElement('afterend', successBox);
            }
            
            // Update success box content
            successBox.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-green-700">✅ Upload Successful</span>
                    <span class="text-xs text-green-600">File: recording.webm</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-green-600">Duration: ${durationText}</span>
                    <span class="text-green-600">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
            successBox.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error uploading audio:', error);
            innerLoadingBar.style.width = '100%';
            innerLoadingBar.classList.remove('bg-orange-500');
            innerLoadingBar.classList.add('bg-red-500');
            uploadStatusText.textContent = 'Completed Upload 100%';
            
            // Create error notification box
            let errorBox = document.getElementById('uploadErrorBox');
            if (!errorBox) {
                errorBox = document.createElement('div');
                errorBox.id = 'uploadErrorBox';
                errorBox.className = 'mt-3 bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-300 rounded-lg p-3';
                uploadProgressContainer.insertAdjacentElement('afterend', errorBox);
            }
            
            errorBox.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-red-700">❌ Upload Failed</span>
                    <span class="text-xs text-red-600">File: recording.webm</span>
                </div>
                <div class="text-xs text-red-600">
                    Please try again. Server may be unavailable.
                </div>
            `;
            errorBox.classList.remove('hidden');
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

