import { Entity, Column, BeforeInsert, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('telemetries')
export class Telemetry {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'vehicle_id', type: 'uuid' })
    vehicleId: string;

    @Column({ name: 'vehicle_plate' })
    vehiclePlate: string;

    @Column('decimal', { precision: 10, scale: 7 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 7 })
    longitude: number;

    @Column('float')
    speed: number;

    @Column('float')
    fuel: number;

    @Column({ type: 'timestamp'})
    timestamp: Date;

    @BeforeInsert()
    public generateId() {
        if (!this.id) {
            this.id = uuidv7();
        }
    }
}
