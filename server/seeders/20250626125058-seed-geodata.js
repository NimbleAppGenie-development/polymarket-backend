"use strict";

const { Country, State, City } = require("country-state-city");
// const { Country, State, City } = csc;
const { getCountryCallingCode } = require("libphonenumber-js");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cities", null, {});
    await queryInterface.bulkDelete("states", null, {});
    await queryInterface.bulkDelete("countries", null, {});

    const allCountries = Country.getAllCountries().map(c => {
      let phoneCode = null;
      try {
        phoneCode = `+${getCountryCallingCode(c.isoCode)}`;
      } catch (error) {
        phoneCode = "N/A"; // Or "" if your DB allows it
      }

      return {
        id: uuidv4(),
        name: c.name,
        isoCode: c.isoCode,
        phoneCode,
        isActive: true,
      };
    });

    await queryInterface.bulkInsert("countries", allCountries);

    // States
    const allStates = [];
    for (const c of allCountries) {
      const states = State.getStatesOfCountry(c.isoCode).map(s => ({
        id: uuidv4(),
        name: s.name,
        isoCode: s.isoCode,
        countryId: c.id,
        isActive: true,
      }));
      allStates.push(...states);
    }
    await queryInterface.bulkInsert("states", allStates);

    // Cities
    const allCities = [];
    for (const state of allStates) {
      const country = allCountries.find(c => c.id === state.countryId);
      if (!country) continue;

      const cities = City.getCitiesOfState(country.isoCode, state.isoCode).map(ci => ({
        id: uuidv4(),
        name: ci.name,
        stateId: state.id,
        countryId: country.id,
        isActive: true,
      }));
      allCities.push(...cities);
    }

    await queryInterface.bulkInsert("cities", allCities);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("cities", null, {});
    await queryInterface.bulkDelete("states", null, {});
    await queryInterface.bulkDelete("countries", null, {});
  }
};
