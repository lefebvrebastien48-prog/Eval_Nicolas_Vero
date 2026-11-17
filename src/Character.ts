import { Weapon } from './Weapon';

export abstract class Character {
    public readonly name: string;
    public readonly maxHealth: number;
    public readonly baseAttack: number;
    public readonly baseDefense: number;
    private _health: number;
    private _weapon: Weapon | null = null;

    public constructor(name: string, health: number, baseAttack: number, baseDefense: number){
        if (health <= 0){
            throw new Error(`The health of ${name} must be greater than 0.`);
        }
        this.maxHealth = health;
        this._health = health;
        this.name = name;
        this.baseAttack= baseAttack;
        this.baseDefense = baseDefense;
}

    public get health(): number{
        return this._health;
    }
    public abstract getAttack(): number;
    public abstract canEquip(weapon:Weapon): boolean;
    protected getWeaponAttakBonud(): number{
        return this._weapon ? this._weapon.attackBonus : 0;
    }
    public isAlive(): boolean {
        return this._health>0;
    }
    public describe(): string {
        const weaponName = this._weapon ? this._weapon.name : 'None';
        return `${this.name} (Health: ${this._health}/${this.maxHealth}, Attack: ${this.getAttack()}, Defense: ${this.baseDefense}, Weapon: ${weaponName})`;
    }
    public equip(weapon: Weapon): void {
        if (!this.canEquip(weapon)){
            throw new Error(`${this.name} cannot equip ${weapon.name}.`);
        }
        this._weapon = weapon;
    }
    public takeDamage(damage: number): void {
        const actualDamage = Math.max(0, damage - this.baseDefense);
        this._health = Math.max(0, this._health - actualDamage);
    }
    public heal(amount: number): void {
        this._health = Math.min(this.maxHealth, this._health + amount);
    }
    protected computeDamage(target: Character): number {
        const damage = this.getAttack() - target.baseDefense;
        return Math.max(0, damage);
    }
    public attack(target: Character): void {
        if (!this.isAlive()){
            throw new Error(`${this.name} is KO.`);
        }
        if (!target.isAlive()){
            throw new Error(`${target.name} is KO.`);
        }
        if (!target.isAlive() || !this.isAlive()){
            throw new Error(`Cannot attack a KO character.`);
        }
        const damage = this.computeDamage(target);
        target.takeDamage(damage);
        console.log(`${this.name} attacks ${target.name} for ${damage} damage.`);
        if (!target.isAlive()){
            console.log(`${target.name} is KO.`);
        }
        return damage;
    }
}