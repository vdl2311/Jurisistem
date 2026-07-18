import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Carrega as configurações do Firebase
let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (e) {
  console.error("Erro ao carregar firebase-applet-config.json:", e);
}

const projectId = firebaseConfig.projectId || process.env.FIREBASE_PROJECT_ID;
const databaseId = firebaseConfig.firestoreDatabaseId;

let app;
if (getApps().length === 0) {
  app = initializeApp({
    projectId: projectId,
  });
} else {
  app = getApps()[0];
}

// Inicializa o Firestore com suporte opcional a custom database ID
export const firestore = getFirestore(app, databaseId);

// Converte Timestamps do Firestore para instâncias de Date do Javascript
function convertTimestampsToDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Timestamp) {
    return obj.toDate();
  }
  if (obj && typeof obj === 'object' && obj._seconds !== undefined && obj._nanoseconds !== undefined) {
    return new Timestamp(obj._seconds, obj._nanoseconds).toDate();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDates);
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj;
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertTimestampsToDates(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Converte instâncias de Date para Timestamps do Firestore para persistência
function convertDatesToTimestamps(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToTimestamps);
  }
  if (typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertDatesToTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Avalia os critérios de busca (match) baseados nas opções do Prisma
function matchCriteria(item: any, where: any): boolean {
  if (!where) return true;

  // Operadores lógicos do Prisma
  if (where.OR) {
    if (Array.isArray(where.OR)) {
      const matchAny = where.OR.some((subWhere: any) => matchCriteria(item, subWhere));
      if (!matchAny) return false;
    }
  }
  if (where.AND) {
    if (Array.isArray(where.AND)) {
      const matchAll = where.AND.every((subWhere: any) => matchCriteria(item, subWhere));
      if (!matchAll) return false;
    }
  }
  if (where.NOT) {
    if (Array.isArray(where.NOT)) {
      const matchAny = where.NOT.some((subWhere: any) => matchCriteria(item, subWhere));
      if (matchAny) return false;
    } else if (typeof where.NOT === 'object') {
      if (matchCriteria(item, where.NOT)) return false;
    }
  }

  for (const key of Object.keys(where)) {
    if (key === 'OR' || key === 'AND' || key === 'NOT') continue;

    const filter = where[key];
    const val = item[key];
    if (filter === undefined) continue;

    if (filter && typeof filter === 'object' && !Array.isArray(filter) && !(filter instanceof Date)) {
      if ('contains' in filter) {
        const needle = String(filter.contains).toLowerCase();
        const haystack = String(val || '').toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      else if ('startsWith' in filter) {
        const needle = String(filter.startsWith).toLowerCase();
        const haystack = String(val || '').toLowerCase();
        if (!haystack.startsWith(needle)) return false;
      }
      else if ('endsWith' in filter) {
        const needle = String(filter.endsWith).toLowerCase();
        const haystack = String(val || '').toLowerCase();
        if (!haystack.endsWith(needle)) return false;
      }
      else if ('in' in filter) {
        const arr = filter.in;
        if (!Array.isArray(arr) || !arr.includes(val)) return false;
      }
      else if ('notIn' in filter) {
        const arr = filter.notIn;
        if (Array.isArray(arr) && arr.includes(val)) return false;
      }
      else if ('not' in filter) {
        const notVal = filter.not;
        if (notVal && typeof notVal === 'object' && !Array.isArray(notVal) && !(notVal instanceof Date)) {
          if (matchCriteria({ [key]: val }, { [key]: notVal })) return false;
        } else {
          if (val === notVal) return false;
        }
      }
      else {
        // Filtros de desigualdades
        if ('gt' in filter) {
          const limit = filter.gt instanceof Date ? filter.gt.getTime() : filter.gt;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual > limit)) return false;
        }
        if ('gte' in filter) {
          const limit = filter.gte instanceof Date ? filter.gte.getTime() : filter.gte;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual >= limit)) return false;
        }
        if ('lt' in filter) {
          const limit = filter.lt instanceof Date ? filter.lt.getTime() : filter.lt;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual < limit)) return false;
        }
        if ('lte' in filter) {
          const limit = filter.lte instanceof Date ? filter.lte.getTime() : filter.lte;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual <= limit)) return false;
        }
      }
    } else {
      if (filter instanceof Date) {
        const filterTime = filter.getTime();
        const valTime = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : null);
        if (valTime !== filterTime) return false;
      } else {
        if (val !== filter) return false;
      }
    }
  }
  return true;
}

