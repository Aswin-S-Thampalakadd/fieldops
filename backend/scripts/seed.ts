import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import mongoose, { Types } from 'mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { JobSchema } from 'src/jobs/schemas/job.schema';
import { Role } from 'src/common/enums/role.enum';
import { JobStatus } from 'src/common/enums/job-status.enum';

const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/fieldops';

const UserModel = mongoose.model('User', UserSchema);
const JobModel = mongoose.model('Job', JobSchema);

const ADMIN = {
  email: 'admin@fieldops.com',
  password: 'Admin@12345',
  name: 'FieldOps Admin',
};

const TECHNICIANS = [
  {
    email: 'arjun@fieldops.com',
    password: 'Tech@12345',
    name: 'Arjun Kumar',
  },
  {
    email: 'rahul@fieldops.com',
    password: 'Tech@12345',
    name: 'Rahul Sharma',
  },
  {
    email: 'priya@fieldops.com',
    password: 'Tech@12345',
    name: 'Priya Nair',
  },
  {
    email: 'vijay@fieldops.com',
    password: 'Tech@12345',
    name: 'Vijay Menon',
  },
];

const JOB_TITLES = [
  'AC Repair',
  'Electrical Inspection',
  'Water Heater Repair',
  'Network Installation',
  'Air Conditioner Installation',
  'Plumbing Repair',
  'Generator Maintenance',
  'Security Camera Installation',
  'Electrical Panel Inspection',
  'Internet Router Replacement',
];

const CUSTOMER_NAMES = [
  'Amit Verma',
  'Sneha Rao',
  'Rohit Mehta',
  'Ananya Iyer',
  'Kiran Patel',
  'Neha Kapoor',
  'Suresh Nair',
  'Meera Shah',
  'Vivek Joshi',
  'Divya Menon',
  'Arun Thomas',
  'Pooja Reddy',
];

