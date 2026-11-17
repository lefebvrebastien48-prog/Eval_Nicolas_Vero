import { describe, it, expect } from 'vitest';
import { Weapon } from '../src/Weapon';

describe('Weapon', () => {
  describe('constructor (3 pts)', () => {
    it('should create a weapon with the given properties', () => {
      const weapon = new Weapon('Excalibur', 'sword', 8);

      expect(weapon.name).toBe('Excalibur');
      expect(weapon.kind).toBe('sword');
      expect(weapon.attackBonus).toBe(8);
    });

    it('should accept a zero attack bonus', () => {
      const weapon = new Weapon('Wooden Sword', 'sword', 0);

      expect(weapon.attackBonus, '0 is a valid attack bonus').toBe(0);
    });

    it('should reject a negative attack bonus', () => {
      expect(() => {
        new Weapon('Cursed Blade', 'sword', -5);
      }).toThrow(
        'The attack bonus of Cursed Blade cannot be negative',
      );
    });
  });

  describe('describe (2 pts)', () => {
    it('should describe a weapon correctly', () => {
      const weapon = new Weapon('Excalibur', 'sword', 8);

      expect(weapon.describe()).toBe('Excalibur (sword, +8 attack)');

      const dagger = new Weapon('Silver Dagger', 'dagger', 4);

      expect(dagger.describe()).toBe('Silver Dagger (dagger, +4 attack)');
    });
  });
});
