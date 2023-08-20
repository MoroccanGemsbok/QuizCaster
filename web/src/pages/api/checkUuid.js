// /api/checkUuid.js

import { MongoClient } from 'mongodb';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db('quizcaster');
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const uuid = req.query.uuid;

  if (!uuid) {
    return res.status(400).json({ error: 'UUID is required.' });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('quizzes');

    const document = await collection.findOne({ _id: uuid });

    if (document) {
      res.status(200).json({ summary: document.summary,
         questions: document.questions,
         answers: document.answers,
         exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error fetching UUID:", error);
    res.status(500).json({ error: "An error occurred while checking the UUID." });
  }
}
