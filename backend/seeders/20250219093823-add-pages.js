"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("pages", [
            {
                id: uuidv4(),
                title: "Terms & Conditions",
                slug: "terms-and-conditions",
                description: `Lorem ipsum dolor sit amet consectetur. Vitae adipiscing nulla enim risus phasellus magna viverra sollicitudin sapien. Consectetur mauris egestas imperdiet lobortis magna in nec in. Quam lorem egestas tellus sit id duis egestas fermentum sed. Quis velit vitae massa lectus ut vitae fringilla. Sagittis aliquam mattis faucibus eu suscipit suspendisse.`,
                image: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: uuidv4(),
                title: "Privacy Policy",
                slug: "privacy-policy",
                description: `Lorem ipsum dolor sit amet consectetur. Vitae adipiscing nulla enim risus phasellus magna viverra sollicitudin sapien. Consectetur mauris egestas imperdiet lobortis magna in nec in. Quam lorem egestas tellus sit id duis egestas fermentum sed. Quis velit vitae massa lectus ut vitae fringilla. Sagittis aliquam mattis faucibus eu suscipit suspendisse.`,
                image: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("pages", {
            slug: ["terms-and-conditions", "privacy-policy"],
        });
    },
};
