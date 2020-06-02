export type BootstrapOptions = {
  prompt?: string
  messages?: { notFound?: string; wrongUsage?: string }
  shellPrinter?: (value: any) => void
}
