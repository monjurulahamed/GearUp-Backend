import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";


const prisma = new PrismaClient();
 
async function main() {
  console.log("Seeding database...");

  // ---------- 1. Super Admin ----------
  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@gearup.com";
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@12345";
  const salt = Number(process.env.BCRYPT_SALT_ROUND || 12);
  const adminHash = await bcryptjs.hash(adminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", status: "ACTIVE", password: adminHash },
    create: {
      name: "Super Admin",
      email: adminEmail,
      password: adminHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`Admin: ${admin.email}`);

  // ---------- 2. Demo Provider ----------
  const providerHash = await bcryptjs.hash("Provider@123", salt);
  const provider = await prisma.user.upsert({
    where: { email: "provider@gearup.com" },
    update: {},
    create: {
      name: "Demo Provider",
      email: "provider@gearup.com",
      password: providerHash,
      phone: "+8801700000001",
      role: "PROVIDER",
      status: "ACTIVE",
    },
  });
  console.log(`Provider: ${provider.email}`);

 
  const customerHash = await bcryptjs.hash("Customer@123", salt);
  const customer = await prisma.user.upsert({
    where: { email: "customer@gearup.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@gearup.com",
      password: customerHash,
      phone: "+8801700000002",
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });
  console.log(`Customer: ${customer.email}`);


  const categoriesData = [
    { name: "Cycling", slug: "cycling", icon: "" },
    { name: "Camping", slug: "camping", icon: "" },
    { name: "Fitness", slug: "fitness", icon: "" },
    { name: "Water Sports", slug: "water-sports", icon: "" },
    { name: "Winter Sports", slug: "winter-sports", icon: "" },
    { name: "Hiking", slug: "hiking", icon: "" },
  ];

  const categories: { id: string }[] = [];
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push({ id: c.id });
  }
  console.log(`Categories: ${categories.length}`);


  if (categories.length >= 4) {
    const sampleGear = [
      {
        name: "Trek Mountain Bike X1",
        description: "21-speed mountain bike with hydraulic disc brakes, perfect for off-road trails.",
        brand: "Trek",
        pricePerDay: 25,
        stock: 5,
        categoryId: categories[0].id,
        images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e"],
      },
      {
        name: "Coleman 4-Person Tent",
        description: "Waterproof camping tent with easy setup, ideal for weekend camping trips.",
        brand: "Coleman",
        pricePerDay: 15,
        stock: 8,
        categoryId: categories[1].id,
        images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"],
      },
      {
        name: "Adjustable Dumbbell Set (5-50kg)",
        description: "Space-saving adjustable dumbbells, perfect for home gym workouts.",
        brand: "Bowflex",
        pricePerDay: 10,
        stock: 4,
        categoryId: categories[2].id,
        images: ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"],
      },
      {
        name: "Inflatable Stand-Up Paddleboard",
        description: "10ft inflatable SUP board with paddle, pump, and carrying bag included.",
        brand: "iRocker",
        pricePerDay: 20,
        stock: 6,
        categoryId: categories[3].id,
        images: ["https://images.unsplash.com/photo-1502680394575-0f6b04f5c0a5"],
      },
    ];

    for (const g of sampleGear) {
      const existing = await prisma.gearItem.findFirst({
        where: { name: g.name, providerId: provider.id },
      });
      if (!existing) {
        await prisma.gearItem.create({
          data: { ...g, providerId: provider.id },
        });
      }
    }
    console.log(`Sample gear seeded for demo provider`);
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
