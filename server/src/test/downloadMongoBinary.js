import { MongoBinary } from 'mongodb-memory-server';

// Download once up front, so parallel test files don't race for the same lockfile
export default async function downloadMongoBinary() {
  await MongoBinary.getPath();
}
