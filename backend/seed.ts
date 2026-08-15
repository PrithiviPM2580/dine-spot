import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/user-model";
import Restaurant from "./src/models/restaurant-model";
import Booking from "./src/models/booking-model";

const MONGO_URI = process.env.MONGO_URI ?? process.env.DATABASE_URL;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI or DATABASE_URL in the environment.");
}

const restaurantSeeds = [
  {
    name: "The Green Table",
    slug: "the-green-table",
    description:
      "A warm neighborhood restaurant serving seasonal plates, handcrafted pasta, and signature cocktails.",
    cuisine: "Italian",
    priceRange: "$$" as const,
    location: "Downtown",
    address: "12 Market Street, Downtown",
    chef: "Marco Silva",
    tags: ["family-friendly", "trendy", "romantic"],
    availableSlots: ["lunch", "dinner"],
    featured: true,
    exclusive: true,
    totalSets: 24,
    status: "approved" as const,
  },
  {
    name: "Sunset Terrace",
    slug: "sunset-terrace",
    description:
      "Rooftop dining with panoramic city views, grilled specialties, and signature sunset cocktails.",
    cuisine: "Mediterranean",
    priceRange: "$$$" as const,
    location: "City Center",
    address: "88 Skyline Avenue, City Center",
    chef: "Aisha Noor",
    tags: ["rooftop", "date-night", "scenic"],
    availableSlots: ["dinner", "brunch"],
    featured: true,
    exclusive: false,
    totalSets: 30,
    status: "approved" as const,
  },
  {
    name: "Saffron Spice",
    slug: "saffron-spice",
    description:
      "Modern Indian dining with bold flavors, fresh tandoor dishes, and elegant sharing platters.",
    cuisine: "Indian",
    priceRange: "$$" as const,
    location: "Old Town",
    address: "27 Bazaar Road, Old Town",
    chef: "Rohan Bhatia",
    tags: ["spicy", "family", "popular"],
    availableSlots: ["lunch", "dinner"],
    featured: false,
    exclusive: true,
    totalSets: 18,
    status: "approved" as const,
  },
  {
    name: "Harbor & Hearth",
    slug: "harbor-hearth",
    description:
      "A coastal-inspired restaurant focused on wood-fire cooking, seafood, and seasonal produce.",
    cuisine: "Seafood",
    priceRange: "$$$" as const,
    location: "Harbor District",
    address: "5 Pier Lane, Harbor District",
    chef: "Lena Brooks",
    tags: ["seafood", "fresh", "weekend"],
    availableSlots: ["dinner", "late-night"],
    featured: true,
    exclusive: false,
    totalSets: 22,
    status: "approved" as const,
  },
  {
    name: "Bamboo Bloom",
    slug: "bamboo-bloom",
    description:
      "Elegant Asian fusion dishes with bright ingredients, handcrafted dumplings, and private dining options.",
    cuisine: "Asian Fusion",
    priceRange: "$$$" as const,
    location: "West End",
    address: "14 Lantern Street, West End",
    chef: "Jun Park",
    tags: ["fusion", "private-dining", "premium"],
    availableSlots: ["lunch", "dinner"],
    featured: false,
    exclusive: true,
    totalSets: 26,
    status: "approved" as const,
  },
  {
    name: "Amber Lane Bistro",
    slug: "amber-lane-bistro",
    description:
      "Classic French comfort food with a modern twist, artisanal desserts, and intimate candlelit tables.",
    cuisine: "French",
    priceRange: "$$$" as const,
    location: "Garden Quarter",
    address: "77 Vine Lane, Garden Quarter",
    chef: "Claire Bernard",
    tags: ["fine-dining", "candlelight", "dessert"],
    availableSlots: ["dinner", "weekend"],
    featured: true,
    exclusive: true,
    totalSets: 20,
    status: "approved" as const,
  },
  {
    name: "Maple & Mint",
    slug: "maple-mint",
    description:
      "A vibrant vegetarian and wellness-forward restaurant with creative seasonal brunches and fresh plates.",
    cuisine: "Vegetarian",
    priceRange: "$$" as const,
    location: "North Side",
    address: "33 Green Avenue, North Side",
    chef: "Priya Nair",
    tags: ["healthy", "brunch", "veg"],
    availableSlots: ["brunch", "lunch"],
    featured: false,
    exclusive: false,
    totalSets: 16,
    status: "approved" as const,
  },
  {
    name: "Cedar & Coals",
    slug: "cedar-coals",
    description:
      "Smoky grills, open-fire meats, and an upbeat social dining experience with craft beer pairings.",
    cuisine: "American Grill",
    priceRange: "$$$" as const,
    location: "Midtown",
    address: "92 Ember Road, Midtown",
    chef: "Dylan Carter",
    tags: ["grill", "beer-pairing", "casual"],
    availableSlots: ["dinner", "late-night"],
    featured: true,
    exclusive: false,
    totalSets: 28,
    status: "approved" as const,
  },
  {
    name: "Velvet Noodle House",
    slug: "velvet-noodle-house",
    description:
      "Hand-pulled noodles, wok-fired classics, and a sleek modern dining room perfect for group dinners.",
    cuisine: "Chinese",
    priceRange: "$$" as const,
    location: "Riverfront",
    address: "50 Jade Street, Riverfront",
    chef: "Yun Chen",
    tags: ["noodles", "group-dining", "popular"],
    availableSlots: ["lunch", "dinner"],
    featured: false,
    exclusive: true,
    totalSets: 24,
    status: "approved" as const,
  },
  {
    name: "Olive & Oak",
    slug: "olive-oak",
    description:
      "Seasonal Mediterranean cuisine, artisanal breads, and a relaxed fine-dining atmosphere.",
    cuisine: "Mediterranean",
    priceRange: "$$" as const,
    location: "South Market",
    address: "16 Grove Plaza, South Market",
    chef: "Nadia Hassan",
    tags: ["mediterranean", "seasonal", "cozy"],
    availableSlots: ["lunch", "dinner"],
    featured: false,
    exclusive: false,
    totalSets: 20,
    status: "approved" as const,
  },
];

