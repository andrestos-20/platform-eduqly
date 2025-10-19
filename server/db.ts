import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, modules, InsertModule, Module, admins, students, Student, InsertStudent } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.


// Module queries
export async function getAllModules(): Promise<Module[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get modules: database not available");
    return [];
  }

  try {
    const result = await db.select().from(modules).orderBy(modules.id);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get modules:", error);
    return [];
  }
}

export async function getModuleById(id: number): Promise<Module | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get module: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get module:", error);
    return undefined;
  }
}

export async function updateModule(id: number, data: Partial<InsertModule>): Promise<Module | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update module: database not available");
    return undefined;
  }

  try {
    await db.update(modules).set(data).where(eq(modules.id, id));
    return getModuleById(id);
  } catch (error) {
    console.error("[Database] Failed to update module:", error);
    return undefined;
  }
}

export async function createModule(data: InsertModule): Promise<Module | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create module: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(modules).values(data);
    const id = result[0].insertId as number;
    return getModuleById(id);
  } catch (error) {
    console.error("[Database] Failed to create module:", error);
    return undefined;
  }
}



// Admin queries
export async function verifyAdminCredentials(email: string, ra: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot verify admin: database not available");
    return false;
  }

  try {
    const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    
    if (result.length === 0) return false;
    
    const admin = result[0];
    return admin.ra === ra;
  } catch (error) {
    console.error("[Database] Failed to verify admin:", error);
    return false;
  }
}

export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get admin:", error);
    return undefined;
  }
}




// Student queries
export async function getAllStudents(): Promise<Student[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get students: database not available");
    return [];
  }

  try {
    const result = await db.select().from(students).orderBy(students.id);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get students:", error);
    return [];
  }
}

export async function getStudentById(id: number): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get student: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get student:", error);
    return undefined;
  }
}

export async function getStudentByEmail(email: string): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get student: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get student:", error);
    return undefined;
  }
}

export async function createStudent(data: InsertStudent): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create student: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(students).values(data);
    const id = (result as any).insertId || result[0];
    return getStudentById(Number(id));
  } catch (error) {
    console.error("[Database] Failed to create student:", error);
    return undefined;
  }
}

export async function updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update student: database not available");
    return undefined;
  }

  try {
    await db.update(students).set(data).where(eq(students.id, id));
    return getStudentById(id);
  } catch (error) {
    console.error("[Database] Failed to update student:", error);
    return undefined;
  }
}

export async function deleteStudent(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete student: database not available");
    return false;
  }

  try {
    await db.delete(students).where(eq(students.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete student:", error);
    return false;
  }
}

export async function verifyStudentCredentials(email: string, password: string): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot verify student: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
    
    if (result.length === 0) return undefined;
    
    const student = result[0];
    // Simple password comparison (in production, use bcrypt or similar)
    if (student.password === password && student.isActive === "true") {
      return student;
    }
    return undefined;
  } catch (error) {
    console.error("[Database] Failed to verify student:", error);
    return undefined;
  }
}

