import { DataSource } from 'typeorm';

const tableName = 'user';

export const USER_DATA_SEED_IDS = {
  JANE: '20202020-e6b5-4680-8a32-b8209737156b',
  TIM: '20202020-9e3b-46d4-a556-88b9ddc2b034',
  JONY: '20202020-3957-4908-9c36-2929a23f8357',
  PHIL: '20202020-7169-42cf-bc47-1cfef15264b8',
};

export const seedUsers = async (dataSource: DataSource, schemaName: string) => {
  await dataSource
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${tableName}`, [
      'id',
      'firstName',
      'lastName',
      'email',
      'passwordHash',
      'canImpersonate',
      'canAccessFullAdminPanel',
      'isEmailVerified',
    ])
    .orIgnore()
    .values([
      {
        id: USER_DATA_SEED_IDS.TIM,
        firstName: 'Tim',
        lastName: 'Apple',
        email: 'tim@apple.dev',
        passwordHash:
          '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6', // tim@apple.dev
        canImpersonate: true,
        canAccessFullAdminPanel: true,
        isEmailVerified: true,
      },
      {
        id: USER_DATA_SEED_IDS.JONY,
        firstName: 'Jony',
        lastName: 'Ive',
        email: 'jony.ive@apple.dev',
        passwordHash:
          '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6', // tim@apple.dev
        canImpersonate: true,
        canAccessFullAdminPanel: true,
        isEmailVerified: true,
      },
      {
        id: USER_DATA_SEED_IDS.PHIL,
        firstName: 'Phil',
        lastName: 'Schiler',
        email: 'phil.schiler@apple.dev',
        passwordHash:
          '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6', // tim@apple.dev
        canImpersonate: true,
        canAccessFullAdminPanel: true,
        isEmailVerified: true,
      },
      {
        id: USER_DATA_SEED_IDS.JANE,
        firstName: 'Jane',
        lastName: 'Austen',
        email: 'jane.austen@apple.dev',
        passwordHash:
          '$2b$10$3LwXjJRtLsfx4hLuuXhxt.3mWgismTiZFCZSG3z9kDrSfsrBl0fT6', // tim@apple.dev
        canImpersonate: true,
        canAccessFullAdminPanel: true,
        isEmailVerified: true,
      },
    ])
    .execute();
};
