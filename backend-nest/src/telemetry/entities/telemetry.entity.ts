import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('telemetries')
export class Telemetry {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'vehicle_id' })
    vehicleId: number;

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
}