// Ordena os itens do resultado
function sortItems(items: any[], orderBy: any): any[] {
  if (!orderBy) return items;
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];

  return [...items].sort((a, b) => {
    for (const order of orders) {
      const key = Object.keys(order)[0];
      const dir = order[key];
      const valA = a[key];
      const valB = b[key];

      if (valA === undefined || valB === undefined) continue;

      let compare = 0;
      if (valA instanceof Date && valB instanceof Date) {
        compare = valA.getTime() - valB.getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        compare = valA.localeCompare(valB);
      } else {
        compare = valA > valB ? 1 : (valA < valB ? -1 : 0);
      }

      if (compare !== 0) {
        return dir === 'desc' ? -compare : compare;
      }
    }
    return 0;
  });
}

// Carrega relações conforme parametro 'include' do Prisma
async function resolveRelations(modelName: string, items: any[], include: any): Promise<any[]> {
  if (!include || items.length === 0) return items;

  const resolvedItems = [...items];

  for (const relationName of Object.keys(include)) {
    if (!include[relationName]) continue;

    let targetModel = relationName;
    let foreignKey = `${relationName}Id`;
    let isMany = false;

    // Tradução das relações
    if (relationName === 'process') {
      targetModel = 'process';
      foreignKey = 'processId';
    } else if (relationName === 'client') {
      targetModel = 'client';
      foreignKey = 'clientId';
    } else if (relationName === 'template') {
      targetModel = 'contractTemplate';
      foreignKey = 'templateId';
    } else if (relationName === 'runs') {
      targetModel = 'agentRun';
      foreignKey = 'agentId';
      isMany = true;
    } else if (relationName === 'contracts') {
      targetModel = 'contract';
      foreignKey = 'clientId';
      isMany = true;
    } else if (relationName === 'documents') {
      targetModel = 'document';
      foreignKey = 'clientId';
      isMany = true;
    } else if (relationName === 'checks') {
      targetModel = 'complianceCheck';
      foreignKey = 'ruleId';
      isMany = true;
    }

    try {
      const targetSnapshot = await firestore.collection(targetModel).get();
      const targetItems = targetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);

      for (let i = 0; i < resolvedItems.length; i++) {
        const item = resolvedItems[i];
        if (isMany) {
          resolvedItems[i][relationName] = targetItems.filter((t: any) => 
            t[foreignKey] === item.id || t.processId === item.id || t.clientId === item.id || t.contractId === item.id
          );
        } else {
          const fKeyVal = item[foreignKey];
          resolvedItems[i][relationName] = targetItems.find((t: any) => t.id === fKeyVal) || null;
        }
      }
    } catch (e) {
      console.error(`Erro ao resolver relação ${relationName}:`, e);
    }
  }

  return resolvedItems;
}

