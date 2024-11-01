# Wabot API Client for JavaScript (Node.js)

This is a JavaScript client library for interacting with the Wabot API in a Node.js environment. It handles authentication, token management, and provides methods to interact with the Wabot API endpoints.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Authentication](#authentication)
  - [Getting Templates](#getting-templates)
  - [Sending Messages](#sending-messages)
  - [Logout](#logout)
- [Example](#example)
- [Notes](#notes)
- [License](#license)

## Prerequisites

- Node.js v10 or higher
- `axios` library installed

## Installation

1. **Install Dependencies**

   Install the `axios` library to handle HTTP requests:

   ```bash
   npm install axios

2. **Include the Client**

    Save the wabotApiClient.js file in your project and require it:


   ```bash
    const WabotApiClient = require('./wabotApiClient');
