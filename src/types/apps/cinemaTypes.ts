import * as v from 'valibot'

// Film Validation Schema
export const FilmSchema = v.object({
  id: v.optional(v.string()),
  filmTitle: v.pipe(v.string(), v.minLength(1, 'Judul film wajib diisi')),
  filmDescription: v.pipe(v.string(), v.minLength(1, 'Deskripsi film wajib diisi')),
  filmReleaseDate: v.string(), // ISO String
  filmDuration: v.pipe(v.number(), v.minValue(1, 'Durasi minimal 1 menit')),
  filmGenre: v.pipe(v.string(), v.minLength(1, 'Genre wajib diisi')),
  filmDirector: v.pipe(v.string(), v.minLength(1, 'Sutradara wajib diisi')),
  filmRating: v.pipe(v.string(), v.minLength(1, 'Rating wajib diisi')), // e.g. SU, R13, D17
  filmPosterUrl: v.optional(v.string()),
  filmTrailerUrl: v.optional(v.string()),
  filmIsActive: v.boolean()
})

export type FilmData = v.InferOutput<typeof FilmSchema>

// Studio Validation Schema
export const StudioSchema = v.object({
  id: v.optional(v.string()),
  studioName: v.pipe(v.string(), v.minLength(1, 'Nama studio wajib diisi')),
  studioType: v.pipe(v.string(), v.minLength(1, 'Tipe studio wajib diisi')), // e.g. Regular, IMAX, Gold
  studioCapacity: v.pipe(v.number(), v.minValue(1, 'Kapasitas minimal 1')),
  studioStatus: v.boolean()
})

export type StudioData = v.InferOutput<typeof StudioSchema>

// Schedule Validation Schema
export const ScheduleSchema = v.object({
  id: v.optional(v.string()),
  scheduleFilmId: v.pipe(v.string(), v.minLength(1, 'Pilih film')),
  scheduleStudioId: v.pipe(v.string(), v.minLength(1, 'Pilih studio')),
  scheduleDate: v.string(), // e.g. 2024-04-13
  scheduleStartTime: v.string(), // e.g. 14:00
  scheduleEndTime: v.string(), // e.g. 16:30
  schedulePrice: v.pipe(v.number(), v.minValue(0, 'Harga tidak boleh negatif'))
})

export type ScheduleData = v.InferOutput<typeof ScheduleSchema>
