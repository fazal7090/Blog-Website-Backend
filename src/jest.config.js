import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // ✅ loads .env manually

export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {},
};