const BENGALURU_LOCATIONS = [
  {
    area: 'Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
  },
  {
    area: 'Koramangala',
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    area: 'Whitefield',
    latitude: 12.9698,
    longitude: 77.75,
  },
  {
    area: 'HSR Layout',
    latitude: 12.9116,
    longitude: 77.6474,
  },
  {
    area: 'Jayanagar',
    latitude: 12.925,
    longitude: 77.5938,
  },
  {
    area: 'Malleshwaram',
    latitude: 13.0035,
    longitude: 77.5706,
  },
  {
    area: 'Yeshwanthpur',
    latitude: 13.028,
    longitude: 77.5405,
  },
  {
    area: 'Marathahalli',
    latitude: 12.9591,
    longitude: 77.6974,
  },
  {
    area: 'Electronic City',
    latitude: 12.8452,
    longitude: 77.6602,
  },
  {
    area: 'Banashankari',
    latitude: 12.9255,
    longitude: 77.5468,
  },
  {
    area: 'JP Nagar',
    latitude: 12.9063,
    longitude: 77.5857,
  },
  {
    area: 'Bellandur',
    latitude: 12.925,
    longitude: 77.6761,
  },
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function daysAgo(days: number): Date {
  const date = new Date();

  date.setDate(date.getDate() - days);

  return date;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

async function seedUsers() {
  console.log('Seeding users...');

  await UserModel.deleteMany({});

  const adminPasswordHash = await bcrypt.hash(ADMIN.password, 10);

  const admin = await UserModel.create({
    email: ADMIN.email,
    passwordHash: adminPasswordHash,
    name: ADMIN.name,
    role: Role.ADMIN,
    isActive: true,
    refreshTokenHash: null,
  });

  const technicians: Array<{
    _id: Types.ObjectId;
    name: string;
  }> = [];

  for (const technician of TECHNICIANS) {
    const passwordHash = await bcrypt.hash(technician.password, 12);

    const user = await UserModel.create({
      email: technician.email,
      passwordHash,
      name: technician.name,
      role: Role.TECHNICIAN,
      isActive: true,
      refreshTokenHash: null,
    });

    technicians.push(user);
  }

  console.log(`Created admin: ${admin.email}`);

  console.log(`Created technicians: ${technicians.length}`);

  return {
    admin,
    technicians,
  };
}

async function seedJobs(
  technicians: Array<{
    _id: Types.ObjectId;
    name: string;
  }>,
) {
  console.log('Seeding jobs...');

  await JobModel.deleteMany({});

  const jobs: Array<{
    _id: Types.ObjectId;
  }> = [];

  /*
   * Status distribution:
   *
   * 24 COMPLETED
   * 5 ASSIGNED
   * 3 IN_PROGRESS
   * 5 PENDING
   * 3 CANCELLED
   *
   * Total = 40
   */

  const statuses: JobStatus[] = [
    ...Array(24).fill(JobStatus.COMPLETED),

    ...Array(5).fill(JobStatus.ASSIGNED),

    ...Array(3).fill(JobStatus.IN_PROGRESS),

    ...Array(5).fill(JobStatus.PENDING),

    ...Array(3).fill(JobStatus.CANCELLED),
  ];

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];

    const location = randomItem(BENGALURU_LOCATIONS);

    const customerName = randomItem(CUSTOMER_NAMES);

    const title = randomItem(JOB_TITLES);

    /*
     * Add small random geographic variation
     * around the selected Bengaluru area.
     */
    const latitude = location.latitude + randomNumber(-0.015, 0.015);

    const longitude = location.longitude + randomNumber(-0.015, 0.015);

    const createdAt = randomDate(daysAgo(548), new Date());

    let technicianId: Types.ObjectId | null = null;

    let startedAt: Date | null = null;

    let completedAt: Date | null = null;

    let completionNotes: string | null = null;

    let completionPhotos: string[] = [];

    /*
     * PENDING jobs intentionally have
     * no technician.
     */
    if (status !== JobStatus.PENDING) {
      const technician = randomItem(technicians);

      technicianId = technician._id;
    }

    /*
     * Completed jobs should have
     * realistic timestamps.
     */
    if (status === JobStatus.COMPLETED) {
      startedAt = addHours(createdAt, 24);

      completedAt = addHours(startedAt, 2);

      completionNotes = randomItem([
        'Issue resolved successfully.',
        'Replaced faulty component and tested system.',
        'Maintenance completed successfully.',
        'Customer confirmed the repair.',
        'Installation completed and tested.',
      ]);

      completionPhotos = [
        `https://placehold.co/1200x800?text=Job-${i + 1}-Before`,
        `https://placehold.co/1200x800?text=Job-${i + 1}-After`,
      ];
    }

    /*
     * In-progress jobs have startedAt
     * but no completedAt.
     */
    if (status === JobStatus.IN_PROGRESS) {
      startedAt = addHours(
        createdAt,
        Math.max(1, Math.floor(Math.random() * 48)),
      );
    }

    /*
     * Scheduled date.
     *
     * Historical jobs get historical
     * scheduled dates.
     */
    const scheduledAt = addHours(createdAt, 24);

    const job = await JobModel.create({
      title,
      description: `Service request for ${title.toLowerCase()} in ${location.area}.`,

      customer: {
        name: customerName,

        phone: `+91 98${String(
          Math.floor(10000000 + Math.random() * 89999999),
        )}`,

        address: `${
          Math.floor(Math.random() * 200) + 1
        }, ${location.area}, Bengaluru, Karnataka`,
      },

      location: {
        type: 'Point',

        coordinates: [longitude, latitude],
      },

      status,

      technicianId,

      scheduledAt,

      startedAt,

      completedAt,

      completionNotes,

      completionPhotos,
    });

    jobs.push(job);
  }

  console.log(`Created ${jobs.length} jobs`);

  return jobs;
}

async function printSummary() {
  const summary = await JobModel.aggregate([
    {
      $group: {
        _id: '$status',
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  console.log('\nJob status summary:');

  for (const item of summary) {
    console.log(`${item._id}: ${item.count}`);
  }

  const total = await JobModel.countDocuments();

  console.log(`TOTAL: ${total}`);

  const users = await UserModel.aggregate([
    {
      $group: {
        _id: '$role',
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  console.log('\nUser summary:');

  for (const item of users) {
    console.log(`${item._id}: ${item.count}`);
  }
}

async function run() {
  try {
    console.log('Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI);

    console.log('MongoDB connected.');

    const { technicians } = await seedUsers();

    await seedJobs(technicians);

    await printSummary();

    console.log('\nSeed completed successfully.');

    console.log('\nAdmin login:');

    console.log(`Email: ${ADMIN.email}`);

    console.log(`Password: ${ADMIN.password}`);

    console.log('\nTechnician logins:');

    for (const technician of TECHNICIANS) {
      console.log(`${technician.email} / ${technician.password}`);
    }
  } catch (error) {
    console.error('Seed failed:', error);

    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

void run();
