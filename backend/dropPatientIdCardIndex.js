import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const dropPatientIdCardIndex = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/pamec_hospital';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('patients');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:', indexes);

    // Drop the unique index on id_card
    try {
      await collection.dropIndex('id_card_1');
      console.log('✅ Dropped id_card unique index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('⚠️ Index id_card_1 not found (already dropped)');
      } else {
        throw error;
      }
    }

    // List indexes after drop
    const indexesAfter = await collection.indexes();
    console.log('📋 Indexes after drop:', indexesAfter);

    await mongoose.connection.close();
    console.log('✅ Done');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

dropPatientIdCardIndex();
