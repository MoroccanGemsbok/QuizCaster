// pages/api/addQuiz.js

import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

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
  const { method } = req;

  if (method === 'POST') {
    const db = await connectToDatabase();

    const quiz = {
      ...req.body,
      _id: uuidv4(),
    };

    try {
      const result = await db.collection('quizzes').insertOne(quiz);
      return res.status(200).json({ uuid: result.insertedId });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save quiz.' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
