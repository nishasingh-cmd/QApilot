import Finding from "../models/Finding.js";

export const createFinding = async (userId, data) => {
  return Finding.create({ ...data, userId });
};

export const getFindings = async (userId, filters = {}, options = {}) => {
  const query = { userId, ...filters };
  
  const sort = options.sort || { createdAt: -1 };
  const limit = options.limit ? parseInt(options.limit) : 50;
  const skip = options.skip ? parseInt(options.skip) : 0;

  return Finding.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();
};

export const getFinding = async (userId, findingId) => {
  return Finding.findOne({ _id: findingId, userId });
};

export const updateFinding = async (userId, findingId, updateData) => {
  return Finding.findOneAndUpdate(
    { _id: findingId, userId },
    { $set: updateData },
    { new: true }
  );
};

export const resolveFinding = async (userId, findingId) => {
  return Finding.findOneAndUpdate(
    { _id: findingId, userId },
    { $set: { status: "resolved", resolvedAt: new Date() } },
    { new: true }
  );
};

export const ignoreFinding = async (userId, findingId) => {
  return Finding.findOneAndUpdate(
    { _id: findingId, userId },
    { $set: { status: "ignored" } },
    { new: true }
  );
};

export const assignFinding = async (userId, findingId, assignedTo) => {
  return Finding.findOneAndUpdate(
    { _id: findingId, userId },
    { $set: { assignedTo } },
    { new: true }
  );
};

export const deleteFinding = async (userId, findingId) => {
  return Finding.findOneAndDelete({ _id: findingId, userId });
};

export const bulkUpdate = async (userId, findingIds, updateData) => {
  return Finding.updateMany(
    { _id: { $in: findingIds }, userId },
    { $set: updateData }
  );
};

export const bulkResolve = async (userId, findingIds) => {
  return Finding.updateMany(
    { _id: { $in: findingIds }, userId },
    { $set: { status: "resolved", resolvedAt: new Date() } }
  );
};

export const bulkIgnore = async (userId, findingIds) => {
  return Finding.updateMany(
    { _id: { $in: findingIds }, userId },
    { $set: { status: "ignored" } }
  );
};

export default {
  createFinding,
  getFindings,
  getFinding,
  updateFinding,
  resolveFinding,
  ignoreFinding,
  assignFinding,
  deleteFinding,
  bulkUpdate,
  bulkResolve,
  bulkIgnore
};
