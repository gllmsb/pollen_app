export const settingPage = () => {
    // Select the setting icon and setting container elements
    const settingIcon = document.querySelector('.setting-icon');
    const settingContainer = document.getElementById('settingContainer');

    // Add event listener to the setting icon
    settingIcon.addEventListener('click', function() {
        console.log('Setting icon clicked'); // Check if this message appears in the browser console
        // Toggle the visibility of the setting container
        if (settingContainer.style.display === 'none') {
            settingContainer.style.display = 'block';
        } else {
            settingContainer.style.display = 'none';
        }
    });
};