import majorsData from './majors.json' assert { type: 'json' }
import experienceTemplatesData from './experienceTemplates.json' assert { type: 'json' }
import locationsData from './locations.json' assert { type: 'json' }
import { updateScores } from './score.js'
import { getProfile } from './profile.js'

export const majors = majorsData
export const experienceTemplates = experienceTemplatesData
export const locations = locationsData
export { updateScores, getProfile }

window.majors = majors
window.experienceTemplates = experienceTemplates
window.locations = locations
window.updateScores = updateScores
window.getProfile = getProfile