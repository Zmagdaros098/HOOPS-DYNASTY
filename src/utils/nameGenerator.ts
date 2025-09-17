/**
 * Fictional Name Generator for Basketball GM App
 * Generates unique player names by combining first and last names from diverse pools
 * Ensures no real NBA player names are used in the game
 */

const FIRST_NAMES = [
  // American/English names
  "Marcus", "Jordan", "Tyler", "Brandon", "Kevin", "Michael", "David", "James", "Robert", "William",
  "Christopher", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth",
  "Daniel", "Brian", "Justin", "Sean", "Nathan", "Zachary", "Adam", "Patrick", "Noah", "Jeremy",
  "Ryan", "Nicholas", "Jacob", "Edward", "Jonathan", "Mason", "Logan", "Luke", "Gabriel", "Owen",
  "Liam", "Benjamin", "Henry", "Alexander", "Samuel", "Sebastian", "Oliver", "Ethan", "Carter", "Caleb",
  
  // International/Diverse names
  "Alejandro", "Diego", "Carlos", "Luis", "Miguel", "Rafael", "Antonio", "Francisco", "Jose", "Juan",
  "Andre", "Pierre", "Jean", "Claude", "Marcel", "Henri", "Philippe", "Olivier", "Nicolas", "Antoine",
  "Giovanni", "Marco", "Alessandro", "Lorenzo", "Matteo", "Luca", "Francesco", "Andrea", "Stefano", "Roberto",
  "Dmitri", "Viktor", "Alexei", "Mikhail", "Sergei", "Pavel", "Andrei", "Nikolai", "Ivan", "Boris",
  "Hiroshi", "Takeshi", "Kenji", "Yuki", "Akira", "Satoshi", "Taro", "Hideo", "Kazuki", "Ryota",
  "Ahmed", "Omar", "Hassan", "Ali", "Khalil", "Rashid", "Tariq", "Samir", "Karim", "Nasser",
  "Kwame", "Kofi", "Amos", "Emmanuel", "Samuel", "Isaac", "Moses", "Abraham", "Joseph", "Daniel",
  
  // Modern/Unique names
  "Zion", "Phoenix", "Atlas", "Orion", "Sage", "River", "Storm", "Blaze", "Cruz", "Dash",
  "Knox", "Rex", "Zane", "Jax", "Kai", "Neo", "Ace", "Fox", "Max", "Axel"
];

const LAST_NAMES = [
  // Common American surnames
  "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez",
  "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee",
  "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
  "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez",
  
  // European surnames
  "Mueller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann",
  "Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino", "Greco",
  "Dubois", "Martin", "Bernard", "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Leroy", "Roux",
  "Smith", "Brown", "Taylor", "Wilson", "Evans", "Thomas", "Roberts", "Johnson", "Lewis", "Walker",
  "Petrov", "Ivanov", "Smirnov", "Kuznetsov", "Popov", "Volkov", "Sokolov", "Mikhailov", "Fedorov", "Morozov",
  
  // International surnames
  "Yamamoto", "Tanaka", "Watanabe", "Ito", "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki",
  "Kim", "Park", "Lee", "Choi", "Jung", "Kang", "Cho", "Yoon", "Jang", "Lim",
  "Chen", "Wang", "Li", "Zhang", "Liu", "Yang", "Huang", "Zhao", "Wu", "Zhou",
  "Singh", "Kumar", "Sharma", "Gupta", "Verma", "Agarwal", "Jain", "Bansal", "Arora", "Chopra",
  
  // Modern/Creative surnames
  "Sterling", "Cross", "Stone", "Rivers", "Woods", "Fields", "Banks", "Wells", "Fox", "Wolf",
  "Knight", "Bishop", "King", "Prince", "Duke", "Noble", "Strong", "Swift", "Sharp", "Bright"
];

/**
 * Name Generator class for creating unique fictional player names
 */
class NameGenerator {
  private usedNames: Set<string> = new Set();
  
