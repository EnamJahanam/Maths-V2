/**
 * @fileoverview This file contains the TypeScript definitions for the Supabase database schema.
 * It is used by the Supabase client to provide type-safe database operations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          name: string
          role: "admin" | "teacher" | "student" | "parent"
          child_id: string | null
        }
        Insert: {
          id: string
          name: string
          role: "admin" | "teacher" | "student" | "parent"
          child_id?: string | null
        }
        Update: {
          name?: string
          role?: "admin" | "teacher" | "student" | "parent"
          child_id?: string | null
        }
        Relationships: []
      }
      progress: {
        Row: {
          id: number
          user_id: string
          created_at: string
          operation: "addition" | "subtraction" | "multiplication"
          stage: number
          score: number
          total_time: number
        }
        Insert: {
          id?: number // pk, auto-increment
          user_id: string
          created_at?: string // default now()
          operation: "addition" | "subtraction" | "multiplication"
          stage: number
          score: number
          total_time: number
        }
        Update: {
          id?: number
          user_id?: string
          created_at?: string
          operation?: "addition" | "subtraction" | "multiplication"
          stage?: number
          score?: number
          total_time?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
