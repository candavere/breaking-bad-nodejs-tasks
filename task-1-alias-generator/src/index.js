import * as readline from 'readline';
import { generateBreakingBadAlias, CONFIG } from './aliasGenerator.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const question = (query) => new Promise((resolve) => {
  rl.question(query, resolve);
});


async function main() {
  console.log('\nWelcome to the Breaking Bad Alias Generator!');
  
  
  try {
    const fullName = await question('Enter your full name: ');
    const customCount = await question(
      `How many characters to use? (default: ${CONFIG.DEFAULT_CHAR_COUNT}, press Enter for default): `
    );
    
    const charCount = customCount.trim() 
      ? parseInt(customCount, 10) 
      : CONFIG.DEFAULT_CHAR_COUNT;
    
    if (isNaN(charCount) || charCount < 1) {
      console.log('Invalid character count. Using default.');
    }

    const result = generateBreakingBadAlias(fullName, { 
      charCount: Math.max(1, charCount)
    });

    
    console.log(`Your Breaking Bad Alias: ${result.alias}`);
    
    
    if (result.suggestions && result.suggestions.length > 0) {
      console.log('\nOther suggestions you might like:');
      result.suggestions
        .filter(s => s !== result.alias)
        .forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
    }
   
    console.log('\nGeneration Details:');
    console.log(`   • Used ${result.metadata.charCountUsed} characters from "${result.metadata.originalName}"`);
    console.log(`   • Surname: ${result.selectedSurname}`);
    
    
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    console.log('Please try again with a valid name.\n');
  } finally {
    rl.close();
  }
}

main().catch(console.error);

export { generateBreakingBadAlias, CONFIG };