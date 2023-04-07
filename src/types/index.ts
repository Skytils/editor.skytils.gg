export interface HostOptions {
    host: string;
    port: number;
    password?: string;
}

export interface ApiResponse {
    categories: WaypointCategory[];
}

export interface WaypointCategory {
    name: string;
    waypoints: WaypointOptions[];
    island: string;
}

interface WaypointOptions {
    name: string;
    x: number;
    y: number;
    z: number;
    enabled: boolean;
    color: number;
    addedAt: number;
}
