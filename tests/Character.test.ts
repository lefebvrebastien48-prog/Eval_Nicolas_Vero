import { describe, it, expect, vi } from 'vitest';
import { Character } from '../src/Character';
import { Weapon } from '../src/Weapon';

class TrainingDummy extends Character {
  public override getAttack(): number {
    return this.baseAttack + this.getWeaponAttackBonus();
  }

  public override canEquip(weapon: Weapon): boolean {
    return weapon.kind !== 'axe';
  }
}

describe('Character', () => {
  describe('constructor (1 pt)', () => {
    it('should initialize its properties', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);

      expect(dummy.name).toBe('Borin');
      expect(dummy.maxHealth).toBe(120);
      expect(dummy.health, 'health should start at maxHealth').toBe(120);
      expect(dummy.baseAttack).toBe(10);
      expect(dummy.baseDefense).toBe(6);
      expect(dummy.isAlive(), 'a new character should be alive').toBe(true);
    });

    it('should reject non-positive health', () => {
      expect(() => {
        new TrainingDummy('Borin', 0, 10, 6);
      }, 'health 0 should be rejected').toThrow(
        'The health of Borin must be strictly positive',
      );

      expect(() => {
        new TrainingDummy('Borin', -10, 10, 6);
      }, 'negative health should be rejected').toThrow(
        'The health of Borin must be strictly positive',
      );
    });
  });

  describe('equip (1.5 pts)', () => {
    it('should equip a weapon', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);
      const sword = new Weapon('Excalibur', 'sword', 8);

      dummy.equip(sword);

      expect(dummy.describe()).toContain('weapon: Excalibur');
    });

    it('should reject a forbidden weapon', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);
      const axe = new Weapon('Battle Axe', 'axe', 10);

      expect(() => dummy.equip(axe), 'equip() should throw when canEquip() returns false').toThrow(
        'Borin cannot equip Battle Axe',
      );
    });

    it('should replace the previous weapon', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);
      const sword = new Weapon('Excalibur', 'sword', 8);
      const dagger = new Weapon('Silver Dagger', 'dagger', 4);

      dummy.equip(sword);
      dummy.equip(dagger);

      expect(dummy.describe(), 'the new weapon should replace the previous one').toContain('weapon: Silver Dagger');
    });
  });

  describe('getWeaponAttackBonus (1 pt)', () => {
    it('should calculate attack with its weapon', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);
      const sword = new Weapon('Excalibur', 'sword', 8);

      dummy.equip(sword);

      expect(dummy.getAttack(), 'attack should be 10 + 8 (weapon bonus) = 18').toBe(18);

      const other = new TrainingDummy('Aria', 80, 7, 3);

      other.equip(new Weapon('Silver Dagger', 'dagger', 4));

      expect(other.getAttack(), 'attack should be 7 + 4 (weapon bonus) = 11').toBe(11);
    });
  });

  describe('describe (1 pt)', () => {
    it('should describe a character without a weapon', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);

      expect(dummy.describe()).toBe(
        'Borin - health 120/120 - attack 10 - defense 6 - weapon: none',
      );
    });

    it('should describe a wounded character with a weapon', () => {
      const dummy = new TrainingDummy('Aria', 80, 7, 3);

      dummy.equip(new Weapon('Silver Dagger', 'dagger', 4));
      dummy.takeDamage(25);

      expect(dummy.describe()).toBe(
        'Aria - health 55/80 - attack 11 - defense 3 - weapon: Silver Dagger',
      );
    });
  });

  describe('takeDamage, heal and isAlive (1.5 pts)', () => {
    it('should decrease health when taking damage', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);

      dummy.takeDamage(30);

      expect(dummy.health, 'health should be 120 - 30 = 90').toBe(90);
      expect(dummy.isAlive()).toBe(true);
    });

    it('should never have negative health', () => {
      const dummy = new TrainingDummy('Borin', 20, 10, 6);

      dummy.takeDamage(50);

      expect(dummy.health, 'health should not go below 0').toBe(0);
      expect(dummy.isAlive(), 'a character with 0 health should be KO').toBe(false);
    });

    it('should heal without exceeding max health', () => {
      const dummy = new TrainingDummy('Borin', 120, 10, 6);

      dummy.takeDamage(30);
      dummy.heal(10);

      expect(dummy.health, 'health should be 90 + 10 = 100').toBe(100);

      dummy.heal(50);

      expect(dummy.health, 'health should not go above maxHealth').toBe(120);
    });
  });

  describe('computeDamage and attack (2 pts)', () => {
    it('should calculate damage without negative values', () => {
      const attacker = new TrainingDummy('Borin', 100, 10, 6);
      const target = new TrainingDummy('Aria', 100, 10, 20);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      expect(attacker.attack(target), 'damage should be 0, not 10 - 20 = -10').toBe(0);
      expect(target.health, 'the target should not gain health').toBe(100);

      log.mockRestore();
    });

    it('should attack another character', () => {
      const attacker = new TrainingDummy('Borin', 100, 10, 6);
      const target = new TrainingDummy('Aria', 100, 10, 5);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      const damage = attacker.attack(target);

      expect(damage, 'damage should be 10 (attack) - 5 (target defense) = 5').toBe(5);
      expect(target.health, 'target health should be 100 - 5 = 95').toBe(95);

      expect(log).toHaveBeenCalledWith(
        'Borin hits Aria for 5 damage (Aria: 95/100).',
      );

      const armed = new TrainingDummy('Kael', 60, 12, 2);

      armed.equip(new Weapon('Excalibur', 'sword', 8));

      expect(armed.attack(target), 'damage should be 12 + 8 (weapon bonus) - 5 (target defense) = 15').toBe(15);
      expect(target.health, 'target health should be 95 - 15 = 80').toBe(80);

      log.mockRestore();
    });

    it('should display a KO message when the target dies', () => {
      const attacker = new TrainingDummy('Borin', 100, 10, 6);
      const target = new TrainingDummy('Aria', 5, 10, 0);

      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      attacker.attack(target);

      expect(target.isAlive()).toBe(false);
      expect(log).toHaveBeenCalledWith('Aria is KO!');

      log.mockRestore();
    });

    it('should prevent a KO character from attacking', () => {
      const attacker = new TrainingDummy('Borin', 20, 10, 6);
      const target = new TrainingDummy('Aria', 20, 10, 5);

      attacker.takeDamage(20);

      expect(() => attacker.attack(target)).toThrow(
        'Borin is KO and cannot attack',
      );
    });

    it('should prevent a character from attacking themselves', () => {
      const dummy = new TrainingDummy('Aria', 20, 10, 6);

      expect(() => dummy.attack(dummy)).toThrow(
        'Aria cannot attack themselves',
      );
    });

    it('should prevent attacking a KO target', () => {
      const attacker = new TrainingDummy('Borin', 20, 10, 6);
      const target = new TrainingDummy('Aria', 20, 10, 5);

      target.takeDamage(20);

      expect(() => attacker.attack(target)).toThrow(
        'Aria is already KO',
      );
    });
  });
});