// Proxies de Modelos para emular prisma client
function createModelProxy(modelName: string) {
  return {
    async findMany(args: any = {}) {
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);

      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }
      if (args.orderBy) {
        items = sortItems(items, args.orderBy);
      }
      if (typeof args.skip === 'number') {
        items = items.slice(args.skip);
      }
      if (typeof args.take === 'number') {
        items = items.slice(0, args.take);
      }
      if (args.include) {
        items = await resolveRelations(modelName, items, args.include);
      }
      return items;
    },

    async findUnique(args: any) {
      const where = args.where || {};
      if (where.id) {
        const docRef = firestore.collection(modelName).doc(where.id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) return null;
        let item = convertTimestampsToDates({ id: docSnap.id, ...docSnap.data() });
        if (args.include) {
          const resolved = await resolveRelations(modelName, [item], args.include);
          item = resolved[0];
        }
        return item;
      }

      const snapshot = await firestore.collection(modelName).get();
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
      let matched = items.find(item => matchCriteria(item, where));
      if (!matched) return null;
      if (args.include) {
        const resolved = await resolveRelations(modelName, [matched], args.include);
        matched = resolved[0];
      }
      return matched;
    },

    async findFirst(args: any = {}) {
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);

      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }
      if (args.orderBy) {
        items = sortItems(items, args.orderBy);
      }
      if (items.length === 0) return null;
      let item = items[0];
      if (args.include) {
        const resolved = await resolveRelations(modelName, [item], args.include);
        item = resolved[0];
      }
      return item;
    },

    async create(args: any) {
      const data = convertDatesToTimestamps(args.data || {});
      let id = data.id || args.data?.id;

      let docRef;
      if (id) {
        docRef = firestore.collection(modelName).doc(id);
      } else {
        docRef = firestore.collection(modelName).doc();
        id = docRef.id;
        data.id = id;
      }

      if (!data.createdAt) {
        data.createdAt = Timestamp.now();
      }
      if (!data.updatedAt) {
        data.updatedAt = Timestamp.now();
      }

      await docRef.set(data);

      const savedDoc = await docRef.get();
      return convertTimestampsToDates({ id: savedDoc.id, ...savedDoc.data() });
    },

    async update(args: any) {
      const data = convertDatesToTimestamps(args.data || {});
      const where = args.where || {};
      let id = where.id;

      if (!id) {
        const snapshot = await firestore.collection(modelName).get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
        const matched = items.find(item => matchCriteria(item, where));
        if (!matched) {
          throw new Error(`Record to update not found for criteria: ${JSON.stringify(where)}`);
        }
        id = matched.id;
      }

      data.updatedAt = Timestamp.now();
      const docRef = firestore.collection(modelName).doc(id);
      await docRef.update(data);

      const savedDoc = await docRef.get();
      return convertTimestampsToDates({ id: savedDoc.id, ...savedDoc.data() });
    },

    async delete(args: any) {
      const where = args.where || {};
      let id = where.id;

      if (!id) {
        const snapshot = await firestore.collection(modelName).get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
        const matched = items.find(item => matchCriteria(item, where));
        if (!matched) {
          throw new Error(`Record to delete not found for criteria: ${JSON.stringify(where)}`);
        }
        id = matched.id;
      }

      const docRef = firestore.collection(modelName).doc(id);
      const savedDoc = await docRef.get();
      const deletedData = convertTimestampsToDates({ id: savedDoc.id, ...savedDoc.data() });
      await docRef.delete();
      return deletedData;
    },

    async deleteMany(args: any = {}) {
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }

      const batch = firestore.batch();
      for (const item of items) {
        const docRef = firestore.collection(modelName).doc(item.id);
        batch.delete(docRef);
      }
      await batch.commit();
      return { count: items.length };
    },

    async updateMany(args: any = {}) {
      const data = convertDatesToTimestamps(args.data || {});
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }

      data.updatedAt = Timestamp.now();
      const batch = firestore.batch();
      for (const item of items) {
        const docRef = firestore.collection(modelName).doc(item.id);
        batch.update(docRef, data);
      }
      await batch.commit();
      return { count: items.length };
    },

    async count(args: any = {}) {
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }
      return items.length;
    },

    async aggregate(args: any = {}) {
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }

      const result: any = {};
      if (args._sum) {
        result._sum = {};
        for (const key of Object.keys(args._sum)) {
          result._sum[key] = items.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
        }
      }
      if (args._avg) {
        result._avg = {};
        for (const key of Object.keys(args._avg)) {
          const sum = items.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
          result._avg[key] = items.length ? sum / items.length : 0;
        }
      }
      if (args._count) {
        result._count = items.length;
      }
      return result;
    },

    async groupBy(args: any = {}) {
      const snapshot = await firestore.collection(modelName).get();
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }

      const byKeys = args.by || [];
      const groups: { [key: string]: any[] } = {};

      for (const item of items) {
        const groupKey = byKeys.map((k: string) => String(item[k] || '')).join('|');
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
      }

      const resultList = [];
      for (const gKey of Object.keys(groups)) {
        const groupItems = groups[gKey];
        const firstItem = groupItems[0];
        const groupResult: any = {};
        for (const k of byKeys) {
          groupResult[k] = firstItem[k];
        }

        if (args._count) {
          groupResult._count = {};
          for (const k of Object.keys(args._count)) {
            if (k === '_all') {
              groupResult._count._all = groupItems.length;
            } else {
              groupResult._count[k] = groupItems.length;
            }
          }
        }
        if (args._sum) {
          groupResult._sum = {};
          for (const k of Object.keys(args._sum)) {
            groupResult._sum[k] = groupItems.reduce((acc, curr) => acc + (Number(curr[k]) || 0), 0);
          }
        }
        resultList.push(groupResult);
      }
      return resultList;
    }
  };
}

export const db = new Proxy({}, {
  get(target, modelName: string) {
    if (modelName === '$transaction') {
      return async (promises: Promise<any>[]) => {
        return Promise.all(promises);
      };
    }
    if (modelName === '$connect' || modelName === '$disconnect') {
      return async () => {};
    }
    return createModelProxy(modelName);
  }
}) as any;
