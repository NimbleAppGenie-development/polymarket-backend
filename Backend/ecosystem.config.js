module.exports = {
    apps: [
        {
            name: "Poly Market User Back",
            script: "npm run start:user ",
            autorestart: true,
            env: {
                AWS_ACCESS_KEY_ID: "",
                AWS_SECRET_ACCESS_KEY: "",
                SECRET_NAME: "",
            },
        },
       {
            name: "Poly Market Admin Back",
            script: "npm run start:admin ",
            autorestart: true,
            env: {
                AWS_ACCESS_KEY_ID: "",
                AWS_SECRET_ACCESS_KEY: "",
                SECRET_NAME: "",
            },
        },
    ],
};

