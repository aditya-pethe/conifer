const axios = require('axios');

async function testcall(userQuery) {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/chat", 
        {query: userQuery},  // Change this line
        {responseType: 'stream'}
        );

        response.data.on('data', (chunk) => {
            console.log(chunk.toString());
        });

        response.data.on('end', () => {
            console.log('End of data');
        });
    } catch (error) {
        console.error(error);
    }
}

testcall("How do I create an agent in langchain");
