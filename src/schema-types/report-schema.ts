import z from "zod"

export const AbnormalRegionSchema = z.object({
  NumberOfVoxels: z.number(),
  PeakMNICoordinate: z.array(z.number()),
  PeakMICoordinateRegion: z.array(z.string()),
  PeakMICoordinateEnglishRegion: z.array(z.string()),
  PeakIntensity: z.number(),
  ContainedStructs: z.array(
    z.object({
      Voxels: z.number(),
      Struct: z.string(),
    }),
  ),
  Label: z.number(),
})

export type AbnormalRegionSchemaType = z.infer<typeof AbnormalRegionSchema>
