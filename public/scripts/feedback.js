document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('feedback-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const message = document.getElementById('message').value;
        const email = localStorage.getItem('userEmail'); // Assuming user's email is stored in localStorage

        if (!email) {
            alert("User not logged in.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, title, message })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
            }

            const data = await response.json();
            alert(data.message);
            document.getElementById('feedback-form').reset();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback.');
        }
    });
});
