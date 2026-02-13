require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const USERS = [
    {
        email: 'admin@superadmin.co.id',
        password: 'admin123',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        productId: null,
    },
    {
        email: 'orbitbilliard.id@gmail.com',
        password: 'orbit123',
        name: 'Admin Orbit Billiard',
        role: 'PRODUCT_ADMIN',
        productId: 'orbit',
    },
    {
        email: 'hi@catatmak.com',
        password: 'catatmak123',
        name: 'Admin Catatmark',
        role: 'PRODUCT_ADMIN',
        productId: 'catatmak',
    },
    {
        email: 'jokiinformatika@gmail.com',
        password: 'joki123',
        name: 'Admin Joki Informatika',
        role: 'PRODUCT_ADMIN',
        productId: 'joki',
    }
];

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('✅ Connected to MongoDB');

        for (const userData of USERS) {
            const existing = await User.findOne({ email: userData.email });
            if (existing) {
                // Update existing user
                await User.updateOne({ email: userData.email }, { $set: userData });
                console.log(`🔄 Updated: ${userData.email}`);
            } else {
                // Create new user
                await User.create(userData);
                console.log(`✨ Created: ${userData.email}`);
            }
        }

        // Verify
        const allUsers = await User.find({}, { password: 0 });
        console.log('\n📋 All users in database:');
        allUsers.forEach(u => {
            console.log(`   - ${u.email} | ${u.name} | ${u.role} | productId: ${u.productId}`);
        });

        console.log(`\n✅ Total: ${allUsers.length} users`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

seedUsers();
