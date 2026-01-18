export type GemType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

// This is game states
export enum GameState {
  InputAllowed, // waiting user 
  Swapping,     // Фішки міняються місцями
  Reversing,    // Невдалий хід, міняємо назад
  Matching,     // Анімація зникнення
  Falling,      // Анімація падіння
  Refilling     // Створення нових зверху
}