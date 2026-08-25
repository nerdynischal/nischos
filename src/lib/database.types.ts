export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          icon_tone: string | null
          thumbnail: string | null
          type: string | null
          model: string | null
          story: string | null
          screenshots: string[] | null
          demo_url: string | null
          source_url: string | null
          post_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          title: string
          subtitle?: string | null
          icon_tone?: string | null
          thumbnail?: string | null
          type?: string | null
          model?: string | null
          story?: string | null
          screenshots?: string[] | null
          demo_url?: string | null
          source_url?: string | null
          post_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          icon_tone?: string | null
          thumbnail?: string | null
          type?: string | null
          model?: string | null
          story?: string | null
          screenshots?: string[] | null
          demo_url?: string | null
          source_url?: string | null
          post_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          filename: string | null
          date: string
          folder: 'Notes' | 'Build Logs' | 'Drafts' | null
          cover_tone: string | null
          is_pinned: boolean
          content_markdown: string | null
          content: string[] | null
          created_at: string
        }
        Insert: {
          id: string
          title: string
          filename?: string | null
          date: string
          folder?: 'Notes' | 'Build Logs' | 'Drafts' | null
          cover_tone?: string | null
          is_pinned?: boolean
          content_markdown?: string | null
          content?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          filename?: string | null
          date?: string
          folder?: 'Notes' | 'Build Logs' | 'Drafts' | null
          cover_tone?: string | null
          is_pinned?: boolean
          content_markdown?: string | null
          content?: string[] | null
          created_at?: string
        }
        Relationships: []
      }
      settings_sections: {
        Row: {
          id: string
          label: string
          display_title: string | null
          display_subtitle: string | null
          body: string | null
          details: Json | null
          items: string[] | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id: string
          label: string
          display_title?: string | null
          display_subtitle?: string | null
          body?: string | null
          details?: Json | null
          items?: string[] | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          label?: string
          display_title?: string | null
          display_subtitle?: string | null
          body?: string | null
          details?: Json | null
          items?: string[] | null
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
