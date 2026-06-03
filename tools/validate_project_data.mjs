import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const dataRoot = resolve(projectRoot, "web", "src", "data");

const SCORE_KEYS = ["health", "study", "social", "practice", "pressure"];

const files = {
  majors: resolve(dataRoot, "majors.json"),
  experienceTemplates: resolve(dataRoot, "experienceTemplates.json"),
  locations: resolve(dataRoot, "locations.json"),
  coreCourses: resolve(dataRoot, "coreCourses.json"),
  courseKnowledgeBase: resolve(dataRoot, "courseKnowledgeBase.json")
};

const errors = [];
const warnings = [];

const [
  majors,
  experienceTemplates,
  locations,
  coreCourses,
  courseKnowledgeBase
] = await Promise.all([
  readJson(files.majors),
  readJson(files.experienceTemplates),
  readJson(files.locations),
  readJson(files.coreCourses),
  readJson(files.courseKnowledgeBase)
]);

validateMajors(majors);
validateLocations(locations);
validateExperienceTemplates(experienceTemplates, majors, locations);
validateCoreCourses(coreCourses, majors);
validateCourseKnowledgeBase(courseKnowledgeBase, majors);

if (warnings.length > 0) {
  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }
  console.error(`\nData validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log("Data validation passed.");
console.log(`Majors: ${majors.length}`);
console.log(`Locations: ${locations.length}`);
console.log(`Experience steps: ${Object.values(experienceTemplates).reduce((sum, steps) => sum + steps.length, 0)}`);
console.log(`Experience options: ${Object.values(experienceTemplates).reduce((sum, steps) => {
  return sum + steps.reduce((stepSum, step) => stepSum + step.options.length, 0);
}, 0)}`);
console.log(`Core courses: ${coreCourses.length}`);
console.log(`Course knowledge entries: ${courseKnowledgeBase.length}`);

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${relative(filePath)} cannot be read as valid JSON: ${error.message}`);
    return null;
  }
}

function validateMajors(value) {
  if (!Array.isArray(value)) {
    errors.push("majors.json must be an array.");
    return;
  }

  const ids = new Set();
  const names = new Set();

  value.forEach((major, index) => {
    const path = `majors[${index}]`;
    requireString(major?.id, `${path}.id`);
    requireString(major?.name, `${path}.name`);
    requireString(major?.description, `${path}.description`);
    requireString(major?.icon, `${path}.icon`);
    requireString(major?.color, `${path}.color`);

    if (major?.id) checkUnique(ids, major.id, `${path}.id`);
    if (major?.name) checkUnique(names, major.name, `${path}.name`);

    if (!Array.isArray(major?.tags) || major.tags.length === 0) {
      errors.push(`${path}.tags must be a non-empty array.`);
    }
  });
}

function validateLocations(value) {
  if (!Array.isArray(value)) {
    errors.push("locations.json must be an array.");
    return;
  }

  const ids = new Set();

  value.forEach((location, index) => {
    const path = `locations[${index}]`;
    requireString(location?.id, `${path}.id`);
    requireString(location?.name, `${path}.name`);
    requireString(location?.icon, `${path}.icon`);
    requireString(location?.type, `${path}.type`);
    requireNumber(location?.x, `${path}.x`);
    requireNumber(location?.y, `${path}.y`);

    if (location?.id) checkUnique(ids, location.id, `${path}.id`);
    if (Number(location?.x) < 0 || Number(location?.x) > 100) {
      errors.push(`${path}.x must be between 0 and 100.`);
    }
    if (Number(location?.y) < 0 || Number(location?.y) > 100) {
      errors.push(`${path}.y must be between 0 and 100.`);
    }
  });
}

function validateExperienceTemplates(value, majorsValue, locationsValue) {
  if (!isPlainObject(value)) {
    errors.push("experienceTemplates.json must be an object keyed by major id.");
    return;
  }

  const majorIds = new Set((majorsValue || []).map((major) => major.id));
  const templateMajorIds = new Set(Object.keys(value));
  const locationIds = new Set((locationsValue || []).map((location) => location.id));
  const optionIds = new Set();

  for (const majorId of majorIds) {
    if (!templateMajorIds.has(majorId)) {
      errors.push(`experienceTemplates.${majorId} is missing.`);
    }
  }

  for (const majorId of templateMajorIds) {
    if (!majorIds.has(majorId)) {
      errors.push(`experienceTemplates.${majorId} does not match any majors.id.`);
    }

    const steps = value[majorId];
    if (!Array.isArray(steps) || steps.length === 0) {
      errors.push(`experienceTemplates.${majorId} must be a non-empty array.`);
      continue;
    }

    const stepIds = new Set();

    steps.forEach((step, stepIndex) => {
      const stepPath = `experienceTemplates.${majorId}[${stepIndex}]`;
      requireString(step?.id, `${stepPath}.id`);
      requireString(step?.period, `${stepPath}.period`);
      requireString(step?.question, `${stepPath}.question`);

      if (step?.id) checkUnique(stepIds, step.id, `${stepPath}.id`);

      if (!Array.isArray(step?.options) || step.options.length < 2) {
        errors.push(`${stepPath}.options must contain at least 2 options.`);
        return;
      }

      step.options.forEach((option, optionIndex) => {
        const optionPath = `${stepPath}.options[${optionIndex}]`;
        requireString(option?.id, `${optionPath}.id`);
        requireString(option?.label, `${optionPath}.label`);
        requireString(option?.event, `${optionPath}.event`);
        requireString(option?.locationId, `${optionPath}.locationId`);

        if (option?.id) checkUnique(optionIds, option.id, `${optionPath}.id`);
        if (option?.locationId && !locationIds.has(option.locationId)) {
          errors.push(`${optionPath}.locationId "${option.locationId}" does not exist in locations.json.`);
        }

        validateScore(option?.score, `${optionPath}.score`);
      });
    });
  }
}

