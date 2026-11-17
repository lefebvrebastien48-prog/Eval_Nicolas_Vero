import { describe, it, expect } from 'vitest';
import { Warrior } from '../src/Warrior';
import { Weapon } from '../src/Weapon';

describe('Warrior', () => {
  describe('constructor (0.5 pt)', () => {
    it('should initialize its properties', () => {
      const borin = new Warrior('Borin', 120, 18, 6);

      expect(borin.name).toBe('Borin');
      expect(borin.health).toBe(120);
      expect(borin.baseAttack).toBe(18);
      expect(borin.baseDefense).toBe(6);
      expect(Warrior.RAGE_MULTIPLIER).toBe(1.5);
    });
  });

  describe('isEnraged (0.5 pt)', () => {
    it('should not be enraged with at least half of its health', () => {
      const borin = new Warrior('Borin', 120, 18, 6);

      expect(borin.isEnraged(), 'not enraged at full health').toBe(false);

      borin.takeDamage(60);

      expect(borin.isEnraged(), 'not enraged at exactly half health (60/120)').toBe(false);
    });

    it('should be enraged with less than half of its health', () => {
      const borin = new Warrior('Borin', 120, 18, 6);

      borin.takeDamage(61);

      expect(borin.isEnraged(), 'enraged below half health (59/120)').toBe(true);
    });
  });

  describe('getAttack (1 pt)', () => {
    it('should calculate its attack with its weapon', () => {
      const borin = new Warrior('Borin', 120, 18, 6);
      const axe = new Weapon('Battle Axe', 'axe', 10);

      expect(borin.getAttack(), 'attack without weapon should be baseAttack').toBe(18);

      borin.equip(axe);

      expect(borin.getAttack(), 'attack should be 18 + 10 (weapon bonus) = 28').toBe(28);
    });

    it('should multiply its attack when enraged', () => {
      const borin = new Warrior('Borin', 120, 18, 6);
      const axe = new Weapon('Battle Axe', 'axe', 10);

      borin.equip(axe);
      borin.takeDamage(100);

      expect(borin.getAttack(), 'enraged attack should be (18 + 10) x 1.5 = 42').toBe(42);
    });

    it('should round down its enraged attack', () => {
      const borin = new Warrior('Borin', 120, 18, 6);
      const dagger = new Weapon('Silver Dagger', 'dagger', 5);

      borin.equip(dagger);
      borin.takeDamage(100);

      expect(borin.getAttack(), 'enraged attack should be floor((18 + 5) x 1.5) = floor(34.5) = 34').toBe(34);

      const thorg = new Warrior('Thorg', 90, 12, 4);

      thorg.equip(new Weapon('Rusty Sword', 'sword', 1));
      thorg.takeDamage(50);

      expect(thorg.getAttack(), 'enraged attack should be floor((12 + 1) x 1.5) = floor(19.5) = 19').toBe(19);
    });
  });

  describe('canEquip (0.5 pt)', () => {
    it('should equip every weapon except a staff', () => {
      const borin = new Warrior('Borin', 120, 18, 6);

      expect(borin.canEquip(new Weapon('Battle Axe', 'axe', 10)), 'axe').toBe(true);
      expect(borin.canEquip(new Weapon('Excalibur', 'sword', 8)), 'sword').toBe(true);
      expect(borin.canEquip(new Weapon('Silver Dagger', 'dagger', 4)), 'dagger').toBe(true);
      expect(borin.canEquip(new Weapon('Staff of Fire', 'staff', 12)), 'staff').toBe(false);
    });

    it('should reject a staff', () => {
      const borin = new Warrior('Borin', 120, 18, 6);
      const staff = new Weapon('Staff of Fire', 'staff', 12);

      expect(() => borin.equip(staff)).toThrow(
        'Borin cannot equip Staff of Fire',
      );
    });
  });

  describe('describe (0.5 pt)', () => {
    it('should describe a warrior', () => {
      const borin = new Warrior('Borin', 120, 18, 6);
      const axe = new Weapon('Battle Axe', 'axe', 10);

      borin.equip(axe);

      expect(borin.describe()).toBe(
        '[Warrior] Borin - health 120/120 - attack 28 - defense 6 - weapon: Battle Axe',
      );
    });

    it('should describe an enraged warrior', () => {
      const borin = new Warrior('Borin', 120, 18, 6);
      const axe = new Weapon('Battle Axe', 'axe', 10);

      borin.equip(axe);
      borin.takeDamage(102);

      expect(borin.describe()).toBe(
        '[Warrior] Borin - health 18/120 - attack 42 - defense 6 - weapon: Battle Axe - enraged',
      );
    });
  });
});
