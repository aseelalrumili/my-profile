import bcrypt from 'bcryptjs';

const password = process.argv[2] || 'Aseel.2006';
const hash = bcrypt.hashSync(password, 10);

console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
console.log('\nAdd this to Vercel Environment Variable: ADMIN_PASSWORD_HASH');
