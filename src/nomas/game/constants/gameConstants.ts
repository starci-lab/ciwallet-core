/* eslint-disable indent */
// Game layout constants
export const GAME_LAYOUT = {
  GROUND_OFFSET: 30, // Distance from bottom of screen for ground line
  PET_GROUND_OFFSET: -12, // Distance from bottom for pets (standing on ground) - 0 = sát cạnh dưới
  FOOD_GROUND_OFFSET: 15, // Distance from bottom for food (sitting on ground)
  FOOD_DROP_HEIGHT: 25, // Height above final position for food drop animation
  PET_HEIGHT: 40, // Pet sprite height (approximate)
  PET_WIDTH: 40, // Pet sprite width (approximate)
  PET_SCALE: 2.5, // Pet sprite scale multiplier
  FOOD_WIDTH: 30, // Food sprite width (approximate)
  FOOD_HEIGHT: 30, // Food sprite height (approximate)
  FOOD_SCALE: 1.5, // Food sprite scale multiplier
  BALL_WIDTH: 20, // Ball sprite width (approximate)
  BALL_HEIGHT: 20, // Ball sprite height (approximate)
  BALL_SCALE: 0.01, // Ball sprite scale multiplier
  POOP_WIDTH: 25, // Poop sprite width (approximate)
  POOP_HEIGHT: 25, // Poop sprite height (approximate)
  POOP_SCALE: 1.5, // Poop sprite scale multiplier
  POOP_GROWN_OFFSET: 60, // Poop grown offset
  // Base width để tính responsive scale
  BASE_WIDTH: 1920,
} as const

// Calculated constants based on layout
export const CALCULATED_CONSTANTS = {
  // Pet dimensions after scaling
  get SCALED_PET_WIDTH() {
    return GAME_LAYOUT.PET_WIDTH * GAME_LAYOUT.PET_SCALE
  },
  get SCALED_PET_HEIGHT() {
    return GAME_LAYOUT.PET_HEIGHT * GAME_LAYOUT.PET_SCALE
  },

  // Food dimensions after scaling
  get SCALED_FOOD_WIDTH() {
    return GAME_LAYOUT.FOOD_WIDTH * GAME_LAYOUT.FOOD_SCALE
  },
  get SCALED_FOOD_HEIGHT() {
    return GAME_LAYOUT.FOOD_HEIGHT * GAME_LAYOUT.FOOD_SCALE
  },

  // Ball dimensions after scaling
  get SCALED_BALL_WIDTH() {
    return GAME_LAYOUT.BALL_WIDTH * GAME_LAYOUT.BALL_SCALE
  },
  get SCALED_BALL_HEIGHT() {
    return GAME_LAYOUT.BALL_HEIGHT * GAME_LAYOUT.BALL_SCALE
  },

  // Poop dimensions after scaling
  get SCALED_POOP_WIDTH() {
    return GAME_LAYOUT.POOP_WIDTH * GAME_LAYOUT.POOP_SCALE
  },
  get SCALED_POOP_HEIGHT() {
    return GAME_LAYOUT.POOP_HEIGHT * GAME_LAYOUT.POOP_SCALE
  },
} as const

// Game mechanics constants
export const GAME_MECHANICS = {
  CHASE_DISTANCE: 20, // Distance to reach food
  FOOD_DETECTION_RANGE: 40, // Range to detect food for eating
  HUNGER_THRESHOLD: 80, // Hunger level below which pets chase food
  HUNGER_RESTORE_AMOUNT: 20, // Hunger restored when eating food
  HUNGER_DECREASE_PER_HOUR: 3000, // Hunger decrease rate per hour
  FOOD_DESPAWN_TIME: 20000, // Time before food auto-despawns (ms)
  SAFETY_CHECK_INTERVAL: 5000, // Safety check timer interval (ms)
  POST_EATING_DELAY: 2000, // Delay after eating before next action (ms)
  TRANSITION_DELAY: 30, // Quick transition delay (ms)
  SECONDARY_CHECK_DELAY: 500, // Secondary force check delay (ms)
  CHASE_CHECK_INTERVAL: 1000, // Interval between chase opportunity checks (ms)
  CLEANLINESS_DECREASE_PER_HOUR: 3000, // Cleanliness decrease rate per hour (about half of hunger)
  POOP_CHECK_INTERVAL: 5000, // Interval between poop opportunity checks (ms)
  POOP_THRESHOLD: 50, // Cleanliness level below which pet may poop
  POOP_DESPAWN_TIME: 60000, // Time before poop auto-despawns (ms) - 1 minute

  // Happiness system constants
  HAPPINESS_UPDATE_INTERVAL: 5000, // Interval between happiness updates (ms)
  HAPPINESS_DECREASE_RATE: 20.0, // Happiness decrease per update (increased from 0.2)
  HAPPINESS_INCREASE_AMOUNT: 25, // Happiness gained when playing with ball
  BALL_LIFETIME: 30000, // Time before ball auto-despawns (ms) - 30 seconds
} as const

