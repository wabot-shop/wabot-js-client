const axios = require('axios');

class WabotApiClient {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiration = null;
        this.apiBaseUrl = 'https://api.wabot.shop/v1';
    }

    // Authenticate and obtain access token
    async authenticate() {
        const url = `${this.apiBaseUrl}/authenticate`;

        const headers = {
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        };

        try {
            const response = await axios.post(url, null, { headers });
            const data = response.data;

            if (data.token && data.refreshToken) {
                this.accessToken = data.token;
                this.refreshToken = data.refreshToken;
                this.tokenExpiration = this.getTokenExpiration(this.accessToken);
            }
        } catch (error) {
            throw new Error(`Authentication failed: ${error.response.data.error || error.message}`);
        }
    }

    // Refresh access token
    async refreshTokenMethod() {
        const url = `${this.apiBaseUrl}/refreshToken`;

        const headers = {
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            'Content-Type': 'application/json',
        };

        const body = {
            refreshToken: this.refreshToken,
        };

        try {
            const response = await axios.post(url, body, { headers });
            const data = response.data;

            if (data.token && data.refreshToken) {
                this.accessToken = data.token;
                this.refreshToken = data.refreshToken;
                this.tokenExpiration = this.getTokenExpiration(this.accessToken);
            }
        } catch (error) {
            throw new Error(`Token refresh failed: ${error.response.data.error || error.message}`);
        }
    }

    // Get templates
    async getTemplates() {
        await this.ensureAuthenticated();

        const url = `${this.apiBaseUrl}/get-templates`;

        const headers = {
            Authorization: this.accessToken,
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.data;
        } catch (error) {
            throw new Error(`Failed to get templates: ${error.response.data.error || error.message}`);
        }
    }

    // Send message
    async sendMessage(to, templateId, params = []) {
        await this.ensureAuthenticated();

        const url = `${this.apiBaseUrl}/send-message`;

        const headers = {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
        };

        const body = {
            to: to,
            templateId: templateId,
            params: params,
        };

        try {
            const response = await axios.post(url, body, { headers });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to send message: ${error.response.data.error || error.message}`);
        }
    }

    // Logout
    async logout() {
        const url = `${this.apiBaseUrl}/logout/${encodeURIComponent(this.refreshToken)}`;

        const headers = {
            clientId: this.clientId,
            clientSecret: this.clientSecret,
        };

        try {
            await axios.delete(url, { headers });
            this.accessToken = null;
            this.refreshToken = null;
            this.tokenExpiration = null;
        } catch (error) {
            throw new Error(`Logout failed: ${error.response.data.error || error.message}`);
        }
    }

    // Utility methods

    async ensureAuthenticated() {
        if (!this.accessToken || this.isTokenExpired()) {
            if (this.refreshToken) {
                await this.refreshTokenMethod();
            } else {
                await this.authenticate();
            }
        }

        if (!this.accessToken) {
            throw new Error('Unable to authenticate.');
        }
    }

    isTokenExpired() {
        return this.tokenExpiration && Date.now() >= this.tokenExpiration * 1000;
    }

    getTokenExpiration(token) {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return null;
        }

        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        return payload.exp;
    }
}

module.exports = WabotApiClient;
