require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

function OpTaskDB() {
  const opDB = {};

  const url = process.env.DB_STRING;
  const DB_NAME = "OpTask";

  // save a new user to the DB
  opDB.saveNewUser = async function (newUser) {
    let client;
    try {
      console.log("Saving user....");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      const result = await usersCollection.insertOne(newUser);
      return result.insertedCount;
    } finally {
      client.close();
    }
  };

  // try to find a user given a username
  opDB.getUserByEmail = async function (query) {
    let client;
    try {
      console.log("Finding user...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const usersCollections = db.collection("users");
      const results = await usersCollections.findOne({
        username: query,
      });
      console.log("Got user");
      return results;
    } finally {
      client.close();
    }
  };

  // this function gets a user object by Id
  opDB.getUserById = async function (query) {
    let client;
    try {
      console.log("Finding user...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      const results = await usersCollection.findOne({
        _id: new ObjectId(query),
      });
      console.log("got user by id");
      return results;
    } finally {
      client.close();
    }
  };

  // this function gets projects for a user
  opDB.getUserProjects = async function (userId) {
    let client;
    try {
      console.log("Getting projects...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const results = await projectsCollection
        .find({ ownerId: userId })
        .toArray();
      console.log("got user's projects");
      return results;
    } finally {
      client.close();
    }
  };

  //this call returns the number of projects a user has
  opDB.getUserProjectCount = async function (userId) {
    let client;
    try {
      console.log("Getting number of projects...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const results = await projectsCollection.countDocuments({
        ownerId: userId,
      });
      console.log("got user's project count");
      return results;
    } finally {
      client.close();
    }
  };

  opDB.getPageProjects = async function (userId, page) {
    let client;
    try {
      console.log("Getting projects...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const results = await projectsCollection
        .find({ ownerId: userId })
        .sort({ _id: -1 })
        .skip(page > 0 ? (page - 1) * 14 : 0)
        .limit(14)
        .toArray();
      console.log("got the projects for this page(ination)");
      return results;
    } finally {
      client.close();
    }
  };

  opDB.createProject = async (projectObject) => {
    let client;
    try {
      console.log("Creating project...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const result = await projectsCollection.insertOne(projectObject);
      console.log("created project");
      return result;
    } finally {
      client.close();
    }
  };

  opDB.getProject = async (projectId) => {
    let client;
    try {
      console.log("Getting project");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("connecting to the db");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const result = await projectsCollection.findOne({
        _id: new ObjectId(projectId),
      });
      console.log("got project");
      return result;
    } finally {
      client.close();
    }
  };

  opDB.getProfileProjects = async function (userId) {
    let client;
    try {
      console.log("Getting projects...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const results = await projectsCollection
        .find({ ownerId: userId })
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      console.log("got user's projects");
      return results;
    } finally {
      client.close();
    }
  };

  opDB.updateProject = async (projectId, newName, newDescription) => {
    let client;
    try {
      console.log("Updating project");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("connecting to the db");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const result = await projectsCollection.findOneAndUpdate(
        {
          _id: new ObjectId(projectId),
        },
        {
          $set: {
            projectName: newName,
            projectDescription: newDescription,
          },
        }
      );
      console.log("got project");
      return result;
    } finally {
      client.close();
    }
  };

  opDB.deleteProject = async (projectId) => {
    let client;
    try {
      console.log("Deleting project");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("connecting to the db");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const tasksCollection = db.collection("tasks");
      const result = await projectsCollection.findOneAndDelete({
        _id: new ObjectId(projectId),
      });
      console.log("deleted project");
      const result2 = await tasksCollection.deleteMany({
        projectId: projectId,
      });
      return { result, result2 };
    } finally {
      client.close();
    }
  };

  opDB.searchAndGetProjects = async (query, userId, page) => {
    let client;
    try {
      console.log("Searching and retrieving project");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("connecting to the db");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const result = await projectsCollection
        .find({
          ownerId: userId,
          $text: {
            $search: query,
          },
        })
        .skip(page > 0 ? (page - 1) * 10 : 0)
        .limit(10)
        .toArray();
      console.log("searched and got projects");
      return result;
    } finally {
      client.close();
    }
  };

  //this call returns the number of projects a user has
  opDB.getSearchResultCount = async function (query, userId) {
    let client;
    try {
      console.log("Getting number of projects...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const projectsCollection = db.collection("projects");
      const results = await projectsCollection.countDocuments({
        ownerId: userId,
        $text: {
          $search: query,
        },
      });
      console.log("got search result count");
      return results;
    } finally {
      client.close();
    }
  };

  opDB.createTask = async (taskObject) => {
    let client;
    try {
      console.log("Creating task...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");
      const result = await tasksCollection.insertOne(taskObject);
      console.log("created task");
      return result;
    } finally {
      client.close();
    }
  };

  opDB.getTasks = async (projectId) => {
    let client;
    try {
      console.log("Getting tasks...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");
      const results = await tasksCollection
        .find({ projectId: projectId })
        .toArray();
      console.log("got tasks");
      return results;
    } finally {
      client.close();
    }
  };

  opDB.updateTaskTimelineState = async (newTimelineData) => {
    let client;
    try {
      console.log("Updating task timeline...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const tasksCollection = db.collection("tasks");
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(newTimelineData.id) },
        {
          $set: {
            taskState: newTimelineData.newState,
          },
        }
      );
      console.log("completed update");
      return result;
    } finally {
      client.close();
    }
  };

  opDB.updateTaskText = async (newTaskObject) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const taskCollection = db.collection("tasks");
      const result = await taskCollection.findOneAndUpdate(
        {
          _id: new ObjectId(newTaskObject.id),
        },
        {
          $set: {
            taskText: newTaskObject.newText,
          },
        }
      );
      console.log("updated task");
      return result;
    } finally {
      client.close();
    }
  };

  opDB.deleteTask = async (taskId) => {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const taskCollection = db.collection("tasks");
      const result = await taskCollection.findOneAndDelete({
        _id: new ObjectId(taskId),
      });
      console.log("deleted task");
      return result;
    } finally {
      client.close();
    }
  };

  // this function updates a user profile
  opDB.updateUserData = async (userId, profileObj) => {
    let client;
    try {
      console.log("Getting user info...");
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connecting to OpTask DB...");
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      const results = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            fullname: profileObj.userFullName,
            username: profileObj.userEmail,
            location: profileObj.userLocation,
            institution: profileObj.userInstitution,
            job: profileObj.userJob,
          },
        }
      );
      console.log("completed update");
      return results;
    } finally {
      client.close();
    }
  };
  return opDB;
}

module.exports = OpTaskDB();
