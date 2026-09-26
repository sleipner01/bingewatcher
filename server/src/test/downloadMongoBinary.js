import { MongoBinary } from 'mongodb-memory-server';

// Download once up front, so the test files don't each wait on the download inside a hook
await MongoBinary.getPath();
