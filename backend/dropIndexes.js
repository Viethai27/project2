import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

async function dropIndexes() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    
    // Drop employer_1 index from doctors collection
    try {
      await db.collection('doctors').dropIndex('employer_1');
      console.log('✅ Đã xóa index employer_1 từ doctors');
    } catch (e) {
      console.log('⚠️ Index employer_1 không tồn tại hoặc đã bị xóa');
    }

    // Drop slot_1_queue_number_1 index from appointments collection
    try {
      await db.collection('appointments').dropIndex('slot_1_queue_number_1');
      console.log('✅ Đã xóa index slot_1_queue_number_1 từ appointments');
    } catch (e) {
      console.log('⚠️ Index slot_1_queue_number_1 không tồn tại hoặc đã bị xóa');
    }

    // Drop license_number_1 index from doctors collection
    try {
      await db.collection('doctors').dropIndex('license_number_1');
      console.log('✅ Đã xóa index license_number_1 từ doctors');
    } catch (e) {
      console.log('⚠️ Index license_number_1 không tồn tại hoặc đã bị xóa');
    }

    console.log('\n✅ Hoàn thành xóa indexes!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

dropIndexes();
