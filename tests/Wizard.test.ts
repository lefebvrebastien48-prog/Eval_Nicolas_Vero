import { describe, it, expect, vi } from 'vitest';
import { Wizard } from '../src/Wizard';
import { Warrior } from '../src/Warrior';
import { Weapon } from '../src/Weapon';

describe('Wizard', () => {
  describe('constructor (0.5 pt)', () => {
    it('should initialize its properties', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);

      expect(merlin.name).toBe('Merlin');
      expect(merlin.health).toBe(70);
      expect(merlin.baseAttack).toBe(22);
      expect(merlin.baseDefense).toBe(2);
      expect(merlin.maxMana).toBe(50);
      expect(merlin.mana, 'mana should start at maxMana').toBe(50);
      expect(Wizard.SPELL_COST).toBe(10);
    });

    it('should reject a negative mana', () => {
      expect(() => {
        new Wizard('Merlin', 70, 22, 2, -10);
      }).toThrow('The mana of Merlin cannot be negative');
    });

    it('should accept a zero mana', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 0);

      expect(merlin.mana, '0 is a valid mana').toBe(0);
    });
  });

  describe('mana and canCastSpell (1 pt)', () => {
    it('should change its mana', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);

      merlin.mana = 30;
      expect(merlin.mana).toBe(30);

      merlin.mana = 0;
      expect(merlin.mana, '0 is a valid mana value').toBe(0);
    });

    it('should reject an invalid mana value', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);

      expect(() => {
        merlin.mana = 80;
      }, 'mana above maxMana should be rejected').toThrow('The mana of Merlin must be between 0 and 50');

      expect(() => {
        merlin.mana = -1;
      }, 'negative mana should be rejected').toThrow('The mana of Merlin must be between 0 and 50');

      expect(merlin.mana, 'mana should not change after a rejected value').toBe(50);
    });

    it('should cast a spell only with enough mana', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);

      merlin.mana = 10;
      expect(merlin.canCastSpell(), 'can cast with exactly SPELL_COST (10) mana').toBe(true);

      merlin.mana = 9;
      expect(merlin.canCastSpell(), 'cannot cast with less than SPELL_COST (10) mana').toBe(false);
    });
  });

  describe('getAttack and canEquip (0.5 pt)', () => {
    it('should calculate its attack with its weapon', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);
      const staff = new Weapon('Staff of Fire', 'staff', 12);

      expect(merlin.getAttack(), 'attack without weapon should be baseAttack').toBe(22);

      merlin.equip(staff);

      expect(merlin.getAttack(), 'attack should be 22 + 12 (weapon bonus) = 34').toBe(34);
    });

    it('should only equip a staff or a dagger', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);

      expect(merlin.canEquip(new Weapon('Staff of Fire', 'staff', 12)), 'staff').toBe(true);
      expect(merlin.canEquip(new Weapon('Silver Dagger', 'dagger', 4)), 'dagger').toBe(true);
      expect(merlin.canEquip(new Weapon('Excalibur', 'sword', 8)), 'sword').toBe(false);
      expect(merlin.canEquip(new Weapon('Battle Axe', 'axe', 10)), 'axe').toBe(false);
    });
  });

  describe('describe (0.5 pt)', () => {
    it('should describe a wizard', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);
      const staff = new Weapon('Staff of Fire', 'staff', 12);

      merlin.equip(staff);

      expect(merlin.describe()).toBe(
        '[Wizard] Merlin - health 70/70 - attack 34 - defense 2 - weapon: Staff of Fire - mana 50/50',
      );

      const gandalf = new Wizard('Gandalf', 80, 23, 2, 30);

      gandalf.mana = 15;

      expect(gandalf.describe()).toBe(
        '[Wizard] Gandalf - health 80/80 - attack 23 - defense 2 - weapon: none - mana 15/30',
      );
    });
  });

  describe('attack (1.5 pts)', () => {
    it('should heal and spend mana after a spell', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);
      const target = new Warrior('Borin', 120, 18, 0);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      merlin.takeDamage(30);
      const damage = merlin.attack(target);

      expect(damage, 'damage should be 22 (attack) - 0 (target defense) = 22').toBe(22);
      expect(merlin.health, 'health should be 40 + floor(22 x 0.2) = 44').toBe(44);
      expect(merlin.mana, 'mana should be 50 - 10 (SPELL_COST) = 40').toBe(40);

      log.mockRestore();
    });

    it('should round down the heal of a spell', () => {
      const gandalf = new Wizard('Gandalf', 80, 23, 2, 30);
      const target = new Warrior('Borin', 120, 18, 0);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      gandalf.takeDamage(30);
      gandalf.attack(target);

      expect(gandalf.health, 'health should be 50 + floor(23 x 0.2) = 50 + floor(4.6) = 54').toBe(54);
      expect(gandalf.mana, 'mana should be 30 - 10 (SPELL_COST) = 20').toBe(20);

      log.mockRestore();
    });

    it('should not heal above its max health', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);
      const target = new Warrior('Borin', 120, 18, 0);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      merlin.attack(target);

      expect(merlin.health, 'health should not go above maxHealth').toBe(70);
      expect(merlin.mana, 'mana should be spent even at full health').toBe(40);

      log.mockRestore();
    });

    it('should neither heal nor spend mana without enough mana', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);
      const target = new Warrior('Borin', 120, 18, 0);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      merlin.mana = 5;
      merlin.takeDamage(30);
      merlin.attack(target);

      expect(target.health, 'the attack should still hit: 120 - 22 = 98').toBe(98);
      expect(merlin.health, 'no heal without enough mana').toBe(40);
      expect(merlin.mana, 'no mana spent without enough mana').toBe(5);

      log.mockRestore();
    });

    it('should not spend mana when the attack fails', () => {
      const merlin = new Wizard('Merlin', 70, 22, 2, 50);

      expect(() => merlin.attack(merlin)).toThrow(
        'Merlin cannot attack themselves',
      );

      expect(merlin.mana, 'no mana spent when the attack throws').toBe(50);
    });
  });
});
