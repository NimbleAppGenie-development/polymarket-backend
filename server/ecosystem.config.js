module.exports = {
    apps: [
        {
            name: "My Cricket League",
            script: "npm run migrate ",
            args: "run start:user",
            autorestart: true,
            env: {
                AWS_ACCESS_KEY_ID: "",
                AWS_SECRET_ACCESS_KEY: "",
                SECRET_NAME: "",
            },
        }
    ],
};