function validateCoreCourses(value, majorsValue) {
  if (!Array.isArray(value)) {
    errors.push("coreCourses.json must be an array.");
    return;
  }

  const majorNames = new Set((majorsValue || []).map((major) => major.name));
  const courseKeys = new Set();

  value.forEach((course, index) => {
    const path = `coreCourses[${index}]`;
    requireString(course?.major, `${path}.major`);
    requireString(course?.courseCategory, `${path}.courseCategory`);
    requireString(course?.courseGroup, `${path}.courseGroup`);
    requireString(course?.courseName, `${path}.courseName`);
    requireString(course?.briefIntro, `${path}.briefIntro`);

    if (course?.major && !majorNames.has(course.major)) {
      errors.push(`${path}.major "${course.major}" does not match any majors.name.`);
    }

    if (course?.major && course?.courseName) {
      checkUnique(courseKeys, `${course.major}:${course.courseName}`, `${path}.courseName`);
    }

    if (course?.sourceUrl && !isLikelyUrl(course.sourceUrl)) {
      warnings.push(`${path}.sourceUrl is not a likely URL.`);
    }
  });
}

function validateCourseKnowledgeBase(value, majorsValue) {
  if (!Array.isArray(value)) {
    errors.push("courseKnowledgeBase.json must be an array.");
    return;
  }

  const majorIds = new Set((majorsValue || []).map((major) => major.id));
  const majorNames = new Set((majorsValue || []).map((major) => major.name));
  const ids = new Set();

  value.forEach((course, index) => {
    const path = `courseKnowledgeBase[${index}]`;
    requireString(course?.id, `${path}.id`);
    requireString(course?.majorId, `${path}.majorId`);
    requireString(course?.major, `${path}.major`);
    requireString(course?.courseName, `${path}.courseName`);
    requireString(course?.courseCategory, `${path}.courseCategory`);
    requireString(course?.courseGroup, `${path}.courseGroup`);
    requireString(course?.highSchoolFriendlyIntro, `${path}.highSchoolFriendlyIntro`);

    if (course?.id) checkUnique(ids, course.id, `${path}.id`);
    if (course?.majorId && !majorIds.has(course.majorId)) {
      errors.push(`${path}.majorId "${course.majorId}" does not match any majors.id.`);
    }
    if (course?.major && !majorNames.has(course.major)) {
      errors.push(`${path}.major "${course.major}" does not match any majors.name.`);
    }

    requireNonEmptyStringArray(course?.learningContent, `${path}.learningContent`);
    requireNonEmptyStringArray(course?.applicationAreas, `${path}.applicationAreas`);
    requireNonEmptyStringArray(course?.aiConsultationHints, `${path}.aiConsultationHints`);
  });
}

function validateScore(score, path) {
  if (!isPlainObject(score)) {
    errors.push(`${path} must be an object.`);
    return;
  }

  const keys = Object.keys(score);
  for (const key of SCORE_KEYS) {
    if (!keys.includes(key)) {
      errors.push(`${path}.${key} is missing.`);
    } else {
      requireNumber(score[key], `${path}.${key}`);
    }
  }

  for (const key of keys) {
    if (!SCORE_KEYS.includes(key)) {
      errors.push(`${path}.${key} is not a supported score dimension.`);
    }
  }
}

function requireString(value, path) {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push(`${path} must be a non-empty string.`);
  }
}

function requireNumber(value, path) {
  if (!Number.isFinite(Number(value))) {
    errors.push(`${path} must be a finite number.`);
  }
}

function requireNonEmptyStringArray(value, path) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${path} must be a non-empty array.`);
    return;
  }

  value.forEach((item, index) => requireString(item, `${path}[${index}]`));
}

function checkUnique(seen, value, path) {
  if (seen.has(value)) {
    errors.push(`${path} "${value}" is duplicated.`);
    return;
  }

  seen.add(value);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isLikelyUrl(value) {
  return /^https?:\/\//.test(value);
}

function relative(filePath) {
  return filePath.replace(`${projectRoot}\\`, "").replaceAll("\\", "/");
}
