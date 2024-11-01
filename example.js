const WabotApiClient = require('./wabotApiClient');

(async () => {
    try {
        const clientId = 'YOUR_CLIENT_ID';
        const clientSecret = 'YOUR_CLIENT_SECRET';

        const wabot = new WabotApiClient(clientId, clientSecret);

        // Authenticate
        await wabot.authenticate();

        // Get Templates
        const templates = await wabot.getTemplates();

        templates.forEach(template => {
            console.log(`Template ID: ${template.template_id}, Name: ${template.name}`);
        });

        // Send a message
        const to = '+1234567890';
        const templateId = '339'; // Replace with your template ID
        const templateParams = ['John', 'your email address'];

        await wabot.sendMessage(to, templateId, templateParams);

        console.log('Message sent successfully.');

        // Logout
        await wabot.logout();

    } catch (error) {
        console.error('Error:', error.message);
    }
})();