// Helper functions for game positioning
export const GamePositioning = {
  // Get ground Y position for a given camera height (general ground line)
  getGroundY(cameraHeight: number): number {
    return cameraHeight - GAME_LAYOUT.GROUND_OFFSET
  },

  // Get pet spawn Y position (pets stand on ground)
  getPetY(cameraHeight: number): number {
    return cameraHeight - GAME_LAYOUT.PET_GROUND_OFFSET
  },

  // Get food drop Y position (food drops slightly above final position)
  getFoodDropY(cameraHeight: number): number {
    return (
      cameraHeight -
      GAME_LAYOUT.FOOD_GROUND_OFFSET -
      GAME_LAYOUT.FOOD_DROP_HEIGHT
    )
  },

  // Get food final Y position (food sits on ground)
  getFoodFinalY(cameraHeight: number): number {
    return cameraHeight - GAME_LAYOUT.FOOD_GROUND_OFFSET
  },

  // Get ball drop Y position (ball drops slightly above final position)
  getBallDropY(cameraHeight: number): number {
    return (
      cameraHeight -
      GAME_LAYOUT.FOOD_GROUND_OFFSET -
      GAME_LAYOUT.FOOD_DROP_HEIGHT
    )
  },

  // Get ball final Y position (ball sits on ground)
  getBallFinalY(cameraHeight: number): number {
    return cameraHeight - GAME_LAYOUT.FOOD_GROUND_OFFSET
  },

  // Get poop spawn Y position (poop sits on ground)
  getPoopY(cameraHeight: number): number {
    return cameraHeight - GAME_LAYOUT.FOOD_GROUND_OFFSET
  },

  // Get pet boundary limits
  getPetBoundaries(cameraWidth: number) {
    const halfWidth = CALCULATED_CONSTANTS.SCALED_PET_WIDTH / 2
    const bounds = {
      minX: halfWidth,
      maxX: cameraWidth - halfWidth,
    }
    // console.log(`Pet boundaries: [${bounds.minX.toFixed(1)}, ${bounds.maxX.toFixed(1)}], camera: ${cameraWidth}`)
    return bounds
  },

  // Get food boundary limits
  getFoodBoundaries(cameraWidth: number) {
    const halfWidth = CALCULATED_CONSTANTS.SCALED_FOOD_WIDTH / 2
    const bounds = {
      minX: halfWidth,
      maxX: cameraWidth - halfWidth,
    }
    // console.log(`Food boundaries: [${bounds.minX.toFixed(1)}, ${bounds.maxX.toFixed(1)}], camera: ${cameraWidth}`)
    return bounds
  },

  // Get ball boundary limits
  getBallBoundaries(cameraWidth: number) {
    const halfWidth = CALCULATED_CONSTANTS.SCALED_BALL_WIDTH / 2
    const bounds = {
      minX: halfWidth,
      maxX: cameraWidth - halfWidth,
    }
    return bounds
  },

  // Get poop boundary limits
  getPoopBoundaries(cameraWidth: number) {
    const halfWidth = CALCULATED_CONSTANTS.SCALED_POOP_WIDTH / 2
    const bounds = {
      minX: halfWidth,
      maxX: cameraWidth - halfWidth,
    }
    return bounds
  },

  // Helper to get responsive X position as percentage
  getResponsiveX(cameraWidth: number, percentage: number): number {
    return cameraWidth * (percentage / 100)
  },

  // Get responsive scale factor based on current camera width
  getResponsiveScale(cameraWidth: number): number {
    return cameraWidth / GAME_LAYOUT.BASE_WIDTH
  },

  // Get responsive pet scale
  getResponsivePetScale(cameraWidth: number): number {
    return Math.max(
      GAME_LAYOUT.PET_SCALE * this.getResponsiveScale(cameraWidth),
      1.2
    )
  },

  // Get responsive food scale
  getResponsiveFoodScale(cameraWidth: number): number {
    return Math.max(
      GAME_LAYOUT.FOOD_SCALE * this.getResponsiveScale(cameraWidth),
      1.2
    )
  },

  // Get responsive ball scale
  getResponsiveBallScale(cameraWidth: number): number {
    return Math.max(
      GAME_LAYOUT.BALL_SCALE * this.getResponsiveScale(cameraWidth),
      1.2
    )
  },

  // Get responsive poop scale
  getResponsivePoopScale(cameraWidth: number): number {
    return Math.max(
      GAME_LAYOUT.POOP_SCALE * this.getResponsiveScale(cameraWidth),
      1.2
    )
  },

  // Helper to get responsive Y position (height is fixed, so Y is usually absolute)
  getResponsiveY(percentage: number, baseHeight: number = 140): number {
    return baseHeight * (percentage / 100)
  },
} as const
