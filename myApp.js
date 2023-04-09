// Load environment variables
require("dotenv").config(); // Load the environment variables from the .env file

// 1. Install and set up mongoose
const mongoose = require("mongoose"); // Import the Mongoose library
mongoose.connect(process.env.MONGO_URI, {
  // Connect to MongoDB Atlas cluster using the MONGO_URI environment variable
  useNewUrlParser: true, // Use new url parser
  useUnifiedTopology: true, // Use new server discovery and monitoring engine
  useCreateIndex: true, // Ensure index is created when defining schema
  useFindAndModify: false, // Use newer method for updating documents
});

// 2. Define 'Person' model
const personSchema = new mongoose.Schema({
  // Define the schema for the 'Person' collection
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  favoriteFoods: {
    type: [String],
    required: true,
  },
});

const Person = mongoose.model("Person", personSchema); // Create a model instance from the personSchema

// 3. Create and save a person
const createAndSavePerson = (done) => {
  // Create and save a person document in the 'Person' collection
  const janeFonda = new Person({
    name: "Jane Fonda",
    age: 84,
    favoriteFoods: ["eggs", "fish", "fresh fruit"],
  });

  janeFonda.save((err, data) => {
    // Save the person document to the database
    if (err) {
      return console.error(err);
    }
    done(null, data); // Call the 'done' function with the saved data
  });
};

// 4. Create many people using Model.create()
const arrayOfPeople = [
  // An array of people documents
  { name: "Frankie", age: 74, favoriteFoods: ["Del Taco"] },
  { name: "Sol", age: 76, favoriteFoods: ["roast chicken"] },
  { name: "Robert", age: 78, favoriteFoods: ["wine"] },
];

const createManyPeople = (arrayOfPeople, done) => {
  // Create multiple people documents in the 'Person' collection using the 'create' method
  Person.create(arrayOfPeople, (err, people) => {
    if (err) {
      return console.log(err);
    }
    done(null, people);
  });
};

// 5. Use Model.find()
const findPeopleByName = (personName, done) => {
  // Find people documents with the given name in the 'Person' collection using the 'find' method
  Person.find({ name: personName }, (err, personFound) => {
    if (err) {
      return console.log(err);
    }
    done(null, personFound);
  });
};

const findOneByFood = (food, done) => {
  // Find a person document by their favorite food in the 'Person' collection using the 'findOne' method
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) {
      return console.log(err);
    }
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  // Find a person document by their ID in the 'Person' collection using the 'findById' method
  Person.findById(personId, (err, data) => {
    if (err) {
      return console.log(err);
    }
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  // Find a person document by their ID, update it, and save it in the 'Person' collection using the 'findById' and 'save' methods
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, data) => {
    // Find the person document by ID
    if (err) {
      return console.log(err);
    }
    data.favoriteFoods.push(foodToAdd); // Add a new favorite food to the found person's list of favorite foods
    data.save((err, updatedData) => {
      // Save the updated person document to the database
      if (err) {
        return console.error(err);
      }
      done(null, updatedData);
    });
  });
};

const findAndUpdate = (personName, done) => {
  // Find a person document by name, update it, and return the updated document in the 'Person' collection using the 'findOneAndUpdate' method
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, updatedDoc) => {
      if (err) {
        return console.log(err);
      }
      done(null, updatedDoc);
    }
  );
};

const removeById = (personId, done) => {
  // Remove a person document by ID from the 'Person' collection using the 'findByIdAndRemove' method
  Person.findByIdAndRemove({ _id: personId }, function (err, data) {
    if (err) {
      console.error(err);
    }
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  // Remove multiple people documents with a given name from the 'Person' collection using the 'remove' method
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, function (err, data) {
    if (err) {
      console.error(err);
    }
    done(null, data);
  });
};

const queryChain = (done) => {
  // Use query chaining to find people documents with a given favorite food and limit the result set and fields in the 'Person' collection
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 }) // Sort the results by name in ascending order
    .limit(2) // Limit the results to 2 documents
    .select({ age: 0 }) // Omit the 'age' field from the results
    .exec(
      (err, deletedPersons) => (err ? done(err) : done(null, deletedPersons)) // Call the 'done' function with the resulting documents or any error encountered
    );
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

// Export functions for testing purposes
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
