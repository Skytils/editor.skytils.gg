export interface EditorLink {
  name: string
  description: string
  route: string
}

export interface HostOptions {
  host: string
  port: number
  password?: string
}

export interface ApiResponse {
  categories: WaypointCategory[]
}

export interface WaypointCategory {
  name: string
  waypoints: WaypointOptions[]
  island: string
}

export interface SkyblockIslandData {
  mode: string
  displayName: string
}

export interface ApiResponseCategory {
  name: string
  waypoints: ApiResponseWaypointOptions[]
  island: string
}

export interface WaypointOptions {
  name: string
  x: number
  y: number
  z: number
  enabled: boolean
  color: string
  addedAt: number
}

interface ApiResponseWaypointOptions {
  name: string
  x: number
  y: number
  z: number
  enabled: boolean
  color: number
  addedAt: number
}
