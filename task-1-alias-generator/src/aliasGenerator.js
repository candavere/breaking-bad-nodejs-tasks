import {CONFIG} from './config.js';
export const extractFirstName = (fullName) => {
  if (!fullName || typeof fullName !== 'string'){
    throw new Error('Name must be a non-empty string');
  }
  const trimmed = fullName.trim();
  if(trimmed.length === 0){
    throw new Error('Name cannot be empty or only whitespace');
  }
  return trimmed.split(/\s+/)[0];
};
export const sliceName = (name, charCount = CONFIG>DEFAULT_CHAR_COUNT) => {
  if(!name||name.length === 0){
    return '';
  }
  const sliceLength = Math.min(charCount, name.length);
  return name.slice(0, sliceLength);
};
export const selectSurname = (surnames, lastSurname = null) => {
  if(!surnames || surnames.length === 0){
    throw new Error('Surnames list cannot be empty');
  }
  let availableSurnames = surnames;
  if(lastSurname && surnames.length > 1){
    availableSurnames = surnames.filter(s => s !== lastSurname);
  }
  const randomIndex = Math.floor(Math.random() * availableSurnames.length);
  return availableSurnames[randomIndex];
};

export const generateSuggestions = (firstName, charCount, surnames, count = CONFIG.MAX_SUGGESTIONS) => {
  if(!firstName || firstName.length === 0){
    return [];
  }
  const namePart = sliceName(firstName, charCount);
  const suggestions = [];
  const shuffledSurnames = [...surnames].sort(() => Math.random() -0.5);

  for(let i=0; i<Math.min(count, shuffledSurnames.length); i++){
    suggestions.push(`${namePart} ${shuffledSurnames[i]}`);
    }
    return suggestions;
};

export const generateBreakingBadAlias = (fullName, options = {}) => {
  try{
    const{
      charCount = CONFIG.DEFAULT_CHAR_COUNT,
      surnames = CONFIG.SURNAMES,
      lastSurname = null
    } = options;
    if (typeof charCount !== 'number' || charCount < 1){
      throw new error('Character count must be a positive number');
    }
    const firstName = extractFirstName(fullName);
    const namePart = sliceName(firstName, charCount);
    const displayName = namePart || firstName;
    const selectedSurname = selectSurname(surnames, lastSurname);
    const alias = `${displayName} ${selectedSurname}`;
    const suggestions = generateSuggestions(firstName, charCount, surnames)
    return{
      alias,
      selectedSurname,
      namePart: displayName,
      suggestions,
      metadata: {
        originalName: fullName,
        charCountUsed: Math.min(charCount, firstName.length),
        totalSuggestions: suggestions.length
      }
    };
  } catch (error){
    throw new Error(`Failed to generate alias: ${error.message}`);
  }
};
export{CONFIG} from './config.js';