// In-memory storage for development
const memoryStore = new Map();

function read(name, fallback = []) {
  try {
    if (!memoryStore.has(name)) {
      memoryStore.set(name, JSON.parse(JSON.stringify(fallback)));
    }
    return memoryStore.get(name);
  } catch (e) {
    console.error('Error reading from memory store:', e);
    return fallback;
  }
}

function write(name, data) {
  try {
    // Create a deep copy to prevent reference issues
    memoryStore.set(name, JSON.parse(JSON.stringify(data)));
    return data;
  } catch (e) {
    console.error('Error writing to memory store:', e);
    throw e;
  }
}

// For production, you should replace this with a proper database or cloud storage
// For example, using MongoDB:
/*
const mongoose = require('mongoose');
const DataModel = mongoose.model('Data', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
}));

async function read(name, fallback = []) {
  try {
    const doc = await DataModel.findOne({ name });
    return doc ? doc.value : fallback;
  } catch (e) {
    console.error('Database read error:', e);
    return fallback;
  }
}

async function write(name, data) {
  try {
    await DataModel.findOneAndUpdate(
      { name },
      { value: data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return data;
  } catch (e) {
    console.error('Database write error:', e);
    throw e;
  }
}
*/

module.exports = { read, write };
