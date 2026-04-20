const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
    region: "us-east-1",
});

async function getSecret(secretName) {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const data = await client.send(command);
        return data.SecretString ? JSON.parse(data.SecretString) : {};
    } catch (err) {
        console.error("Error retrieving secret:", err);
        return {};
    }
}

module.exports = getSecret;
