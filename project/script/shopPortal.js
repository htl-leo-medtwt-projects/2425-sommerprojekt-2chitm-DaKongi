document.addEventListener('DOMContentLoaded', function() {
    const wcaButton = document.getElementById('wca');
    const dropdown = document.getElementById('dropdown');

    wcaButton.addEventListener('click', function() {
        // Toggle the dropdown visibility
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const wcaButton = document.getElementById('wca');
    const dropdown = document.getElementById('dropdown');

    wcaButton.addEventListener('click', function() {
        // Toggle the "show" class for animation
        dropdown.classList.toggle('show');
    });
});
