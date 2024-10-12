const config = {
  modules: {
    development: {
      abandonThreshold: 10,      // Number of simulation cycles for road abandonment
      abandonChance: 0.25,       // Probability of building abandonment
      constructionTime: 3,       // Days to build a building
      levelUpChance: 0.05,       // Probability of a building leveling up
      redevelopChance: 0.25,      // Chance of redevelopment after abandonment
    },
    jobs: {
      maxWorkers: 2,             // Max number of workers at a building
    },
    residents: {
      maxResidents: 2,           // Max number of residents in a house
      residentMoveInChance: 0.5, // Chance for a resident to move in
    },
    roadAccess: {
      searchDistance: 3,         // Max distance to search for a road
    },
  },
  citizen: {
    minWorkingAge: 16,          // Minimum working age for a citizen
    retirementAge: 65,          // Age when citizens retire
    maxJobSearchDistance: 4,    // Max Manhattan distance for job search
  },
  vehicle: {
    speed: 0.0005,              // Distance traveled per millisecond
    fadeTime: 500,              // Fade start/end time
    maxLifetime: 10000,         // Maximum lifetime of a vehicle
    spawnInterval: 1000,        // Vehicle spawn interval in milliseconds
  },
};

export default config;
