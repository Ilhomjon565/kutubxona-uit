import { z } from "zod"

export const bookSchema = z.object({
  title: z.string().min(1, "Kitob nomi kiritilishi shart").max(200, "Kitob nomi 200 ta belgidan oshmasligi kerak"),
  description: z.string().min(10, "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak").max(1000, "Tavsif 1000 ta belgidan oshmasligi kerak"),
  category: z.string().min(1, "Kategoriya tanlanishi shart"),
  downloadLink: z.string().url("To'g'ri URL formatida kiriting").min(1, "Yuklab olish havolasi kiritilishi shart"),
  image: z.any().optional()
})

export const categorySchema = z.object({
  name: z.string().min(1, "Kategoriya nomi kiritilishi shart").max(100, "Kategoriya nomi 100 ta belgidan oshmasligi kerak")
})

export const loginSchema = z.object({
  username: z.string().min(1, "Foydalanuvchi nomi kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart")
})

export type BookFormData = z.infer<typeof bookSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type LoginFormData = z.infer<typeof loginSchema>

