import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
    try {
        console.log('Đang kết nối MongoDB...');
        console.log('URI:', process.env.MONGO_URI ? 'Có' : 'Không có');
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log('✅ Kết nối MongoDB thành công!');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);
        console.log('Port:', conn.connection.port);
        
        await mongoose.connection.close();
        console.log('Đã đóng kết nối');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:');
        console.error('Message:', error.message);
        process.exit(1);
    }
};

testConnection();