  /**
   * Generates a unique player name by combining random first and last names
   * @returns A unique full name in "FirstName LastName" format
   * @throws Error if no more unique combinations are available
   */
  generateUniqueName(): string {
    const maxAttempts = 1000;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const fullName = `${firstName} ${lastName}`;
      
      if (!this.usedNames.has(fullName)) {
        this.usedNames.add(fullName);
        return fullName;
      }
      
      attempts++;
    }
    
    throw new Error("Unable to generate unique name - name pool may be exhausted");
  }
  
  /**
   * Generates multiple unique player names
   * @param count Number of names to generate
   * @returns Array of unique full names
   */
  generateMultipleNames(count: number): string[] {
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        names.push(this.generateUniqueName());
      } catch (error) {
        console.warn(`Could only generate ${names.length} out of ${count} requested names`);
        break;
      }
    }
    
    return names;
  }
  
  /**
   * Generates names specifically for draft prospects (typically younger players)
   * @param count Number of draft prospects to generate
   * @returns Array of unique names for draft prospects
   */
  generateDraftClass(count: number): string[] {
    return this.generateMultipleNames(count);
  }
  
  /**
   * Generates names for free agents
   * @param count Number of free agents to generate
   * @returns Array of unique names for free agents
   */
  generateFreeAgents(count: number): string[] {
    return this.generateMultipleNames(count);
  }
  
  /**
   * Resets the used names set, allowing previously generated names to be used again
   * Useful when starting a new season or resetting the game
   */
  resetUsedNames(): void {
    this.usedNames.clear();
  }
  
  /**
   * Gets the number of names that have been generated
   * @returns Number of used names
   */
  getUsedNameCount(): number {
    return this.usedNames.size;
  }
  
  /**
   * Calculates the total possible unique name combinations
   * @returns Maximum number of unique names possible
   */
  getTotalPossibleNames(): number {
    return FIRST_NAMES.length * LAST_NAMES.length;
  }
  
  /**
   * Gets the number of available name combinations remaining
   * @returns Number of unused name combinations
   */
  getAvailableNameCount(): number {
    return this.getTotalPossibleNames() - this.getUsedNameCount();
  }
  
  /**
   * Checks if the name pool is getting low on available combinations
   * @param threshold Percentage threshold (default: 0.1 = 10%)
   * @returns True if available names are below threshold
   */
  isNamePoolLow(threshold: number = 0.1): boolean {
    const availableRatio = this.getAvailableNameCount() / this.getTotalPossibleNames();
    return availableRatio < threshold;
  }
  
  /**
   * Checks if the name pool is completely exhausted
   * @returns True if no more unique names can be generated
   */
  isNamePoolExhausted(): boolean {
    return this.getAvailableNameCount() === 0;
  }
  
  /**
   * Gets statistics about the name generator usage
   * @returns Object containing usage statistics
   */
  getStats() {
    return {
      usedNames: this.getUsedNameCount(),
      availableNames: this.getAvailableNameCount(),
      totalPossible: this.getTotalPossibleNames(),
      usagePercentage: (this.getUsedNameCount() / this.getTotalPossibleNames() * 100).toFixed(2) + "%"
    };
  }
}

// Export singleton instance for consistent usage across the app
export const nameGenerator = new NameGenerator();

// Export the class for testing or creating additional instances if needed
export { NameGenerator };

/**
 * Usage Examples:
 * 
 * // Generate a single unique name
 * const playerName = nameGenerator.generateUniqueName();
 * 
 * // Generate multiple names for a roster
 * const rosterNames = nameGenerator.generateMultipleNames(12);
 * 
 * // Generate draft class
 * const draftees = nameGenerator.generateDraftClass(60);
 * 
 * // Check if running low on names
 * if (nameGenerator.isNamePoolLow()) {
 *   console.warn("Name pool is running low!");
 * }
 * 
 * // Reset for new season
 * nameGenerator.resetUsedNames();
 * 
 * // Get usage statistics
 * console.log(nameGenerator.getStats());
 */