const bookingTemplates = [
  { userIndex: 0, restaurantIndex: 0, dateOffset: 1, time: "18:30", guests: 2 },
  { userIndex: 1, restaurantIndex: 1, dateOffset: 2, time: "19:00", guests: 4 },
  { userIndex: 2, restaurantIndex: 2, dateOffset: 3, time: "20:00", guests: 3 },
  { userIndex: 3, restaurantIndex: 3, dateOffset: 4, time: "18:00", guests: 2 },
  { userIndex: 4, restaurantIndex: 4, dateOffset: 5, time: "19:30", guests: 5 },
  { userIndex: 0, restaurantIndex: 5, dateOffset: 6, time: "20:30", guests: 2 },
  { userIndex: 1, restaurantIndex: 6, dateOffset: 7, time: "12:30", guests: 4 },
  { userIndex: 2, restaurantIndex: 7, dateOffset: 8, time: "19:15", guests: 2 },
  { userIndex: 3, restaurantIndex: 8, dateOffset: 9, time: "18:45", guests: 3 },
  {
    userIndex: 4,
    restaurantIndex: 9,
    dateOffset: 10,
    time: "20:15",
    guests: 2,
  },
  {
    userIndex: 5,
    restaurantIndex: 0,
    dateOffset: 11,
    time: "19:45",
    guests: 6,
  },
  {
    userIndex: 5,
    restaurantIndex: 2,
    dateOffset: 12,
    time: "18:15",
    guests: 2,
  },
  {
    userIndex: 0,
    restaurantIndex: 3,
    dateOffset: 13,
    time: "20:00",
    guests: 3,
  },
  {
    userIndex: 1,
    restaurantIndex: 4,
    dateOffset: 14,
    time: "18:30",
    guests: 2,
  },
  {
    userIndex: 2,
    restaurantIndex: 5,
    dateOffset: 15,
    time: "19:00",
    guests: 4,
  },
  {
    userIndex: 3,
    restaurantIndex: 6,
    dateOffset: 16,
    time: "13:00",
    guests: 2,
  },
  {
    userIndex: 4,
    restaurantIndex: 7,
    dateOffset: 17,
    time: "20:45",
    guests: 2,
  },
  {
    userIndex: 5,
    restaurantIndex: 8,
    dateOffset: 18,
    time: "19:30",
    guests: 5,
  },
  {
    userIndex: 0,
    restaurantIndex: 9,
    dateOffset: 19,
    time: "18:00",
    guests: 2,
  },
  {
    userIndex: 1,
    restaurantIndex: 1,
    dateOffset: 20,
    time: "20:15",
    guests: 3,
  },
];

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");
    await mongoose.connect(MONGO_URI);

    console.log("Database connected. Clearing existing data...");
    await Promise.all([
      User.deleteMany(),
      Restaurant.deleteMany(),
      Booking.deleteMany(),
    ]);

    console.log("Creating default users...");
    const adminPassword = await bcrypt.hash("adminpassword", 10);
    const userPassword = await bcrypt.hash("userpassword", 10);
    const ownerPassword = await bcrypt.hash("ownerpassword", 10);

    const adminUser = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });

    const regularUsers = await User.create([
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: userPassword,
        role: "user",
      },
      {
        name: "Brian Smith",
        email: "brian@example.com",
        password: userPassword,
        role: "user",
      },
      {
        name: "Chloe Davis",
        email: "chloe@example.com",
        password: userPassword,
        role: "user",
      },
      {
        name: "Daniel Lee",
        email: "daniel@example.com",
        password: userPassword,
        role: "user",
      },
      {
        name: "Emma Brown",
        email: "emma@example.com",
        password: userPassword,
        role: "user",
      },
      {
        name: "Frank Taylor",
        email: "frank@example.com",
        password: userPassword,
        role: "user",
      },
    ]);

    const ownerUsers = await User.create(
      Array.from({ length: 10 }, (_, index) => ({
        name: `Owner ${index + 1}`,
        email: `owner${index + 1}@example.com`,
        password: ownerPassword,
        role: "owner" as const,
      })),
    );

    console.log("Creating 10 restaurants...");
    const createdRestaurants = await Promise.all(
      restaurantSeeds.map((restaurant, index) => {
        const owner = ownerUsers[index];

        if (!owner) {
          throw new Error(`Missing owner user at index ${index}`);
        }

        return Restaurant.create({
          ...restaurant,
          owner: owner._id,
          image: "",
          rating: 4.2 + (index % 4) * 0.4,
          reviewCount: 90 + index * 18,
        });
      }),
    );

    console.log("Creating 20 bookings...");
    const bookingPayloads = bookingTemplates.map((booking) => {
      const user = regularUsers[booking.userIndex];
      const restaurant = createdRestaurants[booking.restaurantIndex];

      if (!user) {
        throw new Error(`Missing user at index ${booking.userIndex}`);
      }

      if (!restaurant) {
        throw new Error(
          `Missing restaurant at index ${booking.restaurantIndex}`,
        );
      }

      return {
        user: user._id,
        restaurant: restaurant._id,
        date: new Date(Date.now() + booking.dateOffset * 24 * 60 * 60 * 1000),
        time: booking.time,
        guests: booking.guests,
        occasion: booking.guests >= 4 ? "Birthday" : "Dinner",
        specialRequests:
          booking.guests >= 4
            ? "Large table requested"
            : "Window seat preferred.",
        status: "confirmed" as const,
      };
    });

    await Booking.create(bookingPayloads);

    console.log("Seed complete.");
    console.log("Admin login: admin@example.com / adminpassword");
    console.log("User login: alice@example.com / userpassword");
    console.log("Owner login: owner1@example.com / ownerpassword");
    console.log(
      `Created ${createdRestaurants.length} restaurants and ${bookingPayloads.length} bookings.`,
    );
    console.log("Database connection closed.");

    await mongoose.connection.close();
    console.log("Seed script finished.");
  } catch (error) {
    console.error("Error seeding database:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

seedDatabase();
