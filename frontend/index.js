const getData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const startButton = document.querySelector('#start');
const response = document.querySelector('.response');

startButton.addEventListener('click', async() => {
    if(response.classList.contains('hidden')){
        const data = await getData(); 
        console.log(data);
        response.textContent = data.message;
    }
    response.classList.toggle('hidden');
});
