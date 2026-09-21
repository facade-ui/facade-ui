import { notFound } from "next/navigation"

import { demos } from "@/demos"
import { PreviewBridge } from "@/components/preview-bridge"
import { FacadeMotionProvider } from "@registry/motion/facade-motion-provider"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(demos).map((name) => ({ name }))
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const Demo = demos[name]
  if (!Demo) notFound()

  return (
    <FacadeMotionProvider>
      <PreviewBridge name={name}>
        <div className="p-6 sm:p-10">
          <Demo />
        </div>
      </PreviewBridge>
    </FacadeMotionProvider>
  )
}
