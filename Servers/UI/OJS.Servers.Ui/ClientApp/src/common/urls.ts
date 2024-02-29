/* eslint-disable import/group-exports */
/* eslint-disable import/prefer-default-export */

// Endpoints
export const CREATE_ENDPOINT = 'Create';
export const UPDATE_ENDPOINT = 'Edit';
export const DELETE_ENDPOINT = 'Delete';
export const GET_ENDPOINT = 'Get';
export const GETALL_ENDPOINT = 'GetAll';

// Paths
export const NEW_ADMINISTRATION_PATH = 'administration-new';
export const CONTESTS_PATH = `/${NEW_ADMINISTRATION_PATH}/contests`;
export const CONTEST_CATEGORIES_PATH = `/${NEW_ADMINISTRATION_PATH}/contest-categories`;
export const SUBMISSIONS_PATH = `/${NEW_ADMINISTRATION_PATH}/submissions`;
export const SUBMISSIONS_FOR_PROCESSING_PATH = `/${NEW_ADMINISTRATION_PATH}/submissions-for-processing`;
export const TESTS_PATH = `/${NEW_ADMINISTRATION_PATH}/tests`;
export const PROBLEMS_PATH = `/${NEW_ADMINISTRATION_PATH}/problems`;
export const PROBLEM_GROUPS_PATH = `/${NEW_ADMINISTRATION_PATH}/problem-groups`;
export const PROBLEM_RESOURCES_PATH = `/${NEW_ADMINISTRATION_PATH}/problem-resources`;
export const SUBMISSION_TYPES_PATH = `/${NEW_ADMINISTRATION_PATH}/submission-types`;
export const PARTICIPANTS_PATH = `/${NEW_ADMINISTRATION_PATH}/participants`;
