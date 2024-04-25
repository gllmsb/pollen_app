export const myFetch = async (endpoint) => {
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.log(`Error in fetch function: ${error}`);
        throw error; 
    }
};